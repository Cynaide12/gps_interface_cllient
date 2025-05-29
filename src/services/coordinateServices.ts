import axios from "axios";
import type { CoordinatesResponse } from "./types";

export const getLastCoordinate = async (): Promise<CoordinatesResponse> => {
  const response = await axios.get("http://localhost:8080/api/get_last_coordinates");
  return response.data;
};
