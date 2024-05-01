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
    Status: "",
    DoctorID: null
  };
  page:number = 1;

  constructor(private service: DashboardService) {}
  ngOnInit(): void {
    console.log(this.filters);
    // this.service.GetAllAppointmentsWithFilters(this.filters, this.offset).subscribe(data => {
    //   this.appointmentCards = data;
    //   console.log(this.appointmentCards);
    // })
    this.service.GetAllAppointments().subscribe(data => {
      this.appointmentCards = data;
      this.filteredAppointments = [...this.appointmentCards]; // Initialize filteredAppointments here
  });
  }
  filteredAppointments : AppointmentCardDto[] =[]

  onDateStatusDoctorChange() {
    // this.filters.DoctorID = this.selectedDoctor;
    // this.filters.ScheduleDate = this.selectedDate;
    // this.filters.Status = this.selectedStatus;
    // this.service.GetAllAppointmentsWithFilters(this.filters, this.offset).subscribe(data => {
    //   this.appointmentCards = data;
    //   console.log(this.appointmentCards);
    // })
    this.filteredAppointments = this.appointmentCards.filter(appointment => {
      const matchesDate = !this.selectedDate || new Date(appointment.ScheduleDate).toDateString() === new Date(this.selectedDate).toDateString();
      const matchesStatus = !this.selectedStatus || appointment.Status === this.selectedStatus;
      const matchesDoctor = !this.selectedDoctor || appointment.DoctorID == this.selectedDoctor;
      return matchesDate && matchesStatus && matchesDoctor;
  });

    
  }

  pageClick(pageInput:number) {
    this.offset = (pageInput-1)*3;
    if(pageInput == this.page - 1){
      this.page--;
    }
    else if(pageInput == this.page + 1) {
      this.page++;
    }
    // this.filters.DoctorID = this.selectedDoctor;
    // this.filters.ScheduleDate = this.selectedDate;
    // this.filters.Status = this.selectedStatus;
    // this.service.GetAllAppointmentsWithFilters(this.filters, this.offset).subscribe(data => {
    //   this.appointmentCards = data;
    //   console.log(this.appointmentCards);
    // })
  }

  isPreviousPageDisabled() {
    return this.page === 1;
  }


}
