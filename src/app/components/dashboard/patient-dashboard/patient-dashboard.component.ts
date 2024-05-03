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
    DoctorID: null
  }
  appointmentCards: AppointmentCardDto[] = [];
  offset : number = 0;
  selectedStatus: string = "";
  selectedDate!: Date;
  page:number = 1;

  constructor(private service: DashboardService,public authService: AuthService) {}
  ngOnInit(): void {
    console.log(this.authService.getUIDFromToken());
    this.service.GetPatientAppointmentsWithFilters(this.filters, this.offset, "1").subscribe(data => {
      this.appointmentCards = data;
    })
  }

  onDateStatusChange() {
    
    this.filters.ScheduleDate = this.selectedDate;
    this.filters.Status = this.selectedStatus;
    this.service.GetPatientAppointmentsWithFilters(this.filters, this.offset, "1").subscribe(data => {
      this.appointmentCards = data;
    })
  }
  pageClick(pageInput:number) {
    this.offset = (pageInput-1)*3;
    if(pageInput == this.page - 1){
      this.page--;
    }
    else if(pageInput == this.page + 1) {
      this.page++;
    }
    this.filters.ScheduleDate = this.selectedDate;
    this.filters.Status = this.selectedStatus;
    this.service.GetPatientAppointmentsWithFilters(this.filters, this.offset, "1").subscribe(data => {
      this.appointmentCards = data;
    })
  }
  isPreviousPageDisabled() {
    return this.page === 1;
  }
  isNextPageDisabled() {
    return this.appointmentCards.length == 0;
}
}
