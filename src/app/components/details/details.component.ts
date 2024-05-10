import {
  Component,
  ElementRef,
  NgModule,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { AppointmentDetailsService } from '../../services/appointment-details.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReportComponent } from '../appointments/report/report.component';
import { AppointmentPetProfileComponent } from '../Pets/appointment-pet-profile/appointment-pet-profile.component';
import { AppointmentDetail } from '../../models/AppointmentDetail';
import { Status } from '../../models/Status';
import { VetProfileApptComponent } from '../Vet/vet-profile-appt/vet-profile-appt.component';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { PetsService } from '../../services/PetsServices/pets.service';
import { AuthService } from '../../services/UserAuthServices/auth.service';
import { VetsserviceService } from '../../services/VetsServices/vetsservice.service';
import { Cancellation } from '../../models/Cancellation';
import { NgModel } from '@angular/forms';
import { FormsModule } from '@angular/forms';
declare var window: any;
@Component({
  selector: 'app-details',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    DatePipe,
    RouterLink,
    ReportComponent,
    AppointmentPetProfileComponent, //pet
    VetProfileApptComponent, //vet
    FormsModule
  ],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css',
})
export class DetailsComponent implements OnInit {
  // parseToInt(arg0: string): number {
  //   return parseInt(arg0);
  // }
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
    PetIssues: [],
  };
  cancellation:Cancellation={
    CancellationId: 0,
    AppointmentID: 0,
    Reason_for_cancellation: ''
  }
  //Modal 1 for close appointment
  formModal: any;
  //Modal 2 for cancel appointment
  formModal2: any;
  //Modlal 3 for accept appointment
  formModal3: any;

  constructor(
    private appointmentDetailsService: AppointmentDetailsService,
    private route: ActivatedRoute,
    private prtSetvice: PetsService,
    private authService: AuthService,
    private vetService: VetsserviceService,
    private router: Router
  ) {}
  /**
   * Check if user role is 'Owner' based on auth token
   */
  isPatient(): boolean {
    const role = this.authService.getRoleFromToken();
    return role === 'Owner';
  }
  /**
   * Check if user role is 'Doctor' based on auth token
   */
  isDoctor(): boolean {
    const role = this.authService.getRoleFromToken();
    return role === 'Doctor';
  }
  /**
   * Check if user role is 'Receptionist' based on auth token
   */
  isReceptionist() {
    const role = this.authService.getRoleFromToken();
    return role === 'Receptionist';
  }
  DoctorName: string = '';

  // What_Flow: string = '';
  // is_Receptionist: boolean = false;
  // is_Doctor: boolean = false;
  // is_Owner: boolean = false;
 
  Reason_for_Cancellation_By_Doc:string='';
  ngOnInit(): void {

    // this.What_Flow = this.authService.getRoleFromToken() as string;
    // console.log(" current user is " + this.What_Flow);
    // if (this.What_Flow == 'Owner') {
    //   this.is_Owner = true;
    // }
    // else if(this.What_Flow == 'Doctor'){
    //   this.is_Doctor = true;
    // }
    // else{
    //   this.is_Receptionist=true;
    // }

    const ID: string = this.route.snapshot.paramMap.get('id')!;

    this.appointmentDetailsService
      .GetAppointmentDetail(parseInt(ID))
      .subscribe((appointment: any) => {
        this.appointment = appointment;
        // if any other id entered other than patients appointment id, redirect to home 
        if (
          this.appointment.OwnerID != this.authService.getUIDFromToken() &&
          this.isPatient()
        ) {
          this.router.navigate(['/home']);
        }
                
        if (appointment.DoctorID !== undefined || appointment.DoctorID !== '') {
          this.vetService
            .getVetById(parseInt(appointment.DoctorID))
            .subscribe(
              (doc) => {this.DoctorName = doc.FName + ' ' + doc.LName
              console.log( doc.NPINumber +" ids  "+ this.authService.getVPIFromToken())
              // currently logged in doctor can see only his/her appointment details
              if( doc.NPINumber != this.authService.getVPIFromToken() &&
              this.isDoctor()){
                this.router.navigate(['/home']);
              }
              }
            );
          console.log(this.DoctorName + ' DOC');
          
        }
        if(this.appointment.Status==2 ){
        this.appointmentDetailsService.GetCancellationReason(parseInt(ID))
        .subscribe((cancel: any) => {
          this.cancellation = cancel;
      });
      console.log("cancelling "+this.cancellation.Reason_for_cancellation)
    }
      });

    this.formModal = new window.bootstrap.Modal(
      document.getElementById('exampleModal2')
    );
    this.formModal2 = new window.bootstrap.Modal(
      document.getElementById('exampleModal3')
    );
    this.formModal3 = new window.bootstrap.Modal(
      document.getElementById('exampleModal4')
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
  openModal3() {
    this.formModal3.show();
  }
  closeModal3() {
    this.formModal3.hide();
  }
   /**
   * Close the appointment by setting status to 'Closed'
   */
  closeAppointment() {
    this.appointmentDetailsService
      .PatchAppointmentStatus(this.appointment.AppointmentID, 3)
      .subscribe(
        (response) => {
          // Handle successful closing of appointment
          this.closeModal();

          this.appointmentDetailsService
            .GetAppointmentDetail(this.appointment.AppointmentID)
            .subscribe((updatedAppointment) => {
              this.appointment = updatedAppointment;
              console.log(this.appointment);
            });
        },
        (error) => {
          console.log("error while closing modal")
        }
      );
    this.prtSetvice.AddLastAppointmentDate(
      this.appointment.PetID,
      this.appointment.ScheduleDate
    );
  }
  /**
   * Cancel the appointment by setting status to 'Cancelled'
   */
  cancelAppointment() {
    this.appointmentDetailsService
      .PatchAppointmentStatus(this.appointment.AppointmentID, 2)
      .subscribe(
        (response) => {
          // Handle successful closing of appointment 
          this.closeModal2();

          // this.confirmed=true;

          this.appointmentDetailsService
            .GetAppointmentDetail(this.appointment.AppointmentID)
            .subscribe(
              (updatedAppointment) => (this.appointment = updatedAppointment)
            );
            // reason for cancellation
            this.cancellation.Reason_for_cancellation=this.Reason_for_Cancellation_By_Doc;
            this.cancellation.AppointmentID=this.appointment.AppointmentID
            this.appointmentDetailsService
            .PostCancellationReason(this.cancellation).subscribe()
        },
        (error) => {
          console.log("error while closing modal")
        }
      );
  }
  /**
   * Accept the appointment by setting status to 'Confirmed'
   */
  acceptAppointment() {
    this.appointmentDetailsService
      .PatchAppointmentStatus(this.appointment.AppointmentID, 1)
      .subscribe(
        (response) => {
          // Handle successful closing of appointment (e.g., show success message)
          this.closeModal3();

          // this.confirmed=true;

          this.appointmentDetailsService
            .GetAppointmentDetail(this.appointment.AppointmentID)
            .subscribe(
              (updatedAppointment) => (this.appointment = updatedAppointment)
            );
        },
        (error) => {
          console.log("error while closing modal")
        }
      );
  }
// Method to generate & download the pdf 
  receivedMessage: string = '';

  async exportToPDF($event: string) {
    const element = document.getElementById('all-appointment');

    if (!element) {
      console.error(`Element with ID ${1} not found.`);
      return;
    }

    const appointmentTitleElement = document.querySelector(
      '.appointment-heading'
    ) as HTMLElement;
    if (appointmentTitleElement) {
      appointmentTitleElement.style.display = 'none'; // Hide the element
    }
    const canvas = await html2canvas(element);

    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF();
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    let position = 0;
    console.log();
    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
    pdf.addImage($event, 'PNG', 0, imgHeight + 2, pdfWidth, 150);

    // Save PDF
    pdf.save(
      'report(appointmentID-' + this.appointment.AppointmentID + ')' + '.pdf'
    );
  }
}
