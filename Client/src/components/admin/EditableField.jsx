import React from "react";
import "./EditableField.css";

const EditableField = ({
  type = "text",
  value,
  onChange,
  label,
  options = [],
}) => {
  // Helper function to safely convert any value to string
  const safeToString = (val) => {
    if (val === null || val === undefined) return "";
    return String(val);
  };

  // Helper function to safely handle array values
  const ensureArray = (val) => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    if (typeof val === "string")
      return val.split(",").map((item) => item.trim());
    return [safeToString(val)];
  };

  // Helper function to safely handle boolean values
  const ensureBoolean = (val) => {
    if (typeof val === "boolean") return val;
    if (val === "true") return true;
    if (val === "false") return false;
    return false;
  };

  const renderField = () => {
    switch (type) {
      case "array": {
        const arrayValue = ensureArray(value);
        return (
          <div className="array-input">
            {arrayValue.map((item, index) => (
              <div key={index} className="array-item">
                <input
                  type="text"
                  value={safeToString(item)}
                  onChange={(e) => {
                    const newArray = [...arrayValue];
                    newArray[index] = e.target.value;
                    onChange(newArray);
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    onChange(arrayValue.filter((_, i) => i !== index));
                  }}
                >
                  ×
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => onChange([...arrayValue, ""])}
              className="add-item"
            >
              + Add Item
            </button>
          </div>
        );
      }

      case "select":
        return (
          <select
            value={safeToString(value)}
            onChange={(e) => onChange(e.target.value)}
            className="select-input"
          >
            <option value="">Select {label}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case "boolean":
        return (
          <div className="boolean-input">
            <label>
              <input
                type="radio"
                checked={ensureBoolean(value) === true}
                onChange={() => onChange(true)}
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                checked={ensureBoolean(value) === false}
                onChange={() => onChange(false)}
              />
              No
            </label>
          </div>
        );

      case "textarea":
        return (
          <textarea
            value={safeToString(value)}
            onChange={(e) => onChange(e.target.value)}
            className="textarea-input"
          />
        );

      case "number":
        return (
          <input
            type="number"
            value={value === null || value === undefined ? "" : value}
            onChange={(e) => onChange(e.target.value)}
            className="number-input"
          />
        );

      case "date":
        return (
          <input
            type="date"
            value={safeToString(value)}
            onChange={(e) => onChange(e.target.value)}
            className="date-input"
          />
        );

      default:
        return (
          <input
            type={type}
            value={safeToString(value)}
            onChange={(e) => onChange(e.target.value)}
            className="text-input"
          />
        );
    }
  };

  return (
    <div className="editable-field">
      {label && <label>{label}:</label>}
      {renderField()}
    </div>
  );
};

export default EditableField;
