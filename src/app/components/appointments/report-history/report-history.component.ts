import { Component, OnInit } from '@angular/core';
import { ReportHistoryDTO } from '../../../models/appoitment-models/ReportHistoryDTO';
import { ReportService } from '../../../services/appointment/report.service';

@Component({
  selector: 'app-report-history',
  standalone: true,
  imports: [],
  templateUrl: './report-history.component.html',
  styleUrl: './report-history.component.css'
})
export class ReportHistoryComponent implements OnInit {
  petHistory: ReportHistoryDTO = {
    HeartRate: 0,
    Temperature: 0,
    OxygenLevel: 0,
    Tests: [],
    Symptoms: [],
    Prescriptions: []
  }

  constructor(private reportService: ReportService) { }

  ngOnInit(): void {
    this.reportService.getPetHistory(1).subscribe(h => {
      this.petHistory = h
    })
  }

}
