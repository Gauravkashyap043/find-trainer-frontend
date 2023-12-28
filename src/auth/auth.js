import { Helper } from "../classes/Helper";

export const setUserData = (userData) => {
  Helper.handleLoginData(userData, () => {
    // Callback function after storing data, if necessary
  });
};

export const removeUserData = () => {
  Helper.logOut();
};

export const isAuthenticated = () => {
  const userData = Helper.getLoginData();
  return userData !== null;
};
