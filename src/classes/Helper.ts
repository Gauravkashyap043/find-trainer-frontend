import { LocalStorages } from "./LocalStorages";

export class Helper {
  static async handleLoginData(obj: any, callback: (result: any) => void): Promise<void> {
    await LocalStorages.storeObject("USER_DATA", obj, callback);
  }

  static async getLoginData(callback: (data: any) => void): Promise<void> {
    await LocalStorages.getObject("USER_DATA", (data) => {
      callback(data);
    });
  }

  static async logOut(): Promise<void> {
    await LocalStorages.removeObject("USER_DATA", () => {
      console.log("DATA REMOVED");
    });
  }

  static async getUserToken(): Promise<string | null> {
    return new Promise<string | null>((resolve, reject) => {
      Helper.getLoginData((data) => {
        if (data && data.result && data.result.accessToken) {
          resolve(data.result.accessToken);
        } else {
          resolve(null);
        }
      });
    });
  }
}
