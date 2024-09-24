import axios from "axios";
import { API_BASE_URL } from "../constants";

export const getAccessToken = async (audience: string) => {
  try {
    await axios.post(
      `${API_BASE_URL}/auth/get-access-token`,
      {
        audience,
      },
      { withCredentials: true }
    );
    return true;
  } catch (error) {
    console.error("Error fetching access token:", error);
    throw error;
  }
};

