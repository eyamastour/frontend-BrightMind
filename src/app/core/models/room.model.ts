import { Device } from './device.model';

export interface Room {
    _id?: string;
    name: string;
    description?: string;
    devices: Device[] | string[];  // Can be array of Device objects or device IDs
    installation?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
