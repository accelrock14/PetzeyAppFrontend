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

  constructor(private service: DashboardService,public authService: AuthService) {}
  ngOnInit(): void {
    console.log(this.authService.getUIDFromToken());
    this.loadingAppointments = true;
    this.service.GetPatientAppointmentsWithFilters(this.filters, this.offset, this.authService.getUIDFromToken()).subscribe(data => {
      this.appointmentCards = data;
      this.loadingAppointments = false;
    })
  }

  onDateStatusChange() {
    
    this.filters.ScheduleDate = this.selectedDate;
    this.filters.Status = this.selectedStatus;
    this.loadingAppointments = true;
    this.service.GetPatientAppointmentsWithFilters(this.filters, this.offset, this.authService.getUIDFromToken()).subscribe(data => {
      this.appointmentCards = data;
      this.loadingAppointments = false;
    })
  }
  pageClick(pageInput:number) {
    this.offset = (pageInput-1)*4;
    if(pageInput == this.page - 1){
      this.page--;
    }
    else if(pageInput == this.page + 1) {
      this.page++;
    }
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
