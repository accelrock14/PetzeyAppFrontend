import { Component, OnInit } from '@angular/core';
import { AppointmentCardDto } from '../../../models/Appointment/AppointmentCardDto';
import { FilterParamsDto } from '../../../models/Dashboard/FilterParamsDto';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PetAppointmentCardComponent } from '../../appointment-cards/pet-appointment-card/pet-appointment-card.component';
import { DashboardService } from '../../../services/DashboardServices/dashboard.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [FormsModule, CommonModule, PetAppointmentCardComponent,RouterLink],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  user:string = "Admin";
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

  constructor(public service: DashboardService) {}
  ngOnInit(): void {
    console.log(this.filters);
    this.service.GetAllAppointmentsWithFilters(this.filters, this.offset).subscribe(data => {
      this.appointmentCards = data;
      console.log(this.appointmentCards);
    })
  //   this.service.GetAllAppointments().subscribe(data => {
  //     this.appointmentCards = data;
  //     this.filteredAppointments = [...this.appointmentCards]; // Initialize filteredAppointments here
  //     this.pageClick(this.page);
  // });
  }
  // filteredAppointments : AppointmentCardDto[] =[]

  onDateStatusDoctorChange() {
    this.filters.DoctorID = this.selectedDoctor;
    this.filters.ScheduleDate = this.selectedDate;
    this.filters.Status = this.selectedStatus;
    this.service.GetAllAppointmentsWithFilters(this.filters, this.offset).subscribe(data => {
      this.appointmentCards = data;
      console.log(this.appointmentCards);
    })
  //   this.filteredAppointments = this.appointmentCards.filter(appointment => {
  //     const matchesDate = !this.selectedDate || new Date(appointment.ScheduleDate).toDateString() === new Date(this.selectedDate).toDateString();
  //     const matchesStatus = !this.selectedStatus || appointment.Status === this.selectedStatus;
  //     const matchesDoctor = !this.selectedDoctor || appointment.DoctorID == this.selectedDoctor;
  //     return matchesDate && matchesStatus && matchesDoctor;
  // });
  //   this.pageClick(this.page);
    
  }

  pageClick(pageInput:number) {
    this.offset = (pageInput-1)*3;
    if(pageInput == this.page - 1){
      this.page--;
    }
    else if(pageInput == this.page + 1) {
      this.page++;
    }
    
    this.filters.DoctorID = this.selectedDoctor;
    this.filters.ScheduleDate = this.selectedDate;
    this.filters.Status = this.selectedStatus;
    this.service.GetAllAppointmentsWithFilters(this.filters, this.offset).subscribe(data => {
      this.appointmentCards = data;
      console.log(this.appointmentCards);
    })
  }
  // pageClick(pageInput: number) {
  //   this.page = pageInput; // Update the current page
  //   if(pageInput == this.page - 1){
  //         this.page--;
  //       }
  //       else if(pageInput == this.page + 1) {
  //         this.page++;
  //       }
  //   const pageSize = 3; // Number of appointments per page
  //   this.offset = (this.page - 1) * pageSize; // Calculate the starting index for the displayed appointments

  //   // Apply filters and update filteredAppointments based on the new offset
  //   this.filteredAppointments = this.appointmentCards
  //       .filter(appointment => {
  //           const matchesDate = !this.selectedDate || new Date(appointment.ScheduleDate).toDateString() === new Date(this.selectedDate).toDateString();
  //           const matchesStatus = !this.selectedStatus || appointment.Status === this.selectedStatus;
  //           const matchesDoctor = !this.selectedDoctor || appointment.DoctorID == this.selectedDoctor;
  //           return matchesDate && matchesStatus && matchesDoctor;
  //       }).slice(this.offset, this.offset + pageSize); // Slice the array to get only the appointments for the current page
  //       console.log(this.filteredAppointments.length);
  //     }


  isPreviousPageDisabled() {
    return this.page === 1;
  }
  isNextPageDisabled() {
    return this.appointmentCards.length == 0;
}





}
