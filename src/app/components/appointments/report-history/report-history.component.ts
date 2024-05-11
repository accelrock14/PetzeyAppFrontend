import { Component, Input, OnInit } from '@angular/core';
import { ReportService } from '../../../services/appointment/report.service';
import { DatePipe } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { RouterLink } from '@angular/router';
import { PetAppointmentHistoryDTO } from '../../../models/appoitment-models/PetAppointmentHistoryDTO';

@Component({
  selector: 'app-report-history',
  standalone: true,
  imports: [
    DatePipe,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    RouterLink,
  ],
  templateUrl: './report-history.component.html',
  styleUrl: './report-history.component.css',
})
export class ReportHistoryComponent implements OnInit {
  // pass the petID to get the pet's report history
  @Input() petId: number = 1;

  selectedDate: Date | undefined;

  petAppointmentHistory: PetAppointmentHistoryDTO = {
    AppointmentID: 0,
    DoctorID: '',
    ReasonOfAppointment: '',
    ScheduleDate: new Date(),
  };
  existingPrescriptions: any[] = [];

  constructor(
    private reportService: ReportService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    console.log(this.petId);
    this.reportService.getPetAppointmentHistory(this.petId).subscribe(
      (h) => {
        this.petAppointmentHistory = h;
      },
      (error) => {
        this.toastr.error('Could not fetch data. Plese come after sometime');
      }
    );
  }

  // filter the report history based on selected date
  onDateChange() {}
}
