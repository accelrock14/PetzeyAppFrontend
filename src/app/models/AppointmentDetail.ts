import { PetIssue } from "./PetIssue"
import { Report } from "./Report"
import { Status } from "./Status"

export  interface AppointmentDetail
{
    AppointmentID:number,
    DoctorID:string,
    PetID:number,
    OwnerID:string,
    ScheduleDate:Date,
    ScheduleTimeSlot:number,
    BookingDate:Date,
    ReasonForVisit:string,
    Status:Status,
    Report:Report|null,
    PetIssues :PetIssue[]
}