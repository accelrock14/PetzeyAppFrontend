import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { GeneralPetIssue } from '../../models/GeneralPetIssue';
import { AppointmentDetail } from '../../models/AppointmentDetail';
import { PetsService } from '../PetsServices/pets.service';
import { IPet } from '../../models/Pets/IPet';
import { VetsserviceService } from '../VetsServices/vetsservice.service';
import { AuthService } from '../UserAuthServices/auth.service';
import { IVetCardDTO } from '../../models/Vets/IVetCardDto';
import { IVet } from '../../models/Vets/IVet';
import { TempPetParent } from '../../models/TempPetParent';
import { forkJoin } from 'rxjs';
import { catchError, map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})

export class AppointmentFormService {
  TempAllGetPetParents() {
    
  }
 

  petService = inject(PetsService); 
  vetService = inject(VetsserviceService);
  authService = inject(AuthService);

  constructor(private backendClient:HttpClient) {
      this.petService = inject(PetsService); 
      this.vetService = inject(VetsserviceService);
      this.authService = inject(AuthService);
   }


  private generalPetIssuesUrl = 'https://petzeybackendappointmentapi20240502214622.azurewebsites.net/api/AppointmentDetails/GeneralPetIssues';
  //private myJsonServerUrl='http://localhost:3000/';
  private postAppointmentUrl="https://petzeybackendappointmentapi20240502214622.azurewebsites.net/api/Appointment";
  private getScheduleSlotsUrl="https://petzeybackendappointmentapi20240502214622.azurewebsites.net/api/AppointmentDetails/schedules/";
  private getAppointmentByIdUrl='https://petzeybackendappointmentapi20240502214622.azurewebsites.net/api/Appointment/';
  private editAppointmentUrl = "https://petzeybackendappointmentapi20240502214622.azurewebsites.net/api/Appointment/";

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

  getAllPetsOfOwener(OwnerID: string):Observable<IPet[]> {
    return this.petService.GetPetsByParentID(OwnerID);
  }
}
