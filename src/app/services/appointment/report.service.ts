import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, retry } from 'rxjs';
import { IReport, Medicine, PrescribedMedicine, Symptom, Test } from '../../models/appoitment-models/Report';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private http: HttpClient) { }

  reportURL: string = "https://localhost:44327/api/appointment/"

  getReport(reportID: number): Observable<IReport> {
    return this.http.get<IReport>(this.reportURL + "report/" + reportID)
  }

  getAllSymptoms(): Observable<Symptom[]> {
    return this.http.get<Symptom[]>(this.reportURL + 'symptoms');
  }
  getAllTests(): Observable<Test[]> {
    return this.http.get<Test[]>(this.reportURL + 'tests');
  }
  getAllMedicines(): Observable<Medicine[]> {
    return this.http.get<Medicine[]>(this.reportURL + "medicines")
  }

  patchReport(id: number, report: IReport) {
    return this.http.patch(this.reportURL + "report/" + id, report)
  }
  UpdatePrescription(report: IReport) {
    return this.http.put(this.reportURL + "report", report)
  }
  AddPrescription(prescriptionID: number, prescription: PrescribedMedicine) {
    return this.http.post(this.reportURL + "prescription/" + prescriptionID, prescription)
  }
  DeletePrescription(prescribedMedicineID: number) {
    return this.http.delete(this.reportURL + "prescription/" + prescribedMedicineID)
  }
}
