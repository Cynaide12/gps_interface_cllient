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
}
