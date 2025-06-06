import { makeAutoObservable, runInAction } from "mobx";
import {
  addGeofence,
  deleteGeofence,
  getGeofences,
  getLastCoordinate,
  setActiveGeofence,
  updateGeofence,
} from "../services/coordinateServices";
import type { Coordinates, Geofence } from "../services/types";

class TrackingStore {
  isConnected = false;
  IsInsideGeofence = true;
  lastUpdate: string | null = null;
  batteryLevel = 0;
  currentLocation: Coordinates | null = null;
  locationHistory: Coordinates[] = [];
  geofences: Geofence[] = [];

  constructor() {
    makeAutoObservable(this);
    this.getLastCoordinate();
  }

  initConnection() {
    setInterval(() => {
      this.getLastCoordinate();
    }, 10000);
  }

  async loadGeofences() {
    await getGeofences().then((data) => {
      runInAction(() => {
        this.geofences = data.Geofences;
      });
    });
  }

  async updateGeofence(geofence: Geofence) {
    await updateGeofence({
      ID: +geofence.ID,
      Latitude: geofence.Latitude,
      Longitude: geofence.Longitude,
      Radius: geofence.Radius,
      Name: geofence.Name,
    });

    await this.loadGeofences();
  }

  // Добавление новой геозоны
  async addGeofence(geofence: Geofence) {
    this.geofences = [...this.geofences, geofence];
    await addGeofence({
      Latitude: geofence.Latitude,
      Longitude: geofence.Longitude,
      Radius: geofence.Radius,
      Name: geofence.Name,
    });
    await this.loadGeofences();
  }

  // Установка активной геозоны
  async setActiveGeofence(geofence: Geofence) {
    geofence.IsActive = true;

    await setActiveGeofence({
      ID: geofence.ID,
      Latitude: geofence.Latitude,
      Longitude: geofence.Longitude,
      Radius: geofence.Radius,
      Name: geofence.Name,
      IsActive: true,
    });

    await this.loadGeofences();
  }

  // Удаление геозоны
  async deleteGeofence(geofence: Geofence) {
    this.geofences = this.geofences.filter((g) => g.ID !== geofence.ID);

    await deleteGeofence(geofence);

    await this.loadGeofences();
  }

  async getLastCoordinate() {
    getLastCoordinate().then((data) => {
      if (!data.is_online) {
        this.setConnectionStatus(false);
      } else {
        this.setConnectionStatus(true);
      }
      if(!data.is_inside_geofence){
        this.IsInsideGeofence = false;
      } else {
        this.IsInsideGeofence = true;
      }
      this.updateLocation(data.Coordinates);
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

  get getIsConnected() {
    return this.isConnected;
  }

  get getIsInsideGeofence() {
    return this.IsInsideGeofence;
  }

  get getCurrentCoordinate() {
    return this.currentLocation;
  }
}

const trackingStore = new TrackingStore();
export default trackingStore;
