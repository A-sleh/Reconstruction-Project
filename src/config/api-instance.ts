import axios from "axios";
import { API_URL } from "./domain.ts";
import { appLanguageCodes } from "../constant/consants.ts";
import {
  updateAccessToken,
  getAccessToken,
  getRefreshToken,
  clearTokens,
} from "@/stores/useAuthStore.ts";
import { paths } from "./paths.ts";

const ApiInstance = axios.create({
  baseURL: API_URL,
});

ApiInstance.interceptors.request.use(
  (config) => {
    const locale = "ar";
    const token = getAccessToken()?.state.accessToken;

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    config.headers["App-Language"] = appLanguageCodes[locale || "ar"];

    return config;
  },
  (error) => {
    Promise.reject(error);
  },
);

ApiInstance.interceptors.response.use(
  (response) => response, // Directly return successful responses.
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark the request as retried to avoid infinite loops.
      try {
        const refreshToken = getRefreshToken(); // Retrieve the stored refresh token.
        // Make a request to your auth server to refresh the token.
        const response = await axios.post("/Auth/Refresh", {
          refreshToken,
        });
        const { accessToken } = response.data;
        // Store the new access and refresh tokens.
        updateAccessToken(accessToken);

        // Update the authorization header with the new access token.
        ApiInstance.defaults.headers.common["Authorization"] =
          `Bearer ${accessToken}`;
        return ApiInstance(originalRequest); // Retry the original request with the new access token.
      } catch (refreshError) {
        // Handle refresh token errors by clearing stored tokens and redirecting to the login page.
        console.error("Token refresh failed:", refreshError);
        clearTokens(); // Re-set the tokens (Access and refresh)
        window.location.href = paths.auth.login.path;
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error); // For all other errors, return the error as is.
  },
);

export default ApiInstance;
