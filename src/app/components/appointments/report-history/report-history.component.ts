import { Component, Input, OnInit } from '@angular/core';
import { ReportHistoryDTO } from '../../../models/appoitment-models/ReportHistoryDTO';
import { ReportService } from '../../../services/appointment/report.service';
import { DatePipe } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-report-history',
  standalone: true,
  imports: [DatePipe, MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatInputModule, FormsModule],
  templateUrl: './report-history.component.html',
  styleUrl: './report-history.component.css'
})
export class ReportHistoryComponent implements OnInit {

  @Input() petId: number = 1

  selectedDate: Date | undefined

  petHistory: ReportHistoryDTO = {
    HeartRate: 0,
    Temperature: 0,
    OxygenLevel: 0,
    Tests: [],
    Symptoms: [],
    Prescriptions: [],
    ScheduleDate: []
  }
  existingPrescriptions: any[] = []

  constructor(private reportService: ReportService) { }

  ngOnInit(): void {
    console.log(this.petId)
    this.reportService.getPetHistory(this.petId).subscribe(h => {
      this.petHistory = h
      this.existingPrescriptions = this.petHistory.Prescriptions
    })
  }

  onDateChange() {
    this.petHistory.Prescriptions = []
    for (let index = 0; index < this.petHistory.ScheduleDate.length; index++) {
      let curDate: Date = new Date(this.petHistory.ScheduleDate[index])
      if (curDate.toDateString() == this.selectedDate?.toDateString()) {
        this.petHistory.Prescriptions.push(this.existingPrescriptions[index])
      }
    }
  }
}
