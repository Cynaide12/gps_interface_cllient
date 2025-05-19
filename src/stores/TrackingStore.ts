import { makeAutoObservable } from "mobx";
import { createContext, useContext } from "react";

interface Coordinate {
  id: number;
  deviceId: string;
  latitude: number;
  longitude: number;
  speed: number;
  altitude: number;
  timestamp: string;
  satellites: number;
}

class TrackingStore {
  isConnected = false;
  lastUpdate: string | null = null;
  batteryLevel = 0;
  currentLocation: Coordinate | null = null;
  locationHistory: Coordinate[] = [];

  constructor() {
    makeAutoObservable(this);

    // Здесь будет инициализация подключения к бэкенду
    this.initConnection();
  }

  initConnection() {
    // TODO: Реализовать подключение через WebSocket или long polling
  }

  updateLocation(newCoord: Coordinate) {
    this.currentLocation = newCoord;
    this.locationHistory = [...this.locationHistory, newCoord].slice(-100); // Храним последние 100 точек
    this.lastUpdate = new Date().toLocaleTimeString();
  }

  setConnectionStatus(status: boolean) {
    this.isConnected = status;
  }

  setBatteryLevel(level: number) {
    this.batteryLevel = level;
  }
}

const store = new TrackingStore();
const StoreContext = createContext(store);

export const useStore = () => useContext(StoreContext);
export default store;
