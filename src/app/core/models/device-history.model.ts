export interface DeviceHistory {
  timestamp: Date;
  value: number | boolean;
  deviceId: string;
  deviceName: string;
  deviceType: string;
}
