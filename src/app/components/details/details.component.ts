import { Component, OnInit } from '@angular/core';
import { AppointmentDetailsService } from '../../services/appointment-details.service';
import { NgFor, NgIf } from '@angular/common';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

declare var window:any;
@Component({
  selector: 'app-details',
  standalone: true,
  imports: [NgIf,NgFor,DatePipe,RouterLink],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent implements OnInit {

  appointment: any | undefined;
  formModal:any;
  formModal2:any;
  constructor(private appointmentDetailsService: AppointmentDetailsService) {}
  ngOnInit(): void {
    
   this.appointmentDetailsService.GetAppointmentDetail(10)
   .subscribe((appointment: any) => this.appointment = appointment);

   

   this.formModal=new window.bootstrap.Modal(
    document.getElementById("exampleModal2")
  );
  this.formModal2=new window.bootstrap.Modal(
    document.getElementById("exampleModal3")
  );
   }
  
  openModal(){
    this.formModal.show();
  }
  closeModal(){
    this.formModal.hide();
  }
  openModal2(){
    this.formModal2.show();
  }
  closeModal2(){
    this.formModal2.hide();
  }
  closeAppointment() {
   
    this.appointmentDetailsService.PatchAppointmentStatus(this.appointment.AppointmentID,3)
      .subscribe(
        (response) => {
          // Handle successful closing of appointment (e.g., show success message)
          this.closeModal();
          localStorage.setItem('confirmedAppointmentId', this.appointment.AppointmentID);
          
        },
        (error) => {
          // Handle error scenario (e.g., show error message)
        }
      );
  }
  cancelAppointment() {
   
    this.appointmentDetailsService.PatchAppointmentStatus(this.appointment.AppointmentID,2)
      .subscribe(
        (response) => {
          // Handle successful closing of appointment (e.g., show success message)
          this.closeModal2();
          localStorage.setItem('confirmedAppointmentId', this.appointment.AppointmentID);
          // this.confirmed=true;

          // this.appointmentDetailsService.GetAppointmentDetail(this.appointment.AppointmentID)
          //   .subscribe(updatedAppointment => this.appointment = updatedAppointment);
        },
        (error) => {
          // Handle error scenario (e.g., show error message)
        }
      );
  }



}
