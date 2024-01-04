import React, { useState, ChangeEvent, FormEvent, FocusEvent } from "react";
import "./inputField.css";
import { BsFillEyeSlashFill, BsFillEyeFill } from "react-icons/bs";

interface InputFieldProps {
  properties: {
    fieldType: "number" | "password" | "fullName"; // Add other field types as needed
    for?: string;
    require?: boolean;
  };
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onInput?: (e: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  value: string;
  style?: string;
  maxLength?: number;
  disabled?: boolean;
}

const InputField: React.FC<InputFieldProps> = (props) => {
  const fieldProperties = props.properties;

  const [passwordShown, setPasswordShown] = useState(false);

  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };

  const textStyle: React.CSSProperties = {
    fontSize: "0.80rem",
    marginTop: "3px",
    width: "100%",
    background: "#fff",
    outline: "none",
    borderRadius: "5px",
    border: "1px solid #b9bcbf",
    padding: "8px",
  };

  const style: React.CSSProperties = {
    border: fieldProperties.for === "set" ? `1px solid black` : `1px solid #b9bcbf`,
    borderRadius: " 5px",
    overflow: "hidden",
    width: "100%",
    position: "relative",
    display: "flex",
    flexDirection: "row",
    marginTop: fieldProperties.for === "set" ? "0" : `1%`,
  };

  const inputContStyle: React.CSSProperties = {
    background: "transparent",
    display: "inline-block",
    color: "rgb(102, 102, 102)",
    fontSize: "0.75rem",
    width: "100%",
    height: "37px",
    padding: "0 2%",
    outline: "none",
  };

  const errorStyle: React.CSSProperties = {
    border: "1px solid red",
    borderRadius: " 5px",
    overflow: "hidden",
    width: "100%",
    position: "relative",
    display: "flex",
    flexDirection: "row",
  };

  const placeholderText = () => {
    switch (fieldProperties.fieldType) {
      case "number":
        return "Enter mobile number";
      case "password":
        return "Enter password";
      case "fullName":
        return "Enter full name";
      default:
        return "";
    }
  };

  const label = () => {
    switch (fieldProperties.fieldType) {
      case "number":
        return "Mobile Number";
      case "password":
        return "Password";
      case "fullName":
        return "Full Name";
      default:
        return "";
    }
  };

  const inputType = () => {
    switch (fieldProperties.fieldType) {
      case "number":
        return "number";
      case "password":
        return passwordShown ? "text" : "password";
      default:
        return "text";
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <label className="custom-label">
        {label()} {fieldProperties.require ? <span className="require-star">*</span> : null}
      </label>{" "}
      <br />
      <div style={props.style === "style" ? style : errorStyle}>
        <input
          style={inputContStyle}
          className="inputField"
          type={inputType()}
          placeholder={placeholderText()}
          onChange={props.onChange}
          onInput={props.onInput}
          maxLength={props.maxLength}
          onBlur={props.onBlur}
          value={props.value}
          disabled={props.disabled}
        />
        {fieldProperties.fieldType === "password"  ? (
            <span className="cp-viewer">
              {passwordShown ? (
                <BsFillEyeFill onClick={togglePassword} color="#33333360" />
              ) : (
                  <BsFillEyeSlashFill onClick={togglePassword} color="#33333360" />
                )}
            </span>
          ) : null}
      </div>
    </div>
  );
};

export default InputField;
