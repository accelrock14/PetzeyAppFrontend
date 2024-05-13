import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { GeneralPetIssue } from '../../models/GeneralPetIssue';
import { AppointmentDetail } from '../../models/AppointmentDetail';
import { PetsService } from '../PetsServices/pets.service';
import { VetsserviceService } from '../VetsServices/vetsservice.service';
import { AuthService } from '../UserAuthServices/auth.service';
import { IVetCardDTO } from '../../models/Vets/IVetCardDto';
import { IVet } from '../../models/Vets/IVet';
import { catchError, map } from 'rxjs/operators';
import { appointmentServiceUrl } from '../../Shared/apiUrls';
import { Status } from '../../models/Status';


@Injectable({
  providedIn: 'root'
})

export class AppointmentFormService {

  petService = inject(PetsService);
  vetService = inject(VetsserviceService);
  authService = inject(AuthService);

  constructor(private backendClient:HttpClient) {
      this.petService = inject(PetsService);
      this.vetService = inject(VetsserviceService);
      this.authService = inject(AuthService);
   }


  private generalPetIssuesUrl = appointmentServiceUrl+"api/AppointmentDetails/GeneralPetIssues";
  private postAppointmentUrl=appointmentServiceUrl+"api/Appointment";
  private getScheduleSlotsUrl=appointmentServiceUrl+"api/AppointmentDetails/schedules/";
  private getAppointmentByIdUrl=appointmentServiceUrl+"api/Appointment/";
  private editAppointmentUrl = appointmentServiceUrl+"api/Appointment/";

  getGeneralPetIssues():Observable<GeneralPetIssue[]>{
    return this.backendClient.get<GeneralPetIssue[]>(this.generalPetIssuesUrl);
  }

  getVeternarians():Observable<IVetCardDTO[]>{
    return this.vetService.getAllVets();
  }

  getVet(): Observable<IVet> {
    // this is correct vpi number.

    // tomorrow I should do that now I am sleepy.

    return this.vetService.getVetsByNPINumber(this.authService.getVPIFromToken()).pipe(
      catchError((err) => {
        console.error(err);
        throw 'Error fetching vet details'; // Rethrow or handle as per your error handling strategy
      })
    );

    return this.vetService.getVetsByNPINumber(this.authService.getVPIFromToken());
  }


  getScheduleSlotStatuses(doctorID:string,schDate:Date):Observable<boolean[]>{
    const formattedDate = schDate.toISOString().split('T')[0];
    //alert(this.getScheduleSlotsUrl+id+"/"+formattedDate);
    return this.backendClient.get<boolean[]>(this.getScheduleSlotsUrl+doctorID+"/"+formattedDate);
  }

  postAppointment(appointment:AppointmentDetail):Observable<AppointmentDetail>{
    // alert("inside post appointment");
    return this.backendClient.post<AppointmentDetail>(this.postAppointmentUrl,appointment);
  }

  getAppointmentById(AppointmentID:number):Observable<AppointmentDetail>{
    return this.backendClient.get<AppointmentDetail>(this.getAppointmentByIdUrl+AppointmentID);
  }

  putAppointmentByIdandObj(AppointmentID:number,AppointmentDetailObj:AppointmentDetail):Observable<AppointmentDetail>{
    // console.log("put url here"+this.editAppointmentUrl+AppointmentID);
    return this.backendClient.put<AppointmentDetail>(this.editAppointmentUrl+AppointmentID,AppointmentDetailObj);
  }

  getAllAppointments():Observable<AppointmentDetail[]>{
    return this.backendClient.get<AppointmentDetail[]>(appointmentServiceUrl+"/api/Appointment");
  }

  // getNoOfOpenAppointmentsOfVet(vetID:string):number{
  //   let appointments:AppointmentDetail[] = [];
  //     this.getAllAppointments().subscribe({
  //     next:(data)=>{
  //       appointments=data;
  //     },
  //     error:(err)=>{
  //       console.log(err);
  //     }
  //   });
  //   return appointments.filter(a=>a.DoctorID==vetID && a.Status== Status.Confirmed).length;
  // }

  async getNoOfOpenAppointmentsOfVet(vetID: string): Promise<number> {
    let appointments: AppointmentDetail[] = [];
    try {
        const fetchedAppointments = await this.getAllAppointments().toPromise();
        if (fetchedAppointments) {
            appointments = fetchedAppointments;
        }
    } catch (error) {
        console.error(error);
    }
    return appointments.filter(a => a.DoctorID == vetID && a.Status == Status.Confirmed).length;
}

}
