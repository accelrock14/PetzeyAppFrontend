import { Component, OnInit } from '@angular/core';
import { AppointmentDetailsService } from '../../services/appointment-details.service';
import { CommonModule, NgFor, NgIf, } from '@angular/common';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReportComponent } from '../appointments/report/report.component';
import { AppointmentPetProfileComponent } from '../Pets/appointment-pet-profile/appointment-pet-profile.component';
import { AppointmentDetail } from '../../models/AppointmentDetail';
import { Status } from '../../models/Status';

declare var window: any;
@Component({
  selector: 'app-details',
  standalone: true,
  imports: [NgIf, NgFor, DatePipe, RouterLink,ReportComponent, AppointmentPetProfileComponent],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent implements OnInit {

  appointment:AppointmentDetail = {
    AppointmentID: 0,
    DoctorID: 0,
    PetID: 0,
    OwnerID: 0,
    ScheduleDate: new Date(),
    ScheduleTimeSlot: 0,
    BookingDate: new Date(),
    ReasonForVisit: '',
    Status: Status.Pending,
    Report: null,
    PetIssues: []
  }
  formModal: any;
  formModal2: any;
  constructor(private appointmentDetailsService: AppointmentDetailsService) { }
  ngOnInit(): void {

    this.appointmentDetailsService.GetAppointmentDetail(51)
      .subscribe((appointment: any) => this.appointment = appointment);



    this.formModal = new window.bootstrap.Modal(
      document.getElementById("exampleModal2")
    );
    this.formModal2 = new window.bootstrap.Modal(
      document.getElementById("exampleModal3")
    );
  }

  openModal() {
    this.formModal.show();
  }
  closeModal() {
    this.formModal.hide();
  }
  openModal2() {
    this.formModal2.show();
  }
  closeModal2() {
    this.formModal2.hide();
  }
  closeAppointment() {

    this.appointmentDetailsService.PatchAppointmentStatus(this.appointment.AppointmentID, 3)
      .subscribe(
        (response) => {
          // Handle successful closing of appointment (e.g., show success message)
          this.closeModal();

          this.appointmentDetailsService.GetAppointmentDetail(this.appointment.AppointmentID)
            .subscribe(updatedAppointment =>{ this.appointment = updatedAppointment
        console.log(this.appointment);

            });
            
            
        },
        (error) => {
          // Handle error scenario (e.g., show error message)
        }
      );
  }
  cancelAppointment() {

    this.appointmentDetailsService.PatchAppointmentStatus(this.appointment.AppointmentID, 2)
      .subscribe(
        (response) => {
          // Handle successful closing of appointment (e.g., show success message)
          this.closeModal2();

          // this.confirmed=true;

          this.appointmentDetailsService.GetAppointmentDetail(this.appointment.AppointmentID)
            .subscribe(updatedAppointment => this.appointment = updatedAppointment);
        },
        (error) => {
          // Handle error scenario (e.g., show error message)
        }
      );
  }



}
