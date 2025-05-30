import type { CoordinatesResponse } from "./types";
import apiClient from "./axiosInstance";

export const getLastCoordinate = async (): Promise<CoordinatesResponse> => {
  const response = await apiClient.get("get_last_coordinates");
  return response.data;
};
