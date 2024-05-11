import { Component, Input, OnInit } from '@angular/core';
import { ReportService } from '../../../services/appointment/report.service';
import { DatePipe } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PetAppointmentHistoryDTO } from '../../../models/appoitment-models/PetAppointmentHistoryDTO';
import { VetsserviceService } from '../../../services/VetsServices/vetsservice.service';
import { IVetCardDTO } from '../../../models/Vets/IVetCardDto';
import { IVetProfileDTO } from '../../../models/Vets/IVetProfileDto';

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
  selectedDate: Date | undefined;
  petAppointmentHistory: PetAppointmentHistoryDTO[] = [];
  filteredAppointmentHistory: PetAppointmentHistoryDTO[] = [];
  doctors: IVetProfileDTO[] = [];
  petId!: string;

  constructor(
    private reportService: ReportService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private vetService: VetsserviceService
  ) {}

  ngOnInit(): void {
    this.petId = this.route.snapshot.paramMap.get('id')!;

    this.reportService.getPetAppointmentHistory(this.petId).subscribe(
      (h) => {
        this.petAppointmentHistory = h;
        this.filteredAppointmentHistory = h;

        for (let appointment of this.petAppointmentHistory) {
          this.vetService
            .getVetById(parseInt(appointment.DoctorID))
            .subscribe((d) => {
              this.doctors.push(d);
            });
        }
      },
      (error) => {
        this.toastr.error('Could not fetch data. Plese come after sometime');
      }
    );
  }

  // filter the report history based on selected date
  onDateChange() {
    this.filteredAppointmentHistory = [];
    for (let index = 0; index < this.petAppointmentHistory.length; index++) {
      let curDate: Date = new Date(
        this.petAppointmentHistory[index].ScheduleDate
      );
      if (curDate.toDateString() == this.selectedDate?.toDateString()) {
        this.filteredAppointmentHistory.push(this.petAppointmentHistory[index]);
      }
    }
  }

  clearDate() {
    this.selectedDate = undefined;
    this.filteredAppointmentHistory = this.petAppointmentHistory;
  }
}
