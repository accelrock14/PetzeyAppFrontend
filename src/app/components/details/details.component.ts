import { PetsService } from './../../services/PetsServices/pets.service';
import {
  Component,
  ElementRef,
  NgModule,
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

import { Cancellation } from '../../models/Cancellation';
import { NgModel } from '@angular/forms';
import { FormsModule } from '@angular/forms';

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
    FormsModule,
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
  cancellation: Cancellation = {
    CancellationId: 0,
    AppointmentID: 0,
    Reason_for_cancellation: '',
  };
  //Modal 1 for close appointment
  formModal: any;
  //Modal 2 for cancel appointment
  formModal2: any;
  //Modlal 3 for accept appointment
  formModal3: any;
  // For testing the get recent pet id endpoint
  petIds: number[] = [1, 3, 2];
  recentPetIds: number[] = [];

  constructor(
    private appointmentDetailsService: AppointmentDetailsService,
    private route: ActivatedRoute,
    private prtSetvice: PetsService,
    private authService: AuthService,
    private vetService: VetsserviceService,
    private router: Router,
    private reportService: ReportService,
    private petService: PetsService,
    private toastr: ToastrService
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

  Reason_for_Cancellation_By_Doc: string = '';
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

        if (this.appointment.Status == 2) {
          this.appointmentDetailsService
            .GetCancellationReason(parseInt(ID))
            .subscribe((cancel: any) => {
              this.cancellation = cancel;
            });
          console.log(
            'cancelling ' + this.cancellation.Reason_for_cancellation
          );
        }

        // this.appointmentDetailsService.PostRecentPetIds(this.petIds)
        // .subscribe(data => {
        //   this.recentPetIds = data;
        //   console.log(this.recentPetIds)
        // });
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
      .PatchAppointmentStatus(this.appointment.AppointmentID,false, 3)
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
      .PatchAppointmentStatus(this.appointment.AppointmentID, false,2)
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
          if (!this.isPatient()) {
            this.cancellation.Reason_for_cancellation =
              this.Reason_for_Cancellation_By_Doc;
            this.cancellation.AppointmentID = this.appointment.AppointmentID;
            this.appointmentDetailsService
              .PostCancellationReason(this.cancellation)
              .subscribe();
          }
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
      .PatchAppointmentStatus(this.appointment.AppointmentID, false,1)
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
  // GenerateNewReport() {
  //   this.appointmentDetailsService
  //   .PatchAppointmentStatus(this.appointment.AppointmentID, true,1)
  //   .subscribe(
  //     (response) => {
  //       this.appointmentDetailsService
  //           .GetAppointmentDetail(this.appointment.AppointmentID)
  //           .subscribe(
  //             (updatedAppointment) => (this.appointment = updatedAppointment)
  //           );
  //     },
  //     (error) => {
  //       console.log('error while generating report');
  //     }
  //   );
  // }
  GenerateNewReport() {
    this.appointmentDetailsService
      .PatchAppointmentStatus(this.appointment.AppointmentID, true, 1)
      .subscribe(
        () => {
          // Introduce a short delay to ensure backend processing is complete
          
            this.appointmentDetailsService
              .GetAppointmentDetail(this.appointment.AppointmentID)
              .subscribe(
                (updatedAppointment) => {
                  this.appointment = updatedAppointment;
                },
                (error) => {
                  console.log('Error while fetching updated appointment details:', error);
                }
              );
             window.location.reload();
        },
        (error) => {
          console.log('Error while generating report:', error);
        }
      );
  }


  // Method to generate & download the pdf

  async exportToPDF() {
    let report!: IReport;
    let pet!: IPet;
    let vet!: IVetProfileDTO;
    let allVets: IVetProfileDTO[] = [];

    this.petService.GetPetDetailsByID(this.appointment.PetID).subscribe(
      (p) => {
        pet = p;

        if (this.appointment.Report?.ReportID) {
          this.reportService
            .getReport(this.appointment.Report?.ReportID)
            .subscribe(
              (d) => {
                report = d;

                for (let i = 0; i < report.RecommendedDoctors.length; i++) {
                  this.vetService
                    .getVetById(parseInt(report.RecommendedDoctors[i].DoctorID))
                    .subscribe((d) => {
                      allVets.push(d);
                    });
                }

                this.vetService
                  .getVetById(parseInt(this.appointment.DoctorID) as number)
                  .subscribe(
                    (v) => {
                      vet = v;
                      this.cretePDFdata(pet, vet, report, allVets);
                    },
                    (err) => {
                      this.toastr.error(
                        'Unbale to fetch the data. Please try after sometime'
                      );
                    }
                  );
              },
              (err) => {
                this.toastr.error(
                  'Unbale to fetch the data. Please try after sometime'
                );
              }
            );
        }
      },
      (err) => {
        this.toastr.error(
          'Unbale to fetch the data. Please try after sometime'
        );
      }
    );
  }

  getDosage(Dosages: number) {
    if (Dosages === 0) {
      return 'Morning';
    } else if (Dosages === 1) {
      return 'Afternoon';
    } else if (Dosages === 2) {
      return 'Night';
    } else if (Dosages === 3) {
      return 'Morning, Afternoon';
    } else if (Dosages === 4) {
      return 'Morning, Night';
    } else if (Dosages === 5) {
      return 'Afternoon, Night';
    } else if (Dosages === 6) {
      return 'Morning, Afternoon, Night';
    } else {
      return 'Invalid dosage number'; // Handle invalid dosage numbers
    }
  }

  cretePDFdata(
    pet: IPet,
    vet: IVetProfileDTO,
    report: IReport,
    allVets: IVetProfileDTO[]
  ) {
    let doc = new jsPDF();
    doc.text('Report', 100, 10);
    doc.line(100, 12, 118, 12);

    doc.setFontSize(10);

    // appointment details
    doc.text(`AppointmentID:- #${this.appointment.AppointmentID}`, 10, 20);
    doc.text(
      `Date:- ${new Date(this.appointment.ScheduleDate).toDateString()}`,
      138,
      20
    );
    if (
      this.appointment.ReasonForVisit == null ||
      this.appointment.ReasonForVisit == ''
    ) {
      doc.text(`Reason:- (not mentioned)`, 10, 24);
    } else {
      doc.text(`Reason:- ${this.appointment.ReasonForVisit}`, 10, 24);
    }
    doc.text(
      `Time:- ${new Date(this.appointment.ScheduleDate).toLocaleTimeString()}`,
      138,
      24
    );
    doc.line(10, 26, 203, 26);

    // pet details
    doc.setFontSize(14);
    doc.text('Pet details:-', 10, 34);
    doc.setFontSize(10);
    doc.text(`Name: ${pet.PetName}`, 15, 40);
    doc.text(`Gender: ${pet.Gender}`, 15, 44);
    doc.text(`Species & Breed: ${pet.Species}, ${pet.Breed}`, 15, 48);
    doc.text(`Blood group: ${pet.BloodGroup}`, 15, 52);

    // vet details
    doc.setFontSize(14);
    doc.text('Vet details:-', 110, 34);
    doc.setFontSize(10);
    doc.text(`Name: ${vet.FName + ' ' + vet.LName}`, 115, 40);
    doc.text(`Specility: ${vet.Speciality}`, 115, 44);
    doc.text(`Email: ${vet.Email}`, 115, 48);
    doc.text(`Ph no.: ${vet.Phone}`, 115, 52);

    let y = 52;
    // Prescribed Medicine
    doc.setFontSize(14);
    y += 14;
    doc.text('Prescribed Medicines:-', 10, y);
    doc.setFontSize(10);
    y += 6;
    let PrescribedMedicines = report.Prescription.PrescribedMedicines;
    for (let i = 0; i < PrescribedMedicines.length; i++) {
      doc.text(
        `${i + 1}. ${PrescribedMedicines[i].Medicine?.MedicineName} \t Days: ${
          PrescribedMedicines[i].NumberOfDays
        } \t Consume: ${
          PrescribedMedicines[i].Consume == true ? 'Before food' : 'After food'
        } \t Dosage: ${this.getDosage(PrescribedMedicines[i].Dosages)}`,
        15,
        y
      );
      y += 4;
      doc.text(`Comment: ${PrescribedMedicines[i].Comment}`, 19, y);
      y += 8;
    }
    if (PrescribedMedicines.length == 0) {
      doc.text('-- No Medicines Prescribed --', 15, y);
      y += 8;
    }

    //Tests
    doc.setFontSize(14);
    y += 6;
    doc.text('Tests:-', 10, y);
    let tests = report.Tests.map((t) => t.Test?.TestName);

    doc.setFontSize(10);
    let testLine = tests.join(', ');
    y += 6;
    if (report.Tests.length == 0) {
      doc.text('-- No Tests --', 15, y);
    } else {
      doc.text(testLine, 15, y);
    }

    // Symptoms
    doc.setFontSize(14);
    y += 14;
    doc.text('Symptoms:-', 10, y);
    let symptoms = report.Symptoms.map((s) => s.Symptom?.SymptomName);

    doc.setFontSize(10);
    let symptomsLine = symptoms.join(', ');
    y += 6;
    if (report.Symptoms.length == 0) {
      doc.text('-- No Symptoms --', 15, y);
    } else {
      doc.text(symptomsLine, 15, y);
    }

    // Recommended doctors
    doc.setFontSize(14);
    y += 14;
    doc.text('Recommended doctors:-', 10, y);
    doc.setFontSize(10);
    y += 6;

    for (let i = 0; i < allVets.length; i++) {
      doc.text(
        `${i + 1}. ${
          allVets[i]?.FName +
          ' ' +
          allVets[i]?.LName +
          ' (' +
          allVets[i]?.Speciality +
          ')'
        } \t ${allVets[i]?.Email} \t ${allVets[i]?.Phone}`,
        15,
        y
      );
      y += 4;
      doc.text(`Reason: ${report.RecommendedDoctors[i].Reason}`, 19, y);
      y += 8;
    }
    if (report.RecommendedDoctors.length == 0) {
      doc.text('-- No Doctors Recommended  --', 15, y);
      y += 8;
    }

    // Comment
    doc.setFontSize(14);
    y += 6;
    doc.text('Other Comments:-', 10, y);
    doc.setFontSize(10);
    y += 6;
    if (report.Comment == '' || report.Comment == null) {
      doc.text('-- No Comments Given --', 15, y);
    } else {
      doc.text(report.Comment, 15, y);
    }

    doc.save(`report(appointmentID:${this.appointment.AppointmentID})`);
  }
}
