import { IAddress } from "./IAddress";

export interface IVet {
    vetId: number;
    LName: string;
    FName: string;
    npiNumber: string;
    username: string;
    Phone: string;
    email: string;
    speciality: string;
    shortBio: string;
    status: boolean;
    photo: ArrayBuffer;
    gender: string;
    dob: Date;
    rating: number;
    addressId: number;
    address: IAddress;
  }