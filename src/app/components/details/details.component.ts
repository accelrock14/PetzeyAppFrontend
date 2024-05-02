import { Component, OnInit } from '@angular/core';
import { AppointmentDetailsService } from '../../services/appointment-details.service';
import { CommonModule, NgFor, NgIf, } from '@angular/common';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReportComponent } from '../appointments/report/report.component';
import { AppointmentPetProfileComponent } from '../Pets/appointment-pet-profile/appointment-pet-profile.component';
import { AppointmentDetail } from '../../models/AppointmentDetail';
import { Status } from '../../models/Status';
import { VetProfileApptComponent } from '../Vet/vet-profile-appt/vet-profile-appt.component';

declare var window: any;
@Component({
  selector: 'app-details',
  standalone: true,
  imports: [NgIf, NgFor, DatePipe, RouterLink, ReportComponent, AppointmentPetProfileComponent, VetProfileApptComponent],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent implements OnInit {

  //petIds:number[]=[]
  appointment: AppointmentDetail = {
    AppointmentID: 0,
    DoctorID: '',
    PetID: 0,
    OwnerID: '',
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
  constructor(private appointmentDetailsService: AppointmentDetailsService, private route: ActivatedRoute, private router: Router) { }
  GoBack() {
    // this.router.navigate(['../..']);
  }
  ngOnInit(): void { 
    const ID: any = this.route.snapshot.paramMap.get('id');
    this.appointmentDetailsService.GetAppointmentDetail(ID)
      .subscribe((appointment: any) => this.appointment = appointment);

    // this.appointmentDetailsService.GetAllPetIDByVetId(1)
    // .subscribe({ 
    //   next:(data)=>{
    //     this.petIds = data;
        
        
    //   },
    //   error:(err)=>{
    //     console.log("error while fetching",err);
        
    //   }
    // });
    
    
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
            .subscribe(updatedAppointment => {
              this.appointment = updatedAppointment
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
