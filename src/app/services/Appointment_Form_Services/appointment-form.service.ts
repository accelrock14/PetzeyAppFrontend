import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { GeneralPetIssue } from '../../models/GeneralPetIssue';
import { PetParent } from '../../models/PetParent';
import { AppointmentDetail } from '../../models/AppointmentDetail';
import { PetsService } from '../PetsServices/pets.service';
import { IPet } from '../../models/Pets/IPet';
import { VetsserviceService } from '../VetsServices/vetsservice.service';
import { AuthService } from '../UserAuthServices/auth.service';
import { IVetCardDTO } from '../../models/Vets/IVetCardDto';


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


  private generalPetIssuesUrl = 'https://petzeybackendappointmentapi20240502214622.azurewebsites.net/api/AppointmentDetails/GeneralPetIssues';
  private myJsonServerUrl='http://localhost:3000/';
  private postAppointmentUrl="https://petzeybackendappointmentapi20240502214622.azurewebsites.net/api/Appointment";
  private getScheduleSlotsUrl="https://petzeybackendappointmentapi20240502214622.azurewebsites.net/api/AppointmentDetails/schedules/";
  private getAppointmentByIdUrl='https://petzeybackendappointmentapi20240502214622.azurewebsites.net/api/Appointment/';
  private editAppointmentUrl = "https://petzeybackendappointmentapi20240502214622.azurewebsites.net/api/Appointment/https://localhost:44327/api/Appointment/";

  getGeneralPetIssues():Observable<GeneralPetIssue[]>{
    return this.backendClient.get<GeneralPetIssue[]>(this.generalPetIssuesUrl);
  }

  getVeternarians():Observable<IVetCardDTO[]>{
    // return this.backendClient.get<Veterinarian[]>(this.myJsonServerUrl+"Veterinarians");
    return this.vetService.getAllVets();
  }

  getPetParents():Observable<PetParent[]>{
    return this.backendClient.get<PetParent[]>(this.myJsonServerUrl+"PetParents");
    // here call the auth service method to either retrieve all the pet parents or all the users and then filter them.
    //
  }

  // no use of this method now.
  // getPets():Observable<IPet[]>{
  //   return this.backendClient.get<IPet[]>(this.myJsonServerUrl+"Pets");
  // }

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
    return this.backendClient.put<AppointmentDetail>(this.editAppointmentUrl+AppointmentID,AppointmentDetailObj);
  }

  getAllPetsOfOwener(OwnerID: string):Observable<IPet[]> {
    return this.petService.GetPetsByParentID(OwnerID);
  }
}
