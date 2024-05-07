
import { Component, Input, OnInit } from '@angular/core';
import { DoctorDashboardComponent } from '../../dashboard/doctor-dashboard/doctor-dashboard.component';
import { DoctorAppointmentCardComponent } from '../../appointment-cards/doctor-appointment-card/doctor-appointment-card.component';
import { AppointmentCardDto } from '../../../models/Appointment/AppointmentCardDto';
import { DashboardService } from '../../../services/DashboardServices/dashboard.service';
import { NgFor } from '@angular/common';
import { AuthService } from '../../../services/UserAuthServices/auth.service';

@Component({
  selector: 'app-pet-appointments-list',
  standalone: true,
  imports: [DoctorDashboardComponent, DoctorAppointmentCardComponent, NgFor],
  templateUrl: './pet-appointments-list.component.html',
  styleUrl: './pet-appointments-list.component.css'
})
export class PetAppointmentsListComponent implements OnInit {
  user!: string

  constructor(private dashboardService: DashboardService, private authService: AuthService) { }
  ngOnInit(): void {
    // fetch all appointments list based on petid
    this.dashboardService.GetAllClosedAppointmentByPetID(this.PetID).subscribe(data => {
      this.appointmentcard = data
    })

    // control flow of ui based on logged in user
    let role = this.authService.getRoleFromToken()
    if (role == "Doctor") {
      this.user = "Doctor"
    }
    else if (role == "Owner") {
      this.user = "Patient"
    }
    else {
      this.user = "Receptionist"
    }
  }

  @Input()
  PetID: number = 0;
  appointmentcard: AppointmentCardDto[] = []
}
