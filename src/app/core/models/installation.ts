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
  isCluster?: boolean; // Flag to distinguish between clusters and installations
  createdAt?: Date;
  updatedAt?: Date;
}
