import { Component, OnInit } from '@angular/core';
import { FilterParamsDto } from '../../../models/Dashboard/FilterParamsDto';
import { AppointmentCardDto } from '../../../models/Appointment/AppointmentCardDto';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PetAppointmentCardComponent } from '../../appointment-cards/pet-appointment-card/pet-appointment-card.component';
import { DashboardService } from '../../../services/DashboardServices/dashboard.service';
import { DoctorAppointmentCardComponent } from '../../appointment-cards/doctor-appointment-card/doctor-appointment-card.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-patient-dashboard',
  standalone: true,
  imports: [FormsModule, CommonModule, DoctorAppointmentCardComponent,RouterLink],
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
  page:number = 1;

  constructor(private service: DashboardService) {}
  ngOnInit(): void {
    this.service.GetPatientAppointmentsWithFilters(this.filters, this.offset, 1).subscribe(data => {
      this.appointmentCards = data;
    })
    // this.service.GetPatientAppointments(1).subscribe(data => {
    //   this.appointmentCards = data
    //   this.filteredAppointments = [...this.appointmentCards]; // Initialize filteredAppointments here
    //   this.pageClick(this.page);
    // });
  }
  // filteredAppointments : AppointmentCardDto[] =[]
  onDateStatusChange() {
    
    this.filters.ScheduleDate = this.selectedDate;
    this.filters.Status = this.selectedStatus;
    this.service.GetPatientAppointmentsWithFilters(this.filters, this.offset, 1).subscribe(data => {
      this.appointmentCards = data;
    })
  //   this.filteredAppointments = this.appointmentCards.filter(appointment => {
  //     const matchesDate = !this.selectedDate || new Date(appointment.ScheduleDate).toDateString() === new Date(this.selectedDate).toDateString();
  //     const matchesStatus = !this.selectedStatus || appointment.Status === this.selectedStatus;
  //     return matchesDate && matchesStatus;
  // });
  // this.pageClick(this.page);
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
    this.service.GetPatientAppointmentsWithFilters(this.filters, this.offset, 1).subscribe(data => {
      this.appointmentCards = data;
    })
  }
//   pageClick(pageInput: number) {
//     this.page = pageInput; // Update the current page
//     if(pageInput == this.page - 1){
//           this.page--;
//         }
//         else if(pageInput == this.page + 1) {
//           this.page++;
//         }
//     const pageSize = 3; // Number of appointments per page
//     this.offset = (this.page - 1) * pageSize; // Calculate the starting index for the displayed appointments

//     // Apply filters and update filteredAppointments based on the new offset
//     this.filteredAppointments = this.appointmentCards
//         .filter(appointment => {
//             const matchesDate = !this.selectedDate || new Date(appointment.ScheduleDate).toDateString() === new Date(this.selectedDate).toDateString();
//             const matchesStatus = !this.selectedStatus || appointment.Status === this.selectedStatus;
//             return matchesDate && matchesStatus;
//         })
//         .slice(this.offset, this.offset + pageSize); // Slice the array to get only the appointments for the current page
// }

  isPreviousPageDisabled() {
    return this.page === 1;
  }
  isNextPageDisabled() {
    return this.appointmentCards.length == 0;
}
}
