import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FilterParamsDto } from '../../models/Dashboard/FilterParamsDto';
import { Observable, filter, map } from 'rxjs';
import { AppointmentCardDto } from '../../models/Appointment/AppointmentCardDto';
import { AppointmentStatusCountsDto } from '../../models/Dashboard/AppointmentStatusCountsDto';
import { IDFiltersDto } from '../../models/Dashboard/IDFiltersDto';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  // apiUrl: string = `https://petzeybackendappointmentapi20240505153736.azurewebsites.net`;
  apiUrl: string = `https://localhost:44327`;

  constructor(private http: HttpClient) { }
  GetAllAppointmentsWithFilters(filters: FilterParamsDto, offset: number): Observable<AppointmentCardDto[]> {
    return this.http.post<AppointmentCardDto[]>(`${this.apiUrl}/api/dashboard/appointments/filter/${offset}`, filters);
  }
  GetStatusCounts(ids: IDFiltersDto): Observable<AppointmentStatusCountsDto> {
    return this.http.post<AppointmentStatusCountsDto>(`${this.apiUrl}/api/dashboard/statuscounts/`,ids);
  }
  GetPatientAppointmentsWithFilters(filters: FilterParamsDto, offset: number, ownerid: string): Observable<AppointmentCardDto[]> {
    return this.http.post<AppointmentCardDto[]>(`${this.apiUrl}/api/dashboard/petappointments/filter/${ownerid}/${offset}`, filters)
  }
  GetVetAppointmentsWithFilters(filters: FilterParamsDto, offset: number, vetid: string): Observable<AppointmentCardDto[]> {
    return this.http.post<AppointmentCardDto[]>(`${this.apiUrl}/api/dashboard/vetappointments/filter/${vetid}/${offset}`, filters)
  }
  GetUpcomingAppointments(ids: IDFiltersDto): Observable<AppointmentCardDto[]>{
    return this.http.post<AppointmentCardDto[]>(`${this.apiUrl}/api/dashboard/upcoming/`,ids);
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
