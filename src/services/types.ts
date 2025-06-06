export interface Coordinates {
  ID: number;
  DeviceID: string;
  Latitude: number;
  Longitude: number;
  Speed: number;
  Altitude: number;
  Timestamp: string;
  Satellites: number;
}

export interface CoordinatesResponse {
  Coordinates: Coordinates;
  is_inside_geofence: boolean;
  is_online: boolean;
}

export interface Geofence {
  ID: string;
  Name: string;
  Latitude: number;
  Longitude: number;
  Radius: number;
  IsActive?: boolean;
}

export interface GeofenceResponse {
  Geofences: Geofence;
}

export interface GeofencesResponse {
  Geofences: Geofence[];
}
