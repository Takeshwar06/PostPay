import axios from "axios";
import { host } from "./api";
import { refreshAccessToken } from "../features/auth/authSlice";
import { store } from "../app/store";

export const refreshToken = async () => {
  try {
    console.log("refreshToken called in side service");
    const state = store.getState();
    const refreshToken =
      state.auth.refreshToken || localStorage.getItem("refreshToken");
    // console.log("rereshToken",refreshToken);
    if (!refreshToken) throw new Error("No refresh token available");

    // Call the refresh token API
    const response = await axios.post(`${host}/api/v1/auth/refresh-token`, {
      refreshToken,
    });
    const { accessToken, refreshToken: newRefreshToken } = response.data.data;

    console.log("newToken->", response);
    // Update the tokens in Redux and local storage
    store.dispatch(
      refreshAccessToken({ accessToken, refreshToken: newRefreshToken })
    );
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", newRefreshToken);

    return accessToken;
  } catch (error) {
    console.error("Error refreshing access token:", error.message);
    throw new Error("Failed to refresh access token");
  }
};
