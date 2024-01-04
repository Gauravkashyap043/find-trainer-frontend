import React, { useState } from "react";
import InputField from "../../components/InputField/InputField";
import { Api } from "../../classes/Api";
import { apiEndPoints } from "../../constants/apiEndPoints";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Register: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState<string>("");
  const [number, setNumber] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [fullNameError, setFullNameError] = useState<string>("");
  const [numberError, setNumberError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");

  const navigate = useNavigate();

  const submitForm = () => {
    let fullNameValid = false;
    if (!fullName) {
      setFullNameError("! Full Name is required");
    } else if (fullName.length < 3) {
      setFullNameError("! Full Name should be at least 3 characters long");
    } else {
      setFullNameError("");
      fullNameValid = true;
    }

    let numberValid = false;
    if (!number) {
      setNumberError("! Number is required");
    } else if (number.length < 10) {
      setNumberError("! Invalid Number");
    } else {
      setNumberError("");
      numberValid = true;
    }

    let passwordValid = false;
    if (!password) {
      setPasswordError("! Password is required");
    } else if (password.length < 6) {
      setPasswordError("! Length should be 6");
    } else {
      setPasswordError("");
      passwordValid = true;
    }

    if (fullNameValid && numberValid && passwordValid) {
      setLoading(true);
      const apiParams:any = {
        url: `${apiEndPoints.register}`,
        requestMethod: "post",
        response: (res: any) => {
          setLoading(false);
          toast.success(res.message);
          navigate("/");
        },
        errorFunction: (error: any) => {
          console.log("---error--", error);
          toast.warn(error.message);
        },
        endFunction: () => {
          console.log("End Function Called");
        },
        input: {
          fullName: fullName,
          mobileNumber: number,
          password: password,
        },
      };
      Api.callApi(apiParams, "application/json");
    }
  };

  return (
    <div className="register-container h-screen w-screen">
      <div className="w-full mt-10">
        <div className="login-form w-[300px] px-2 py-5 border-2 m-auto flex flex-col justify-center rounded">
        <p className="text-center font-bold">Register</p>
          <div>
            <InputField
              onChange={(e:any) => setFullName(e.target.value)}
              properties={{
                fieldType: "fullName",
              }}
              style={!fullNameError ? "style" : "errorStyle"}
              value={fullName}
            />
            {fullNameError && (
              <p className="text-red-500 text-sm">{fullNameError}</p>
            )}
          </div>
          <div>
            <InputField
              onChange={(e:any) => setNumber(e.target.value)}
              onInput={(e:any) => {
                if (e.target.value.length > e.target.maxLength)
                  e.target.value = e.target.value.slice(0, e.target.maxLength);
              }}
              properties={{
                fieldType: "number",
              }}
              maxLength={10}
              style={"style"}
              value={number}
            />
            {numberError && (
              <p className="text-red-500 text-sm">{numberError}</p>
            )}
          </div>
          <div>
            <InputField
              onChange={(e:any) => setPassword(e.target.value)}
              properties={{
                fieldType: "password",
              }}
              maxLength={10}
              style={"style"}
              value={password}
            />
            {passwordError && (
              <p className="text-red-500 text-sm">{passwordError}</p>
            )}
          </div>
          <p className="text-right">
            Already have an account?{" "}
            <span
              className="text-blue-500 underline cursor-pointer"
              onClick={() => navigate("/")}
            >
              Sign in
            </span>
          </p>
          <div className="w-full flex justify-center items-center mt-5">
            <button
              className="w-[200px] py-2 border border-black rounded bg-black text-white hover:bg-white hover:text-black"
              onClick={submitForm}
            >
              {loading ? (
                <CircularProgress color="inherit" size={20} />
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
