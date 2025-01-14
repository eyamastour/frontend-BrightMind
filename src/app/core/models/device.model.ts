import { Room } from './room.model';

export interface Device {
  _id?: string;   
  name: string;
  zone: string;
  deviceType: string;
  status: string;
  type: string;
  enableConnection: boolean;
  lastUpdated: Date;
  value: number;
  installationId: string;
  room?: Room;  // Room details when populated
  createdAt?: Date;
  updatedAt?: Date;
}
