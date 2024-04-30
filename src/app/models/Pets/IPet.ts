export interface IPet {
    PetID:number,
    PetParentId:number,
    PetName:string,
    PetImage:BinaryType,
    Species:string,
    Breed:string,
    Gender:string,
    DateOfBirth:Date,
    Allergies:string,
    LastAppointmentDate:Date
}