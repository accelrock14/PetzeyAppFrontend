import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppointmentDetailsService {
  private apiUrl = 'https://localhost:44327/api/Appointment';
  private apiUrl2= 'https://localhost:44327/api/AppointmentDetails';

  constructor(private http: HttpClient) { }
  GetAppointmentDetail(AppointmentID: number):Observable<any> {
    const url = `${this.apiUrl}/${AppointmentID}`;
    return this.http.get<any>(url);
  }
  PatchAppointmentStatus(AppointmentID: number,StatusNo:number):Observable<any>{
    const url = `${this.apiUrl2}/${AppointmentID}/status`;
    return this.http.patch(url, StatusNo);


  }



}