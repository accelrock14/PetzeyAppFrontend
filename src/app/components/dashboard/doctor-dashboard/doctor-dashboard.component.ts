import { Component, OnInit } from '@angular/core';
import { AppointmentCardDto } from '../../../models/Appointment/AppointmentCardDto';
import { FilterParamsDto } from '../../../models/Dashboard/FilterParamsDto';
import { AppointmentStatusCountsDto } from '../../../models/Dashboard/AppointmentStatusCountsDto';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DoctorAppointmentCardComponent } from '../../appointment-cards/doctor-appointment-card/doctor-appointment-card.component';
import { DashboardService } from '../../../services/DashboardServices/dashboard.service';
import { PetAppointmentCardComponent } from '../../appointment-cards/pet-appointment-card/pet-appointment-card.component';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/UserAuthServices/auth.service';
import { VetsserviceService } from '../../../services/VetsServices/vetsservice.service';
import { IVet } from '../../../models/Vets/IVet';

@Component({
  selector: 'app-doctor-dashboard',
  standalone: true,
  imports: [FormsModule, CommonModule, PetAppointmentCardComponent, RouterLink],
  templateUrl: './doctor-dashboard.component.html',
  styleUrl: './doctor-dashboard.component.css'
})
export class DoctorDashboardComponent implements OnInit {
  user: string = "Doctor";
  appointmentCards: AppointmentCardDto[] = [];
  offset: number = 0;
  selectedStatus: string = "";
  selectedDate!: Date;
  filters: FilterParamsDto = {
    ScheduleDate: null,
    Status: '',
    DoctorID: ""
  };
  appointmentStatus: AppointmentStatusCountsDto = {
    Pending: 0,
    Confirmed: 0,
    Cancelled: 0,
    Total: 0,
    Closed: 0
  }
  page: number = 1;
  doctorIdFromNPI: string = "";

  constructor(private service: DashboardService, public authService: AuthService, private vetService: VetsserviceService) { }
  ngOnInit(): void {
    // console.log(this.authService.getUIDFromToken());

    let npi: any = this.authService.getVPIFromToken()

    let doc: IVet;
    this.vetService.getVetsByNPINumber(npi).subscribe(data => {
      doc = data;
      this.doctorIdFromNPI = String(doc.VetId);
      console.log('doc', this.doctorIdFromNPI)
      this.service.GetVetAppointmentsWithFilters(this.filters, this.offset, this.doctorIdFromNPI).subscribe(vet => {
        this.appointmentCards = vet;

      })
      this.service.GetStatusCounts(this.doctorIdFromNPI).subscribe(count => {
        this.appointmentStatus = count;
      })
    })



  }

  onDateStatusChange() {

    this.filters.ScheduleDate = this.selectedDate;
    this.filters.Status = this.selectedStatus;
    this.service.GetVetAppointmentsWithFilters(this.filters, this.offset, this.doctorIdFromNPI).subscribe(data => {
      this.appointmentCards = data;
    })
  }

  pageClick(pageInput: number) {
    this.offset = (pageInput - 1) * 3;
    if (pageInput == this.page - 1) {
      this.page--;
    }
    else if (pageInput == this.page + 1) {
      this.page++;
    }
    this.filters.ScheduleDate = this.selectedDate;
    this.filters.Status = this.selectedStatus;
    this.service.GetVetAppointmentsWithFilters(this.filters, this.offset, this.doctorIdFromNPI).subscribe(data => {
      this.appointmentCards = data;
    })
  }
  isPreviousPageDisabled() {
    return this.page === 1;
  }
  isNextPageDisabled() {
    return this.appointmentCards.length == 0;
  }
}
