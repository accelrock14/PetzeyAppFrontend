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
  // apiUrl: string = `https://localhost:44327/api/appointment`;


  constructor(private http: HttpClient) { }
  GetAllAppointmentsWithFilters(filters: FilterParamsDto, offset: number): Observable<AppointmentCardDto[]> {
    return this.http.post<AppointmentCardDto[]>(`${this.apiUrl}/appointments/filter/${offset}`, filters);
  }
  GetStatusCounts(): Observable<AppointmentStatusCountsDto> {
    return this.http.get<AppointmentStatusCountsDto>(`https://localhost:44327/api/dashboard/statuscounts`);
  }
  GetPatientAppointmentsWithFilters(filters: FilterParamsDto, offset: number, ownerid: number): Observable<AppointmentCardDto[]> {
    return this.http.post<AppointmentCardDto[]>(`${this.apiUrl}/petappointments/filter/${ownerid}/${offset}`, filters)
  }
  GetVetAppointmentsWithFilters(filters: FilterParamsDto, offset: number, vetid: number): Observable<AppointmentCardDto[]> {
    return this.http.post<AppointmentCardDto[]>(`${this.apiUrl}/vetappointments/filter/${vetid}/${offset}`, filters)
  }



  GetAllAppointments(): Observable<AppointmentCardDto[]> {
    return this.http.get<AppointmentCardDto[]>(`${this.apiUrl}/all`);
  }
  GetPatientAppointments(ownerid: number): Observable<AppointmentCardDto[]> {
    return this.http.get<AppointmentCardDto[]>(`${this.apiUrl}/pets/${ownerid}`)
  }
  GetVetAppointments(vetid: number): Observable<AppointmentCardDto[]> {
    return this.http.get<AppointmentCardDto[]>(`${this.apiUrl}/vets/${vetid}`)
  }

  //service for pets team (appointment history)
  GetAllClosedAppointmentByPetID(petid: number): Observable<AppointmentCardDto[]> {
    return this.http.get<AppointmentCardDto[]>(`https://localhost:44327/api/AppointmentDetails/allappointmentsbypetid/${petid}}`);
  }

  //service for doctor team (appointment history)
  GetAllClosedAppointmentByVetID(vetid: number): Observable<AppointmentCardDto[]> {
    return this.http.get<AppointmentCardDto[]>(`https://localhost:44327/api/AppointmentDetails/allappointmentsbyvetid/${vetid}}`);
  }

}
