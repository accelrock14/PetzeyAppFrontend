import { PetsService } from './../../services/PetsServices/pets.service';
import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren,
  inject,
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
import { AuthService } from '../../services/UserAuthServices/auth.service';
import { VetsserviceService } from '../../services/VetsServices/vetsservice.service';
import { ReportService } from '../../services/appointment/report.service';
import { IReport } from '../../models/appoitment-models/Report';
import { error } from 'jquery';
import { ToastrService } from 'ngx-toastr';
import { IPet } from '../../models/Pets/IPet';
import { IVetCardDTO } from '../../models/Vets/IVetCardDto';
import { IVetProfileDTO } from '../../models/Vets/IVetProfileDto';

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
  ngOnInit(): void {
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
            .subscribe((doc) => {
              this.DoctorName = doc.FName + ' ' + doc.LName;
              console.log(
                doc.NPINumber + ' ids  ' + this.authService.getVPIFromToken()
              );
              // currently logged in doctor can see only his/her appointment details
              if (
                doc.NPINumber != this.authService.getVPIFromToken() &&
                this.isDoctor()
              ) {
                this.router.navigate(['/home']);
              }
            });
          console.log(this.DoctorName + ' DOC');
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
          console.log('error while closing modal');
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
        },
        (error) => {
          console.log('error while closing modal');
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
          console.log('error while closing modal');
        }
      );
  }
  // Method to generate & download the pdf

  async exportToPDF() {
    let doc = new jsPDF();
    let report!: IReport;
    let pet!: IPet;
    let vet!: IVetProfileDTO;

    const reportService = inject(ReportService);
    const petService = inject(PetsService);
    const vetService = inject(VetsserviceService);
    const toastr = inject(ToastrService);

    petService.GetPetDetailsByID(this.appointment.PetID).subscribe(
      (p) => {
        pet = p;
      },
      (err) => {
        toastr.error('Unbale to fetch the data. Pease try after sometime');
      }
    );

    vetService
      .getVetById(parseInt(this.appointment.DoctorID) as number)
      .subscribe(
        (v) => {
          vet = v;
        },
        (err) => {
          toastr.error('Unbale to fetch the data. Pease try after sometime');
        }
      );

    if (this.appointment.Report?.ReportID) {
      reportService.getReport(this.appointment.Report?.ReportID).subscribe(
        (d) => {
          report = d;
        },
        (err) => {
          toastr.error('Unbale to fetch the data. Pease try after sometime');
        }
      );
    }

    doc.text('sfsad', 10, 10);
    doc.save(`report(appointmentID:${this.appointment.AppointmentID})`);
  }
}
