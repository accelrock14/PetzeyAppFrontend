import { Component, OnInit } from '@angular/core';
import { FilterParamsDto } from '../../../models/Dashboard/FilterParamsDto';
import { AppointmentCardDto } from '../../../models/Appointment/AppointmentCardDto';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PetAppointmentCardComponent } from '../../appointment-cards/pet-appointment-card/pet-appointment-card.component';
import { DashboardService } from '../../../services/DashboardServices/dashboard.service';
import { DoctorAppointmentCardComponent } from '../../appointment-cards/doctor-appointment-card/doctor-appointment-card.component';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/UserAuthServices/auth.service';
import { AppointmentStatusCountsDto } from '../../../models/Dashboard/AppointmentStatusCountsDto';
import { IDFiltersDto } from '../../../models/Dashboard/IDFiltersDto';

@Component({
  selector: 'app-patient-dashboard',
  standalone: true,
  imports: [FormsModule, CommonModule, DoctorAppointmentCardComponent,RouterLink],
  templateUrl: './patient-dashboard.component.html',
  styleUrl: './patient-dashboard.component.css'
})
export class PatientDashboardComponent implements OnInit {
  user:string = "Patient";
  filters: FilterParamsDto = {
    ScheduleDate: null,
    Status: '',
    DoctorID: ""
  }
  appointmentCards: AppointmentCardDto[] = [];
  offset : number = 0;
  selectedStatus: string = "";
  selectedDate!: Date;
  page:number = 1;
  loadingAppointments: boolean = false;
  appointmentStatus: AppointmentStatusCountsDto = {
    Pending: 0,
    Confirmed: 0,
    Cancelled: 0,
    Total: 0,
    Closed: 0
  }
  ids : IDFiltersDto = {
    DoctorID: '',
    OwnerID: ''
  };

  constructor(private service: DashboardService,public authService: AuthService) {}
  ngOnInit(): void {
    // using auth service to get appointments according to OWNER ID
    this.loadingAppointments = true;
    this.service.GetPatientAppointmentsWithFilters(this.filters, this.offset, this.authService.getUIDFromToken()).subscribe(data => {
      this.appointmentCards = data;
      this.loadingAppointments = false;
    })
    this.ids.OwnerID = this.authService.getUIDFromToken();
    this.service.GetStatusCounts(this.ids).subscribe(count => {
      this.appointmentStatus = count;
    })
    
  }

  onDateStatusChange() {
    //re setting the filters on filter changes
    this.filters.ScheduleDate = this.selectedDate;
    this.filters.Status = this.selectedStatus;
    this.loadingAppointments = true;
    this.service.GetPatientAppointmentsWithFilters(this.filters, this.offset, this.authService.getUIDFromToken()).subscribe(data => {
      this.appointmentCards = data;
      this.loadingAppointments = false;
    })
  }
  pageClick(pageInput:number) {
    //set offset for pagination
    this.offset = (pageInput-1)*4;
    if(pageInput == this.page - 1){
      this.page--;
    }
    else if(pageInput == this.page + 1) {
      this.page++;
    }
    //set filters and get appointments from service
    this.filters.ScheduleDate = this.selectedDate;
    this.filters.Status = this.selectedStatus;
    this.loadingAppointments = true;
    this.service.GetPatientAppointmentsWithFilters(this.filters, this.offset, this.authService.getUIDFromToken()).subscribe(data => {
      this.appointmentCards = data;
      this.loadingAppointments = false;
    })
  }
  isPreviousPageDisabled() {
    return this.page === 1;
  }
  isNextPageDisabled() {
    return this.appointmentCards.length == 0;
}
}
