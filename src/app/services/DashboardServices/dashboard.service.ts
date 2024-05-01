import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FilterParamsDto } from '../../models/Dashboard/FilterParamsDto';
import { Observable } from 'rxjs';
import { AppointmentCardDto } from '../../models/Appointment/AppointmentCardDto';
import { AppointmentStatusCountsDto } from '../../models/Dashboard/AppointmentStatusCountsDto';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  apiUrl: string = `https://localhost:44327/api/dashboard`;

  constructor(private http: HttpClient) { }
  GetAllAppointmentsWithFilters(filters: FilterParamsDto, offset: number): Observable<AppointmentCardDto[]> {
    return this.http.post<AppointmentCardDto[]>(`${this.apiUrl}/appointments/filter`, filters);
  }
  GetStatusCounts():Observable<AppointmentStatusCountsDto> {
    return this.http.get<AppointmentStatusCountsDto>(`${this.apiUrl}/statuscounts`);
  }
  GetPatientAppointmentsWithFilters(filters: FilterParamsDto, offset: number, ownerid: number): Observable<AppointmentCardDto[]> {
    return this.http.post<AppointmentCardDto[]>(`${this.apiUrl}/petappointments/filter/${ownerid}`, filters)
  }
  GetVetAppointmentsWithFilters(filters: FilterParamsDto, offset: number, vetid: number): Observable<AppointmentCardDto[]> {
    return this.http.post<AppointmentCardDto[]>(`${this.apiUrl}/vetappointments/filter/${vetid}`, filters)
  }
}
