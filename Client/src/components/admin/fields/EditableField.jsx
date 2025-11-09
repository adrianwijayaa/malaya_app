import React from "react";
import "./EditableField.css";

/**
 * Reusable field component for editable forms inside the admin panel.
 * Supports input, textarea, and select types.
 */
const EditableField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  options = [],
  readOnly = false,
}) => {
  return (
    <div className="editable-field">
      {label && <label htmlFor={name}>{label}</label>}

      {type === "textarea" ? (
        <textarea
          id={name}
          name={name}
          value={value || ""}
          onChange={onChange}
          className="editable-textarea"
          readOnly={readOnly}
        />
      ) : type === "select" ? (
        <select
          id={name}
          name={name}
          value={value || ""}
          onChange={onChange}
          className="editable-select"
          disabled={readOnly}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value || ""}
          onChange={onChange}
          className="editable-input"
          readOnly={readOnly}
        />
      )}
    </div>
  );
};

export default EditableField;
