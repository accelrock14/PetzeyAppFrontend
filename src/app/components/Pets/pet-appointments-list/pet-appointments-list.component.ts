
import { Component, Input, OnInit } from '@angular/core';
import { DoctorDashboardComponent } from '../../dashboard/doctor-dashboard/doctor-dashboard.component';
import { DoctorAppointmentCardComponent } from '../../appointment-cards/doctor-appointment-card/doctor-appointment-card.component';
import { AppointmentCardDto } from '../../../models/Appointment/AppointmentCardDto';
import { DashboardService } from '../../../services/DashboardServices/dashboard.service';

@Component({
  selector: 'app-pet-appointments-list',
  standalone: true,
  imports: [DoctorDashboardComponent, DoctorAppointmentCardComponent],
  templateUrl: './pet-appointments-list.component.html',
  styleUrl: './pet-appointments-list.component.css'
})
export class PetAppointmentsListComponent implements OnInit {

  
    constructor(private dashboardService:DashboardService){}
  ngOnInit(): void {
    this.dashboardService.GetAllClosedAppointmentByPetID(this.PetID).subscribe(data => {
      this.appointmentcard = data
    })
  }

    @Input()
    PetID:number = 0;
    appointmentcard:AppointmentCardDto[] = []
}
