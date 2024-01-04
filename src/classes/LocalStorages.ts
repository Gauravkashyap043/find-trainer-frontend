export class LocalStorages {
  static async storeObject(keyName: string, obj: any, callback: (result: any) => void): Promise<void> {
    try {
      const json = JSON.stringify(obj);
      await localStorage.setItem(keyName, json);
      callback(obj);
    } catch (e) {
      console.log(e);
    }
  }

  static async getObject(keyName: string, callback: (result: any) => void): Promise<void> {
    try {
      let result = await localStorage.getItem(keyName);
      if (result) {
        result = JSON.parse(result);
      } else {
        result = null;
      }
      callback(result);
    } catch (e) {
      console.log(e);
    }
  }

  static async getValue(keyName: string, callback: (result: any) => void): Promise<void> {
    try {
      let result = await localStorage.getItem(keyName);
      if (!result) {
        result = null;
      }
      callback(result);
    } catch (e) {
      console.log(e);
    }
  }

  static async removeObject(keyName: string, callback: () => void): Promise<void> {
    try {
      await localStorage.removeItem(keyName);
      callback();
    } catch (e) {
      console.log(e);
    }
  }
}
