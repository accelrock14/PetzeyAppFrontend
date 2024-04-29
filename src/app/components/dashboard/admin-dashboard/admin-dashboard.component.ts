import { Component, OnInit } from '@angular/core';
import { AppointmentCardDto } from '../../../models/Appointment/AppointmentCardDto';
import { FilterParamsDto } from '../../../models/Dashboard/FilterParamsDto';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PetAppointmentCardComponent } from '../../appointment-cards/pet-appointment-card/pet-appointment-card.component';
import { DashboardService } from '../../../services/DashboardServices/dashboard.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [FormsModule, CommonModule, PetAppointmentCardComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  appointmentCards: AppointmentCardDto[] = [];
  offset : number = 0;
  selectedStatus: string = "";
  selectedDate!: Date;
  selectedDoctor!: number;
  filters: FilterParamsDto = {
    ScheduleDate: null,
    Status: "Confirmed",
    DoctorID: 1
  };

  constructor(private service: DashboardService) {}
  ngOnInit(): void {
    console.log(this.filters);
    this.service.GetAllAppointmentsWithFilters(this.filters, this.offset).subscribe(data => {
      this.appointmentCards = data;
      console.log(this.appointmentCards);
    })
  }

  onDateStatusDoctorChange() {
    //!!!
    
  }
}
