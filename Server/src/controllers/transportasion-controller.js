const Model = require("../models/index.js");
const Transportation = Model.TransportationPreference;
const TravelDetails = Model.TravelDetails;

const createTransportation = async (req, res) => {
  try {
    const {
      travelDetailsID,
      internationalFlightRequired,
      departureCity,
      domesticFlightRequired,
      domesticDepartureCity,
      prefferedTransportType,
    } = req.body;

    const requiredFields = {
      travelDetailsID: "Travel Details ID is required!",
      //   internationalFlightRequired: "International Flight is required!",
      //   departureCity: "Departure City is required!",
      //   domesticFlightRequired: "Domestic Flight is required!",
      //   domesticDepartureCity: "Domestic Departure City is required!",
      prefferedTransportType: "Preferred Transport Type is required!",
    };

    for (const [field, message] of Object.entries(requiredFields)) {
      if (!req.body[field]) {
        return res.status(400).json({ message });
      }
    }

    const travelDetails = await TravelDetails.findByPk(travelDetailsID);
    if (!travelDetails) {
      return res.status(400).json({
        error:
          "Invalid TravelDetailsID. The referenced travel details do not exist.",
      });
    }

    const validPrefferedTransportType = [
      "Private Car with Driver",
      "Shared Van/Bus Service",
      "Self-Drive Rental Car",
      "Motorcycle Rental",
      "Boat/Ferry Service",
      "Luxury Vehicle Service",
      "Mixed Transportation",
    ];
    if (!validPrefferedTransportType.includes(prefferedTransportType)) {
      return res.status(400).json({
        error: `Invalid Preffered Transport Type. Valid values are: ${validPrefferedTransportType.join(
          ", "
        )}`,
      });
    }

    const newTransportation = await Transportation.create({
      TravelDetailsID: travelDetailsID,
      InternationalFlightRequired: internationalFlightRequired,
      DepartureCity: departureCity,
      DomesticFlightRequired: domesticFlightRequired,
      DomesticDepartureCity: domesticDepartureCity,
      PreferredTransportType: prefferedTransportType,
    });

    return res.status(201).json({
      message: "Transportation Prefference created Successfully!",
      data: newTransportation,
    });
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).send({
      message:
        error.message || "An error occured while creating transportation",
    });
  }
};

const getAllTransportation = async (req, res) => {
  try {
    const allTransportation = await Transportation.findAll();

    if (allTransportation.length === 0) {
      return res
        .status(404)
        .json({ message: "No Transportation Prefference found!" });
    }

    const travelIDs = allTransportation.map((detail) => detail.TravelDetailsID);

    const travelDetails = await TravelDetails.findAll({
      where: { id: travelIDs },
    });

    const transportationWithTravel = allTransportation.map((detail) => {
      const travelDetail = travelDetails.find(
        (travel) => travel.id === detail.TravelDetailsID
      );
      return {
        ...detail.dataValues,
        TravelDetailsID: travelDetail ? [travelDetail.dataValues] : [],
      };
    });

    return res.status(200).json(transportationWithTravel);
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).send({
      message: error.message,
    });
  }
};

const getTransportationById = async (req, res) => {
  try {
    const { id } = req.params;

    const transportation = await Transportation.findByPk(id);

    if (!transportation) {
      return res.status(404).json({
        message: `Transportation Prefference with ID ${id} not found`,
      });
    }

    const travelDetail = await TravelDetails.findByPk(
      transportation.TravelDetailsID
    );

    const transportationWithTravelDetail = {
      ...transportation.dataValues, // Data dari TravelDetail
      TravelDetailsID: travelDetail ? [travelDetail.dataValues] : [], // Data dari PersonalInfo
    };

    return res.status(200).json({
      message: "Transportation Prefference found",
      data: transportationWithTravelDetail,
    });
  } catch (error) {
    console.error("Error: ", error);
    return res.status(500).json({
      message: "Internal Server error",
      error: error.message,
    });
  }
};

const updateTransportation = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      travelDetailsID,
      InternationalFlightRequired,
      DepartureCity,
      DomesticFlightRequired,
      DomesticDepartureCity,
      PreferredTransportType,
    } = req.body;

    if (PreferredTransportType !== undefined) {
      const validPrefferedTransportType = [
        "Private Car with Driver",
        "Shared Van/Bus Service",
        "Self-Drive Rental Car",
        "Motorcycle Rental",
        "Boat/Ferry Service",
        "Luxury Vehicle Service",
        "Mixed Transportation",
      ];
      if (!validPrefferedTransportType.includes(PreferredTransportType)) {
        return res.status(400).json({
          error: `Invalid Preffered Transport Type. Valid values are: ${validActivityLevel.join(
            ", "
          )}`,
        });
      }
    }

    const transportationPrefference = await Transportation.findByPk(id);

    if (!transportationPrefference) {
      return res.status(404).json({
        message: `Transportation Prefference dengan ID ${id} tidak ditemukan`,
      });
    }

    await transportationPrefference.update({
      TravelDetailsID: travelDetailsID,
      InternationalFlightRequired: InternationalFlightRequired,
      DepartureCity: DepartureCity,
      DomesticFlightRequired: DomesticFlightRequired,
      DomesticDepartureCity: DomesticDepartureCity,
      PreferredTransportType: PreferredTransportType,
    });

    const travelDetail = await TravelDetails.findByPk(
      transportationPrefference.TravelDetailsID
    );

    const transportationWithTravelDetail = {
      ...transportationPrefference.get(), // Data dari TravelDetail
      TravelDetailsID: travelDetail ? [travelDetail.dataValues] : [], // Data dari PersonalInfo
    };

    return res.status(200).json(transportationWithTravelDetail);
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ message: "internal server error!" });
  }
};

const deleteTransportation = async (req, res) => {
  try {
    const { id } = req.params;

    const transportation = await Transportation.findByPk(id);

    if (!transportation) {
      return res.status(404).json({
        message: `Transportation Preferences dengan ID ${id} tidak ditemukan`,
      });
    }

    await transportation.destroy();

    res.status(200).json({
      message: `Transportation Prefference dengan ID ${id} berhasil dihapus`,
    });
  } catch (error) {
    console.error("Error deleting user:", error.message);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
module.exports = {
  createTransportation,
  getAllTransportation,
  getTransportationById,
  updateTransportation,
  deleteTransportation,
};
