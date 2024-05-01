import { Component } from '@angular/core';
import { DoctorDashboardComponent } from '../../dashboard/doctor-dashboard/doctor-dashboard.component';

@Component({
  selector: 'app-pet-appointments-list',
  standalone: true,
  imports: [DoctorDashboardComponent],
  templateUrl: './pet-appointments-list.component.html',
  styleUrl: './pet-appointments-list.component.css'
})
export class PetAppointmentsListComponent {

}
