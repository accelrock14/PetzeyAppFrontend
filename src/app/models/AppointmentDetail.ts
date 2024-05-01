import { PetIssue } from "./PetIssue"
import { Report } from "./Report"
import { Status } from "./Status"

export  interface AppointmentDetail
{
    AppointmentID:number,
    DoctorID:number,
    PetID:number,
    OwnerID:number,
    ScheduleDate:Date,
    ScheduleTimeSlot:number,
    BookingDate:Date,
    ReasonForVisit:string,
    Status:Status,
    Report:Report|null,
    PetIssues :PetIssue[]
}