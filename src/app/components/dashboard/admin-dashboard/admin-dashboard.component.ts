import { Component, OnInit } from '@angular/core';
import { AppointmentCardDto } from '../../../models/Appointment/AppointmentCardDto';
import { FilterParamsDto } from '../../../models/Dashboard/FilterParamsDto';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PetAppointmentCardComponent } from '../../appointment-cards/pet-appointment-card/pet-appointment-card.component';
import { DashboardService } from '../../../services/DashboardServices/dashboard.service';
import { RouterLink } from '@angular/router';
import { VetsserviceService } from '../../../services/VetsServices/vetsservice.service';
import { VetDTO } from '../../../models/Vets/IVetDTO';

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
  selectedDoctor: string = "";
  filters: FilterParamsDto = {
    ScheduleDate: null,
    Status: "",
    DoctorID: ""
  };
  page:number = 1;
  doctorsList: VetDTO[] = [];

  constructor(public service: DashboardService, private vetService: VetsserviceService) {}
  ngOnInit(): void {
    this.service.GetAllAppointmentsWithFilters(this.filters, this.offset).subscribe(data => {
      this.appointmentCards = data;
    })
    this.vetService.getVetsAndIds().subscribe(data => {
      this.doctorsList = data;
      console.log(this.doctorsList);
    })
  }

  onDateStatusDoctorChange() {
    this.filters.DoctorID = this.selectedDoctor;
    this.filters.ScheduleDate = this.selectedDate;
    this.filters.Status = this.selectedStatus;
    console.log(this.filters);
    this.service.GetAllAppointmentsWithFilters(this.filters, this.offset).subscribe(data => {
      this.appointmentCards = data;
      console.log(this.appointmentCards);
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
    
    this.filters.DoctorID = this.selectedDoctor;
    this.filters.ScheduleDate = this.selectedDate;
    this.filters.Status = this.selectedStatus;
    this.service.GetAllAppointmentsWithFilters(this.filters, this.offset).subscribe(data => {
      this.appointmentCards = data;
      console.log(this.appointmentCards);
    })
  }
  isPreviousPageDisabled() {
    return this.page === 1;
  }
  isNextPageDisabled() {
    return this.appointmentCards.length == 0;
}





}
