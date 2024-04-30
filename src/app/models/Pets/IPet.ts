export interface IPet {
    PetID:number,
    PetParentId:number,
    PetName:string,
    PetImage:Uint8Array,
    Species:string,
    Breed:string,
    BloodGroup:string,
    Gender:string,
    DateOfBirth:Date,
    Allergies:string,
    LastAppointmentDate:Date
}