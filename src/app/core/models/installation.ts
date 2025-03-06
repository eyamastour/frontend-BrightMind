import { Room } from './room.model';
import { Device } from './device.model';

export interface Installation {
  _id: string;
  name: string;
  cluster: string;
  route: string;
  boxId: string;
  latitude: number;
  longitude: number;
  parent: string;
  devices: Device[];
  rooms: Room[];
  userId: string;
  status: 'online' | 'offline';
  createdAt?: Date;
  updatedAt?: Date;
}
