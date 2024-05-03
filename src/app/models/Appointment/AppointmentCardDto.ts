export interface AppointmentCardDto {
    AppointmentID: number;
    DoctorID: string;
    PetID: number;
    PetName: string;
    PetAge: number;
    PetGender: string;
    OwnerName: string;
    DoctorName: string;
    PetPhoto: string; //datatype?
    VetSpecialization: string;
    DoctorPhoto: string;
    ScheduleDate: Date;
    //added status for filtering in UI rather than backend
    Status: string;
}