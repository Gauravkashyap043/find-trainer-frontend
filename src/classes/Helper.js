import { LocalStorages } from "./LocalStorages";
// import { toast } from "react-toastify";
import { data } from "autoprefixer";

export class Helper {
  // static showSuccessToastmessage(message) {
  //   toast.success(message, {
  //     position: toast.POSITION.BOTTOM_CENTER,
  //   });
  // }

  // static showFailedToastmessage(message) {
  //   toast.warn(message, {
  //     position: toast.POSITION.BOTTOM_CENTER,
  //   });
  // }

  static async handleLoginData(obj, callback) {
    await LocalStorages.storeObject("USER_DATA", obj, callback);
  }

  static async getLoginData(callback) {
    await LocalStorages.getObject("USER_DATA", (data) => {
      callback(data);
    });
  }
  static async logOut() {
    await LocalStorages.removeObject("USER_DATA", () => {
      console.log("DATA REMOVED");
    });
  }

  static async getUserToken() {
    return new Promise((resolve, reject) => {
      Helper.getLoginData((data) => {
        // console.log("sssssssssssssssssssss", data.result.accessToken);
        if (data && data.result.accessToken) {
          resolve(data.result.accessToken);
        } else {
          resolve(null);
        }
      });
    });
  }
}
