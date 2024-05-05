import {
  Component,
  ElementRef,
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
    AppointmentPetProfileComponent,
    VetProfileApptComponent,
  ],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css',
})
export class DetailsComponent implements OnInit {
parseToInt(arg0: string): number {
return parseInt(arg0);
}
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
  formModal: any;
  formModal2: any;
  formModal3: any;
  
  constructor(
    private appointmentDetailsService: AppointmentDetailsService,
    private route: ActivatedRoute,
    private prtSetvice: PetsService,
    private authService:AuthService,
    private vetService:VetsserviceService,
    private router:Router
  ) {}
  isPatient(): boolean {
    const role = this.authService.getRoleFromToken();
    return role === 'Owner';
  }
  isDoctor():boolean{
    const role=this.authService.getRoleFromToken();
    return role=== 'Doctor';
  }
  DoctorName:string='';
  ngOnInit(): void {

    const ID: string= this.route.snapshot.paramMap.get('id')!;
    
      this.appointmentDetailsService
      .GetAppointmentDetail(parseInt(ID))
      .subscribe((appointment: any) => {
        this.appointment = appointment;
        
        if(this.appointment.OwnerID!=this.authService.getUIDFromToken()&&!this.isDoctor()){
          this.router.navigate(['/home']);
        }
  
        if (appointment.DoctorID !== undefined && appointment.DoctorID !== '') {
          console.log(appointment.DoctorID + " DOCccc");
          this.vetService.getVetById(parseInt(appointment.DoctorID))
            .subscribe((doc) => this.DoctorName = (doc.FName + " " + doc.LName));
          console.log(this.DoctorName + " DOC");
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

  closeAppointment() {
    this.appointmentDetailsService
      .PatchAppointmentStatus(this.appointment.AppointmentID, 3) 
      .subscribe(
        (response) => {
          // Handle successful closing of appointment (e.g., show success message)
          this.closeModal();

          this.appointmentDetailsService
            .GetAppointmentDetail(this.appointment.AppointmentID)
            .subscribe((updatedAppointment) => {
              this.appointment = updatedAppointment;
              console.log(this.appointment);
            });
        },
        (error) => {
          // Handle error scenario (e.g., show error message)
        }
      );
    this.prtSetvice
      .AddLastAppointmentDate(
        this.appointment.PetID,
        this.appointment.ScheduleDate
      );
      
  }
  cancelAppointment() {
    this.appointmentDetailsService
      .PatchAppointmentStatus(this.appointment.AppointmentID, 2)
      .subscribe(
        (response) => {
          // Handle successful closing of appointment (e.g., show success message)
          this.closeModal2();

          // this.confirmed=true;

          this.appointmentDetailsService
            .GetAppointmentDetail(this.appointment.AppointmentID)
            .subscribe(
              (updatedAppointment) => (this.appointment = updatedAppointment)
            );
        },
        (error) => {
          // Handle error scenario (e.g., show error message)
        }
      );
  }


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
          // Handle error scenario (e.g., show error message)
        }
      );
  }

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
    pdf.save('report' + this.appointment.AppointmentID + '.pdf');
  }
}
