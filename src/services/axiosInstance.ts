import { config } from "../config/config";
import axios from "axios";
const apiClient = axios.create({
  baseURL: config.api,
  withCredentials: true, // Для работы с куками
});

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);
apiClient.interceptors.request.use((config) => {
  config.headers["ngrok-skip-browser-warning"] = true;
  return config;
});

export default apiClient;
