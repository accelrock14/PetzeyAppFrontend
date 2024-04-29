import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppointmentDetailsService {
  private apiUrl = 'https://localhost:44327/api/Appointment/';
  constructor(private http: HttpClient) { }
  GetAppointmentDetail(AppointmentID: number):Observable<any> {
    const url = `${this.apiUrl}${AppointmentID}`;
    return this.http.get<any>(url);
  }
}
