// api.js
import axios from "axios";
import { environment } from "../constants/environment";
import { Helper } from "./Helper";

export class Api {
  static async callApi(apiParams,contentType) {
    try {
      const url = apiParams.ignoreBaseUrl
        ? apiParams.url
        : environment.baseUrl + apiParams.url;
  
      console.log("API URL:", url);
      console.log("API PARAMS:", apiParams);
  
      const configuration = {
        headers: {
          authorization: await Helper.getUserToken(),
        },
      };
    
      if (contentType) {
        configuration.headers["Content-Type"] = contentType;
      } else if (apiParams.requestMethod === "post" || apiParams.requestMethod === "put") {
        configuration.headers["Content-Type"] = "multipart/form-data";
      } else {
        configuration.headers["Content-Type"] = "application/json";
      }
  
      let axiosInstance;
  
      switch (apiParams.requestMethod) {
        case "post":
          axiosInstance = axios.post(url, apiParams.input, configuration);
          break;
  
        case "put":
          axiosInstance = axios.put(url, apiParams.input, configuration);
          break;
  
        case "delete":
          axiosInstance = axios.delete(url, { ...configuration, data: apiParams.input });
          break;
  
        default:
          axiosInstance = axios.get(url, configuration);
          break;
      }
  
      const response = await axiosInstance;
  
      console.log("API RESPONSE:", response.data);
  
      if (apiParams.response && response && response.data) {
        apiParams.response(response.data);
        Api.handleAfterResponse(apiParams, response.data);
      }
    } catch (error) {
      console.log("API ERROR:", error);
  
      if (apiParams.errorFunction && error.response && error.response.data) {
        apiParams.errorFunction(error.response.data);
        Api.handleError(apiParams, error.response);
      }
    } finally {
      if (apiParams.endFunction) {
        apiParams.endFunction();
      }
    }
  }
  

  static handleAfterResponse(apiParams, response) {
    if (apiParams.hideResponseMsg) {
      return;
    }
    if (response && response.message) {
      Api.showSuccessMessage(response.message);
    }
  }

  static handleError(apiParams, error) {
    if (error) {
      Api.showErrorMessage(error.data.message || error.error);
    }
  }

  static showSuccessMessage(message) {
    // Implement your success message display logic here
    console.log("Success Message:", message);
  }

  static showErrorMessage(message) {
    // Implement your error message display logic here
    console.log("Error Message:", message);
  }
}
