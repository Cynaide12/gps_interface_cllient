import { makeAutoObservable } from "mobx";
import { getLastCoordinate } from "../services/coordinateServices";
import type { Coordinates } from "../services/types";

class TrackingStore {
  isConnected = false;
  lastUpdate: string | null = null;
  batteryLevel = 0;
  currentLocation: Coordinates | null = null;
  locationHistory: Coordinates[] = [];

  constructor() {
    makeAutoObservable(this);
    this.getLastCoordinate()
  }

  initConnection() {
    setInterval(() => {
     this.getLastCoordinate();
    }, 10000);
  }

  async getLastCoordinate() {
    getLastCoordinate().then((data) => {
      this.updateLocation(data.Coordinates);
      if (
        !data.Coordinates ||
        data?.Coordinates?.ID == this.currentLocation?.ID
      ) {
        this.setConnectionStatus(false);
      } else {
        this.setConnectionStatus(true);
      }
    });
  }

  updateLocation(newCoord: Coordinates) {
    this.currentLocation = newCoord;
    this.locationHistory = [...this.locationHistory, newCoord].slice(-100);
    if (newCoord) {
      this.lastUpdate = new Date().toLocaleTimeString();
    }
  }

  setConnectionStatus(status: boolean) {
    this.isConnected = status;
  }

  setBatteryLevel(level: number) {
    this.batteryLevel = level;
  }
}

const trackingStore = new TrackingStore();
export default trackingStore;
