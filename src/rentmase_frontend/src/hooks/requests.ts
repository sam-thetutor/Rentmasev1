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

export const getCountryGiftCards = async (countryCode) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/country-giftcards`, {
      params: { countryCode },
      withCredentials: true,
    });
    return response.data; 
  } catch (error) {
    console.error("Error fetching country gift cards:", error);
    throw error;
  }
};

