import { jwtDecode } from "jwt-decode";

const token = localStorage.getItem("token");

export const getUserValue = () => {
  try {
    if (token) {
      return jwtDecode(token);
    }
  } catch (err) {
    console.log(err);
    return null;
  }
};
