/**
 * Resets the serial field if it matches the given string
 * @param serialNumber The serial number to check
 */
private static void resetSerialField(String serialNumber)
{
	if(serialNumber.equals(FR_SERIAL_NUMBER.getValue()))
	{
		flexi.setStatusMessage("Serial number is already selected, please choose another serial number.");
		FR_SERIAL_NUMBER.reset();
		event.preventDefault();
	}
}

/**
 * Extracts numeric details from a string
 * @param input The input string to process
 * @return JSONObject containing the extracted number and its index
 */
private static JSONObject extractNumericDetails(String input) {
	String[] numbers = input.split("\\D+");
	JSONObject details = new JSONObject();
	String result = "-1";
	int index = 0;
	
	if (numbers.length > 0)
	{
		result = numbers[numbers.length-1];
		index = input.lastIndexOf(result);
	}
	
	details.put("result",result.trim());
	details.put("index",index);
	
	return details;
}

/**
 * Validates and processes serial numbers from the serial object
 */
private static void processSerialObject() {
	if (flexi.getObject("SERIAL_OBJ") == null) {
		return;
	}
	
	logger.info("SERIAL_OBJ"+ flexi.getObject("SERIAL_OBJ"));
	ArrayList serialList = flexi.getObject("SERIAL_OBJ");
	for(int i = 0; i < serialList.size(); i++) {
		HashMap serialItem = (HashMap) serialList.get(i);
		Set keys = serialItem.keySet();
		Iterator itr = keys.iterator();
		
		while(itr.hasNext()) {
			String key = (String) itr.next();
			resetSerialField(key);
			resetSerialField((String) serialItem.get(key));
		}
	}
}

/**
 * Updates the TO_SERIAL_NUMBER based on the serial range
 * @param itemData JSONArray containing serial number data
 * @param range The range of serial numbers to process
 */
private static void updateToSerialNumber(JSONArray itemData, int range) {
	String currentSerial = FR_SERIAL_NUMBER.getValue();
	String toSerial = currentSerial;
	
	for (int i = 0; i < itemData.length(); i++) {
		if (!itemData.getJSONObject(i).getString("SerialNumber").equals(currentSerial)) {
			continue;
		}
		
		toSerial = findValidSerialRange(itemData, i, range, currentSerial);
		break;
	}
	logger.info("TO_SERIAL"+toSerial);
	TO_SERIAL_NUMBER.setValue(toSerial);
}

/**
 * Finds a valid serial range based on consecutive serial numbers
 * @param itemData JSONArray containing serial number data
 * @param startIndex Starting index in the itemData
 * @param range Maximum range to check
 * @param initialSerial Initial serial number
 * @return The last valid serial number in the range
 */
private static String findValidSerialRange(JSONArray itemData, int startIndex, int range, String initialSerial) {
	String previousSerial = initialSerial;
	String currentSerial = initialSerial;
	
	for (int n = startIndex; n < startIndex + range && n < itemData.length(); n++) {
		currentSerial = itemData.getJSONObject(n).getString("SerialNumber");
		
		if (!isConsecutiveSerial(previousSerial, currentSerial)) {
			break;
		}
		
		previousSerial = currentSerial;
	}
	
	return previousSerial;
}

/**
 * Checks if two serial numbers are consecutive
 * @param previous Previous serial number
 * @param current Current serial number
 * @return true if the serials are consecutive, false otherwise
 */
private static boolean isConsecutiveSerial(String previous, String current) {
	JSONObject prevDetails = extractNumericDetails(previous);
	JSONObject currDetails = extractNumericDetails(current);
	
	long prevNum = Long.parseLong(prevDetails.getString("result"));
	long currNum = Long.parseLong(currDetails.getString("result"));
	
	if (prevNum <= 0) {
		return false;
	}
	
	String prevPrefix = previous.substring(0, prevDetails.getInt("index"));
	String currPrefix = current.substring(0, currDetails.getInt("index"));
	
	return prevPrefix.equals(currPrefix) && (currNum - prevNum <= 1);
}

/**
 * Main processing logic for serial number handling
 */
private static void processSerialNumber() {
	if (FR_SERIAL_NUMBER.getValue().length() == 0) {
		return;
	}

	if (!"2".equals(flexi.getObject("LOT_CONTROL_CODE").toString()) && "5".equals(flexi.getObject("SERIAL_CONTROL_CODE").toString())) {
		
		processSerialObject();
		
		String serialPrefix = FR_SERIAL_NUMBER.getValue().substring(0, extractNumericDetails(FR_SERIAL_NUMBER.getValue()).getInt("index"));
		flexi.putObject("SERIAL_PREFIX", serialPrefix);
		logger.info("SERIAL_PREFIX"+ flexi.getObject("SERIAL_PREFIX"));
		
		GET_ALL_SERIAL_WS.callWebService();
		if (GET_ALL_SERIAL_WS.getResponseCode() == 200) {
			JSONObject response = new JSONObject(GET_ALL_SERIAL_WS.getRawResponse());
			JSONArray itemData = response.getJSONArray("items");
			int range = Integer.parseInt(SERIAL_COUNT.getValue());
			
			updateToSerialNumber(itemData, range);
		}
	}
	
	updateUIVisibility();
}

/**
 * Updates the visibility of UI components
 */
private static void updateUIVisibility() {
	TO_SERIAL_NUMBER.setHidden(false);
	NEXT.setHidden(false);
	DONE.setHidden(false);
	CANCEL.setHidden(false);
}

// Main execution
processSerialNumber();
