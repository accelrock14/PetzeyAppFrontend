import { IAddress } from "./IAddress";

export interface IVet {
    vetId: number;
    lName: string;
    fName: string;
    npiNumber: string;
    username: string;
    phone: string;
    email: string;
    speciality: string;
    shortBio: string;
    status: boolean;
    photo: string;
    gender: string;
    dob: Date;
    rating: number;
    addressId: number;
    address: IAddress;
  }