import { Component, Input } from '@angular/core';
import { DashboardService } from '../../../services/DashboardServices/dashboard.service';
import { AppointmentCardDto } from '../../../models/Appointment/AppointmentCardDto';
import { DoctorAppointmentCardComponent } from "../../appointment-cards/doctor-appointment-card/doctor-appointment-card.component";
import { PetAppointmentCardComponent } from "../../appointment-cards/pet-appointment-card/pet-appointment-card.component";
import { AuthService } from '../../../services/UserAuthServices/auth.service';

@Component({
  selector: 'app-vet-appointment-list',
  standalone: true,
  templateUrl: './vet-appointment-list.component.html',
  styleUrl: './vet-appointment-list.component.css',
  imports: [DoctorAppointmentCardComponent, PetAppointmentCardComponent]
})
export class VetAppointmentListComponent {
  constructor(private dashboardService: DashboardService, private authService: AuthService) { }
  user!: string
  ngOnInit(): void {
    this.dashboardService.GetAllClosedAppointmentByVetID(this.VetID).subscribe(data => {
      this.appointmentcard = data
    })

    let role = this.authService.getRoleFromToken()
    if (role == "Doctor") {
      this.user = "Doctor"
    }
    else if (role == "Owner") {
      this.user = "Patient"
    }
    else {
      this.user = "Admin"
    }
  }

  @Input()
  VetID: number = 0;
  appointmentcard: AppointmentCardDto[] = []
}

