import { Component, OnInit } from '@angular/core';
import { AppointmentDetailsService } from '../../services/appointment-details.service';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [NgIf,NgFor],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent implements OnInit {
  appointment: any | undefined;
  constructor(private appointmentDetailsService: AppointmentDetailsService) {}
  ngOnInit(): void {
   this.appointmentDetailsService.GetAppointmentDetail(5)
   .subscribe((appointment: any) => this.appointment = appointment);
  }

}
