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
import { AppointmentStatusCountsDto } from '../../../models/Dashboard/AppointmentStatusCountsDto';
import { IDFiltersDto } from '../../../models/Dashboard/IDFiltersDto';
import { IVetIdNameDTO } from '../../../models/Vets/IVetIDNameDto';
import { IPetCardDto } from '../../../models/Pets/IPetCardDto';
import { VetsserviceService } from '../../../services/VetsServices/vetsservice.service';
import { PetsService } from '../../../services/PetsServices/pets.service';

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
    DoctorID: ""
  }


  appointmentCards: AppointmentCardDto[] = [];
  appdocids : number[] = [];
  apppetids : number[] = [];
  appownerids : string[] = [];
  appdocdetails : IVetIdNameDTO[] = [];
  apppetdetails : IPetCardDto[] = [];
  appownerdetails : any[] = [];



  offset : number = 0;
  selectedStatus: string = "";
  selectedDate!: Date;
  page:number = 1;
  loadingAppointments: boolean = false;
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
  UpcomingappointmentCards: AppointmentCardDto[] = [];
  docids : number[] = [];
  petids : number[] = [];
  ownerids : string[] = [];
  docdetails : IVetIdNameDTO[] = [];
  petdetails : IPetCardDto[] = [];
  ownerdetails : any[] = [];


  constructor(private service: DashboardService,public authService: AuthService,private vetService: VetsserviceService, private petService : PetsService) {}
  ngOnInit(): void {
    // using auth service to get appointments according to OWNER ID
    this.loadingAppointments = true;
    this.getpatientappointments();
    this.ids.OwnerID = this.authService.getUIDFromToken();
    console.log(this.ids);
    this.service.GetStatusCounts(this.ids).subscribe(count => {
      this.appointmentStatus = count;
      this.getUpcomingappointments();
    })
    
  }

  private getUpcomingappointments() {
    this.service.GetUpcomingAppointments(this.ids).subscribe(data => {
      this.UpcomingappointmentCards = data;
      console.log(data);
      });
    };
  

  private getpatientappointments() {
    this.service.GetPatientAppointmentsWithFilters(this.filters, this.offset, this.authService.getUIDFromToken()).subscribe(data => {
      this.appointmentCards = data;
      this.loadingAppointments = false;
      });
    };
  

  onDateStatusChange() {
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
    this.filters.ScheduleDate = this.selectedDate;
    this.filters.Status = this.selectedStatus;
    this.loadingAppointments = true;
    this.service.GetPatientAppointmentsWithFilters(this.filters, this.offset, this.authService.getUIDFromToken()).subscribe(data => {
      this.appointmentCards = data;
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
