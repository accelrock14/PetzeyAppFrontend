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
import { AppointmentStatusCountsDto } from '../../../models/Dashboard/AppointmentStatusCountsDto';
import { IDFiltersDto } from '../../../models/Dashboard/IDFiltersDto';

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
  selectedDate: Date | null = null;
  selectedDoctor: string | null = null;
  filters: FilterParamsDto = {
    ScheduleDate: null,
    Status: "",
    DoctorID: null
  };
  appointmentStatus: AppointmentStatusCountsDto = {
    Pending: 0,
    Confirmed: 0,
    Cancelled: 0,
    Total: 0,
    Closed: 0
  }
  ids : IDFiltersDto = {
    DoctorID: '',
    OwnerID: ''
  };
  page:number = 1;
  doctorsList: VetDTO[] = [];
  loadingAppointments: boolean = false;

  constructor(public service: DashboardService, private vetService: VetsserviceService) {}
  ngOnInit(): void {
    //initial loading of appointments with empty filters
    this.loadingAppointments = true;
    this.service.GetAllAppointmentsWithFilters(this.filters, this.offset).subscribe(data => {
      this.appointmentCards = data;
      this.loadingAppointments = false;
    })
    this.vetService.getVetsAndIds().subscribe(data => {
      this.doctorsList = data;
      console.log(this.doctorsList);
    })
    this.service.GetStatusCounts(this.ids).subscribe(count => {
      this.appointmentStatus = count;
    })
    
  }

  onDateStatusDoctorChange() {
    //re setting the filters on filter changes
    this.page = 1;
    this.pageClick(this.page);
    
  }

  pageClick(pageInput:number) {
    //set offset for pagination
    this.offset = (pageInput-1)*4;
    if(pageInput == this.page - 1){
      this.page--;
    }
    else if(pageInput == this.page + 1) {
      this.page++;
    }
    //set filters and get appointments from service
    this.filters.DoctorID = this.selectedDoctor;
    this.filters.ScheduleDate = this.selectedDate;
    this.filters.Status = this.selectedStatus;
    this.loadingAppointments = true;
    this.service.GetAllAppointmentsWithFilters(this.filters, this.offset).subscribe(data => {
      this.appointmentCards = data;
      console.log(this.appointmentCards);
      this.loadingAppointments = false;
    })
  }
  isPreviousPageDisabled() {
    return this.page === 1;
  }
  isNextPageDisabled() {
    return this.page == Math.ceil(this.appointmentCards[0].All/4);    
}





}
