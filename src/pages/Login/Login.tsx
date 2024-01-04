import React, { useState } from "react";
import InputField from "../../components/InputField/InputField";
import { Api, ApiParams } from "../../classes/Api";
import { apiEndPoints } from "../../constants/apiEndPoints";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";
import { Helper } from "../../classes/Helper";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [usernameError, setUsernameError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");

  const navigate = useNavigate();

  const submitForm = () => {
    console.log("enter to form")
    let usernameValid = false;
    if (!username) {
      setUsernameError("! Number is required");
    } else {
      setUsernameError("");
      usernameValid = true;
    }

    let passwordValid = false;
    if (!password) {
      setPasswordError("! Password is required");
    } else {
      setPasswordError("");
      passwordValid = true;
    }

    if (usernameValid && passwordValid) {
      console.log("enter after validation")
      setLoading(true);
      const apiParams: ApiParams = {
        url: `${apiEndPoints.login}`,
        requestMethod: "post",
        response: (res: any) => {
          setLoading(false);
          toast.success(res.message);
          navigate("/find-trainer")
        },
        errorFunction: (error: any) => {
          console.log("---error--", error);
          toast.warn(error.message);
        },
        endFunction: () => {
          console.log("End Function Called");
        },
        input: {
          mobileNumber: username,
          password: password,
        },
      };
      Api.callApi(apiParams, "application/json");
    }
  };

  return (
    <div className="login-container h-screen w-screen">
      <div className="w-full mt-16">
        <div className="login-form w-[300px] py-5 px-2 border-2 m-auto flex flex-col justify-center">
          <p className="text-center font-bold">Login</p>
          <div>
            <InputField
              onChange={(e: any) => setUsername(e.target.value)}
              properties={{
                fieldType: "number",
              }}
              style={!usernameError ? "style" : "errorStyle"}
              value={username}
            />
            {usernameError && (
              <p className="text-red-500 text-sm">{usernameError}</p>
            )}
          </div>
          <div>
            <InputField
              onChange={(e: any) => setPassword(e.target.value)}
              properties={{
                fieldType: "password",
              }}
              style={!passwordError ? "style" : "errorStyle"}
              value={password}
            />
            {passwordError && (
              <p className="text-red-500 text-sm">{passwordError}</p>
            )}
          </div>
          <p className="text-right">
            Not an account?{" "}
            <span
              className="text-blue-500 underline cursor-pointer"
              onClick={() => navigate("/register")}
            >
              Sign up
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

export default Login;
