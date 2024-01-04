import axios, { AxiosInstance, AxiosResponse } from "axios";
import { environment } from "../constants/environment";
import { Helper } from "./Helper";

export type ApiParams = {
  url: string;
  ignoreBaseUrl?: boolean;
  requestMethod: "get" | "post" | "put" | "delete";
  response?: (data: any) => void;
  errorFunction?: (error: any) => void;
  endFunction?: () => void;
  input?: any;
  hideResponseMsg?: boolean;
};

type Headers = {
  authorization: any;
  "Content-Type"?: string;
};

export class Api {
  static async callApi(apiParams: ApiParams, contentType: string) {
    try {
      const url = apiParams.ignoreBaseUrl
        ? apiParams.url
        : environment.baseUrl + apiParams.url;

      console.log("API URL:", url);
      console.log("API PARAMS:", apiParams);

      const headers: Headers = {
        authorization: await Helper.getUserToken(),
      };

      if (contentType) {
        headers["Content-Type"] = contentType;
      } else if (
        apiParams.requestMethod === "post" ||
        apiParams.requestMethod === "put"
      ) {
        headers["Content-Type"] = "multipart/form-data";
      } else {
        headers["Content-Type"] = "application/json";
      }

      const configuration = {
        headers,
      };

      let axiosInstance: Promise<AxiosResponse<any, any>>;

      switch (apiParams.requestMethod) {
        case "post":
          axiosInstance = axios.post(url, apiParams.input, configuration);
          break;

        case "put":
          axiosInstance = axios.put(url, apiParams.input, configuration);
          break;

        case "delete":
          axiosInstance = axios.delete(url, {
            ...configuration,
            data: apiParams.input,
          });
          break;

        default:
          axiosInstance = axios.get(url, configuration);
          break;
      }

      const response: AxiosResponse<any, any> = await axiosInstance;

      console.log("API RESPONSE:", response.data);

      if (apiParams.response && response && response.data) {
        apiParams.response(response.data);
        Api.handleAfterResponse(apiParams, response.data);
      }
    } catch (error:any) {
      console.log("API ERROR:", error);

      if (
        apiParams.errorFunction &&
        error.response &&
        error.response.data
      ) {
        apiParams.errorFunction(error.response.data);
        Api.handleError(apiParams, error.response);
      }
    } finally {
      if (apiParams.endFunction) {
        apiParams.endFunction();
      }
    }
  }

  static handleAfterResponse(apiParams: ApiParams, response: any) {
    if (apiParams.hideResponseMsg) {
      return;
    }
    if (response && response.message) {
      Api.showSuccessMessage(response.message);
    }
  }

  static handleError(apiParams: ApiParams, error: any) {
    if (error) {
      Api.showErrorMessage(error.data.message || error.error);
    }
  }

  static showSuccessMessage(message: string) {
    // Implement your success message display logic here
    console.log("Success Message:", message);
  }

  static showErrorMessage(message: string) {
    // Implement your error message display logic here
    console.log("Error Message:", message);
  }
}
