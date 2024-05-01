import { Component, OnInit } from '@angular/core';
import { AppointmentCardDto } from '../../../models/Appointment/AppointmentCardDto';
import { FilterParamsDto } from '../../../models/Dashboard/FilterParamsDto';
import { AppointmentStatusCountsDto } from '../../../models/Dashboard/AppointmentStatusCountsDto';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DoctorAppointmentCardComponent } from '../../appointment-cards/doctor-appointment-card/doctor-appointment-card.component';
import { DashboardService } from '../../../services/DashboardServices/dashboard.service';
import { PetAppointmentCardComponent } from '../../appointment-cards/pet-appointment-card/pet-appointment-card.component';

@Component({
  selector: 'app-doctor-dashboard',
  standalone: true,
  imports: [FormsModule, CommonModule, PetAppointmentCardComponent],
  templateUrl: './doctor-dashboard.component.html',
  styleUrl: './doctor-dashboard.component.css'
})
export class DoctorDashboardComponent implements OnInit {
  appointmentCards: AppointmentCardDto[] = [];
  offset : number = 0;
  selectedStatus: string = "";
  selectedDate!: Date;
  filters: FilterParamsDto = {
    ScheduleDate: null,
    Status: '',
    DoctorID: null
  };
  appointmentStatus: AppointmentStatusCountsDto = {
    Pending: 0,
    Confirmed: 0,
    Cancelled: 0,
    Total: 0,
    Closed: 0
  }
  page:number = 1;

  constructor(private service: DashboardService) {}
  ngOnInit(): void {
    // this.service.GetVetAppointmentsWithFilters(this.filters, this.offset, 1).subscribe(data => {
    //   this.appointmentCards = data;
    // })
    this.service.GetVetAppointments(1).subscribe(data => {this.appointmentCards = data});

    this.service.GetStatusCounts().subscribe(data => {
      this.appointmentStatus = data;
    })
  }
  filteredAppointments : AppointmentCardDto[] =[]

  onDateStatusChange() {
    
    // this.filters.ScheduleDate = this.selectedDate;
    // this.filters.Status = this.selectedStatus;
    // this.service.GetVetAppointmentsWithFilters(this.filters, this.offset, 1).subscribe(data => {
    //   this.appointmentCards = data;
    // })
    this.filteredAppointments = this.appointmentCards.filter(appointment => {
      const matchesDate = !this.selectedDate || new Date(appointment.ScheduleDate).toDateString() === new Date(this.selectedDate).toDateString();
      const matchesStatus = !this.selectedStatus || appointment.Status === this.selectedStatus;
      return matchesDate && matchesStatus;
  });
  }

  pageClick(pageInput:number) {
    // this.offset = (pageInput-1)*3;
    // if(pageInput == this.page - 1){
    //   this.page--;
    // }
    // else if(pageInput == this.page + 1) {
    //   this.page++;
    // }
    // this.filters.ScheduleDate = this.selectedDate;
    // this.filters.Status = this.selectedStatus;
    // this.service.GetVetAppointmentsWithFilters(this.filters, this.offset, 1).subscribe(data => {
    //   this.appointmentCards = data;
    //})
  }

  isPreviousPageDisabled() {
    return this.page === 1;
  }
}
