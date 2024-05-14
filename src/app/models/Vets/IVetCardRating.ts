import { IAddress } from "./IAddress";

export interface IVetCardRatingDTO {
  
    VetId:number,
    LName: string;
    FName:string;
    NPINumber: string;
    Speciality: string;
    Email: string;
    Phone: string;
    Photo: string;
    Status:boolean;
    address:IAddress;
    avgRating:number,
    numberOfReviews:number
    
    
  }