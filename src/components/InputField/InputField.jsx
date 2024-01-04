import React, { useState } from "react";
import "./inputField.css";
import { BsFillEyeSlashFill, BsFillEyeFill } from "react-icons/bs";
const InputField = (props) => {
  const fieldProperties = props.properties;

  const [passwordShown, setPasswordShown] = useState(false);
  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };
  const textStyle = {
    fontSize: "0.80rem",
    marginTop: "3px",
    width: "100%",
    background: "#fff",
    outline: "none",
    borderRadius: "5px",
    border: "1px solid #b9bcbf",
    padding: "8px",
  };
  const style = {
    border:
      fieldProperties.for === "set" ? `1px solid black` : `1px solid #b9bcbf`,
    borderRadius: " 5px",
    overflow: "hidden",
    width: "100%",
    position: "relative",
    display: "flex",
    flexDirection: "row",
    marginTop: fieldProperties.for === "set" ? "0" : `1%`,
  };
  const input_cont = {
    background: "transparent",
    display: "inline-block",
    color: "rgb(102, 102, 102)",
    fontSize: "0.75rem",
    width: "100%",
    height: "37px",
    padding: "0 2%",
    outline: "none",
  };
  const Errorstyle = {
    border: "1px solid red",
    borderRadius: " 5px",
    overflow: "hidden",
    width: "100%",
    position: "relative",
    display: "flex",
    flexDirection: "row",
  };
  const placeholderText = () => {
    if (fieldProperties.fieldType === "number") {
      return "Enter mobile number";
    } else if (fieldProperties.fieldType === "alt-number") {
      return "Enter alternate mobile number";
    } else if (fieldProperties.fieldType === "password") {
      return "Enter password";
    } else if (fieldProperties.fieldType === "fullName") {
      return "Enter full name";
    } else if (fieldProperties.fieldType === "productName") {
      return "Enter Product name";
    } else if (fieldProperties.fieldType === "bidPrice") {
      return "Enter starting bid price";
    } else if (fieldProperties.fieldType === "currBidPrice") {
      return "Enter bid price";
    } else if (fieldProperties.fieldType === "duration") {
      return "Enter auction duration (in minutes)";
    } else if (fieldProperties.fieldType === "productDetails") {
      return "Enter product description";
    }
  };
  const label = () => {
    if (fieldProperties.fieldType === "number") {
      return "Mobile Number";
    } else if (fieldProperties.fieldType === "official-number") {
      return "Official Phone Number";
    } else if (fieldProperties.fieldType === "alt-number") {
      return "Alternate Mobile Number";
    } else if (fieldProperties.fieldType === "password") {
      return "Password";
    } else if (fieldProperties.fieldType === "fullName") {
      return "Full Name";
    } else if (fieldProperties.fieldType === "productName") {
      return "Product Name";
    } else if (fieldProperties.fieldType === "bidPrice") {
      return "Starting Bid Price";
    } else if (fieldProperties.fieldType === "duration") {
      return "Auction Duration";
    } else if (fieldProperties.fieldType === "productDetails") {
      return "Product Description";
    }
  };
  const inputType = () => {
    if (
      fieldProperties.fieldType === "number" ||
      fieldProperties.fieldType === "postal"
    ) {
      return "number";
    } else if (fieldProperties.fieldType === "alt-number") {
      return "number";
    } else if (fieldProperties.fieldType === "bidPrice") {
      return "number";
    } else if (fieldProperties.fieldType === "duration") {
      return "number";
    } else if (fieldProperties.fieldType === "n-password") {
      if (passwordShown) {
        return "text";
      } else {
        return "password";
      }
    } else if (fieldProperties.fieldType === "password") {
      if (passwordShown) {
        return "text";
      } else {
        return "password";
      }
    } else if (fieldProperties.fieldType === "cpassword") {
      if (passwordShown) {
        return "text";
      } else {
        return "password";
      }
    } else if (fieldProperties.fieldType === "dop") {
      return "date";
    } else {
      return "text";
    }
  };
  return (
    <div style={{ position: "relative" }}>
      <label className="custom-label ">
        {label()}{" "}
        {fieldProperties.require ? (
          <span className="require-star">*</span>
        ) : null}
      </label>{" "}
      <br />
      {fieldProperties.fieldType === "address" ||
      fieldProperties.fieldType === "teamDiscription" ||
      fieldProperties.fieldType === "b-address" ||
      fieldProperties.fieldType === "description" ||
      fieldProperties.fieldType === "remark" ? (
        <textarea
          onChange={props.onChange}
          id="txtid"
          name="txtname"
          rows="4"
          maxLength="200"
          placeholder={placeholderText()}
          style={textStyle}
          onBlur={props.onBlur}
          value={props.value}
          disabled={props.disabled}
        ></textarea>
      ) : (
        <div style={props.style === "style" ? style : Errorstyle}>
          <input
            style={input_cont}
            className="inputField"
            type={inputType()}
            placeholder={placeholderText()}
            onChange={props.onChange}
            // onKeyPress={props.onKeyPress}
            onInput={props.onInput}
            maxLength={props.maxLength}
            onBlur={props.onBlur}
            value={props.value}
            disabled={props.disabled}
          />
          {fieldProperties.fieldType === "password" ||
          fieldProperties.fieldType === "cpassword" ||
          fieldProperties.fieldType === "n-password" ? (
            <span className="cp-viewer">
              {passwordShown ? (
                <BsFillEyeFill onClick={togglePassword} color="#33333360" />
              ) : (
                <BsFillEyeSlashFill
                  onClick={togglePassword}
                  color="#33333360"
                />
              )}
            </span>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default InputField;
