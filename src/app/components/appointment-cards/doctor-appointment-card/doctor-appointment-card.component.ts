import { Component, Input } from '@angular/core';
import { AppointmentCardDto } from '../../../models/Appointment/AppointmentCardDto';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-doctor-appointment-card',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './doctor-appointment-card.component.html',
  styleUrl: './doctor-appointment-card.component.css'
})
export class DoctorAppointmentCardComponent {
  @Input()
  appointmentcard!: AppointmentCardDto;
}
