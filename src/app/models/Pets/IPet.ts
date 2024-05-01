export interface IPet {
    PetID:number,
    PetParentId:number,
    PetName:string,
    PetImage:string,
    Species:string,
    Breed:string,
    BloodGroup:string,
    Gender:string,
    Neutered : boolean,
    DateOfBirth:Date,
    Allergies:string,
    LastAppointmentDate:Date
}
