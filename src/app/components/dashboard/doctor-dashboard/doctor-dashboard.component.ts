import { Component, OnInit } from '@angular/core';
import { AppointmentCardDto } from '../../../models/Appointment/AppointmentCardDto';
import { FilterParamsDto } from '../../../models/Dashboard/FilterParamsDto';
import { AppointmentStatusCountsDto } from '../../../models/Dashboard/AppointmentStatusCountsDto';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DoctorAppointmentCardComponent } from '../../appointment-cards/doctor-appointment-card/doctor-appointment-card.component';
import { DashboardService } from '../../../services/DashboardServices/dashboard.service';

@Component({
  selector: 'app-doctor-dashboard',
  standalone: true,
  imports: [FormsModule, CommonModule, DoctorAppointmentCardComponent],
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

  constructor(private service: DashboardService) {}
  ngOnInit(): void {
    this.service.GetVetAppointmentsWithFilters(this.filters, this.offset, 1).subscribe(data => {
      this.appointmentCards = data;
    })
    this.service.GetStatusCounts().subscribe(data => {
      this.appointmentStatus = data;
    })
  }

  onDateStatusChange() {
    //!!!
    throw new Error('Method not implemented.');
  }

}
