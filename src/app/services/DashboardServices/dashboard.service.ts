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

  apiUrl: string = `https://petzeybackendappointmentapi20240502214622.azurewebsites.net`;

  constructor(private http: HttpClient) { }
  GetAllAppointmentsWithFilters(filters: FilterParamsDto, offset: number): Observable<AppointmentCardDto[]> {
    return this.http.post<AppointmentCardDto[]>(`${this.apiUrl}/api/appointments/filter/${offset}`, filters);
  }
  GetStatusCounts(vetid: string): Observable<AppointmentStatusCountsDto> {
    return this.http.get<AppointmentStatusCountsDto>(`${this.apiUrl}/api/dashboard/statuscounts/${vetid}`);
  }
  GetPatientAppointmentsWithFilters(filters: FilterParamsDto, offset: number, ownerid: string): Observable<AppointmentCardDto[]> {
    return this.http.post<AppointmentCardDto[]>(`${this.apiUrl}/api/dashboard/petappointments/filter/${ownerid}/${offset}`, filters)
  }
  GetVetAppointmentsWithFilters(filters: FilterParamsDto, offset: number, vetid: string): Observable<AppointmentCardDto[]> {
    return this.http.post<AppointmentCardDto[]>(`${this.apiUrl}/api/dashboard/vetappointments/filter/${vetid}/${offset}`, filters)
  }


  //service for pets team (appointment history)
  GetAllClosedAppointmentByPetID(petid: number): Observable<AppointmentCardDto[]> {
    return this.http.get<AppointmentCardDto[]>(`${this.apiUrl}/api/AppointmentDetails/allappointmentsbypetid/${petid}`);
  }

  //service for doctor team (appointment history)
  GetAllClosedAppointmentByVetID(vetid: number): Observable<AppointmentCardDto[]> {
    return this.http.get<AppointmentCardDto[]>(`${this.apiUrl}/api/AppointmentDetails/allappointmentsbyvetid/${vetid}`);
  }

}
