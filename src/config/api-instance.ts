import axios from "axios";
import { API_URL } from "./domain.ts";
import { appLanguageCodes } from "../constant/consants.ts";

const ApiInstance = axios.create({
  baseURL: API_URL,
});

ApiInstance.interceptors.request.use(
  (config) => {
    // TODO : this loclae should store in locale state like zustand
    const locale = "ar";

    config.headers["App-Language"] = appLanguageCodes[locale || "ar"];

    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

export default ApiInstance;
