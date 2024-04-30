import { Component, Input } from '@angular/core';
import { AppointmentCardDto } from '../../../models/Appointment/AppointmentCardDto';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-pet-appointment-card',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './pet-appointment-card.component.html',
  styleUrl: './pet-appointment-card.component.css'
})
export class PetAppointmentCardComponent {
  @Input()
  appointmentcard!: AppointmentCardDto;
}
