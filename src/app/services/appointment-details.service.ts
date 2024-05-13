import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cancellation } from '../models/Cancellation';

@Injectable({
  providedIn: 'root'
})
export class AppointmentDetailsService {
  private localhost='https://localhost:44327/'
  private remote='https://localhost:44327/'
  private apiUrl = 'https://localhost:44327/api/Appointment';
  private apiUrl2= 'https://localhost:44327/api/AppointmentDetails';
  private apiUrl3= 'https://localhost:44327/api/PetIdByDocId';
  private apiUrl4= 'https://localhost:44327/api/AppointmentCancellationReason';
  private apiUrl5= 'https://localhost:44327/api/GetAppointmentCancellationReason';

  constructor(private http: HttpClient) { }
  GetAppointmentDetail(AppointmentID: number):Observable<any> {
    //console.log(AppointmentID+"in service"+typeof(AppointmentID))
    const url = `${this.apiUrl}/${AppointmentID}`;
    return this.http.get<any>(url);
  }
  PatchAppointmentStatus(AppointmentID: number,StatusNo:number):Observable<any>{
    const url = `${this.apiUrl2}/${AppointmentID}/status`;
    return this.http.patch(url, StatusNo);
  }
  GetAllPetIDByVetId(VetID:number):Observable<number[]>{
    const url=`${this.apiUrl3}/${VetID}`
    return this.http.get<number[]>(url);
  }
  PostCancellationReason(cancellation: Cancellation) {
    return this.http.post(
      this.apiUrl4,cancellation
    );
  }
  GetCancellationReason(AppointmentID: number):Observable<any> {
    //console.log(AppointmentID+"in service"+typeof(AppointmentID))
    const url = `${this.apiUrl5}/${AppointmentID}`;
    return this.http.get<any>(url);
  }



}
