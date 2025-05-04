import { jwtDecode } from "jwt-decode";

export const getUserValue = () => {
  try {
    const token = localStorage.getItem("token");
    if (token) {
      return jwtDecode(token);
    }
  } catch (err) {
    console.log(err);
    return null;
  }
};
