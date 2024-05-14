import { IAddress } from "./IAddress";

export interface IVetProfileDTO {
  [key: string]: any;
    VetId:number,
    LName: string;
    FName:string;
    NPINumber: string;
    Speciality: string;
    Email: string;
    Phone: string;
    Photo: string;
    status:boolean;
    address:IAddress;
  }