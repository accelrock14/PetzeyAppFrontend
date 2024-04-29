import { IAddress } from "./IAddress";

export interface IVet{
    vetId:number,
    lname:string,
    fname:string,   
    phone:number,    
    speciality:string ,
    photo: ArrayBuffer;
       

}