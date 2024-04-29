import { Component, OnInit } from '@angular/core';
import { FilterParamsDto } from '../../../models/Dashboard/FilterParamsDto';
import { AppointmentCardDto } from '../../../models/Appointment/AppointmentCardDto';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PetAppointmentCardComponent } from '../../appointment-cards/pet-appointment-card/pet-appointment-card.component';
import { DashboardService } from '../../../services/DashboardServices/dashboard.service';

@Component({
  selector: 'app-patient-dashboard',
  standalone: true,
  imports: [FormsModule, CommonModule, PetAppointmentCardComponent],
  templateUrl: './patient-dashboard.component.html',
  styleUrl: './patient-dashboard.component.css'
})
export class PatientDashboardComponent implements OnInit {
  filters: FilterParamsDto = {
    ScheduleDate: null,
    Status: '',
    DoctorID: null
  }
  appointmentCards: AppointmentCardDto[] = [];
  offset : number = 0;
  selectedStatus: string = "";
  selectedDate!: Date;
  onDateStatusChange() {
    //!!!
    throw new Error('Method not implemented.');
  }

  constructor(private service: DashboardService) {}
  ngOnInit(): void {
    this.service.GetPatientAppointmentsWithFilters(this.filters, this.offset, 1).subscribe(data => {
      this.appointmentCards = data;
    })
  }

}
