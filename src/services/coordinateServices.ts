import type { CoordinatesResponse, GeofenceResponse, GeofencesResponse } from "./types";
import apiClient from "./axiosInstance";

export const getLastCoordinate = async (): Promise<CoordinatesResponse> => {
  const response = await apiClient.get("get_last_coordinates");
  return response.data;
};

export const addGeofence = async (data: {
  Latitude: number;
  Longitude: number;
  Radius: number;
  Name: string;
}): Promise<GeofenceResponse>  => {
  const response = await apiClient.post("add_geofence", data);
  return response.data;
};


export const deleteGeofence = async (data: {
  Latitude: number;
  Longitude: number;
  Radius: number;
  Name: string;
}): Promise<GeofenceResponse>  => {
  const response = await apiClient.post("delete_geofence", data);
  return response.data;
};

export const updateGeofence = async (data: {
  ID: number;
  Latitude: number;
  Longitude: number;
  Radius: number;
  Name: string;
  IsActive?: boolean
}): Promise<GeofenceResponse> => {
  const response = await apiClient.put("update_geofence", data);
  return response.data;
};

export const setActiveGeofence = async (data: {
  ID: string;
  Latitude: number;
  Longitude: number;
  Radius: number;
  Name: string;
  IsActive?: boolean
}): Promise<GeofenceResponse> => {
  const response = await apiClient.put("set_active_geofence", data);
  return response.data;
};

export const getGeofences = async (): Promise<GeofencesResponse> => {
  const response = await apiClient.get("get_geofences");
  return response.data;
};