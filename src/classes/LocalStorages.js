export class LocalStorages {
  // static async storeValue(keyName, value, callback) {
  //   try {
  //     const result = await localStorage.setItem(keyName, value);
  //     callback(result);
  //   } catch (e) {
  //     console.log(e);
  //   }
  // }

  static async storeObject(keyName, obj, callback) {
    try {
      const json = JSON.stringify(obj);
      const result = await localStorage.setItem(keyName, json);
      callback(result);
    } catch (e) {
      console.log(e);
    }
  }

  static async getObject(keyName, callback) {
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

  static async getValue(keyName, callback) {
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

  static async removeObject(keyName, callback) {
    try {
      await localStorage.removeItem(keyName);
      callback();
    } catch (e) {
      console.log(e);
    }
  }
}
