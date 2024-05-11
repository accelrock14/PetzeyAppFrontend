import { HttpClient } from '@angular/common/http';
import { Injectable, InjectionToken } from '@angular/core';
import { Observable, retry } from 'rxjs';
import { IReport } from '../../models/appoitment-models/Report';
import { Test } from '../../models/appoitment-models/Test';
import { Symptom } from '../../models/appoitment-models/Symptom';
import { PrescribedMedicine } from '../../models/appoitment-models/PrescribedMedicine';
import { Medicine } from '../../models/appoitment-models/Medicine';
import { appointmentServiceUrl } from '../../Shared/apiUrls';
import { PetAppointmentHistoryDTO } from '../../models/appoitment-models/PetAppointmentHistoryDTO';

export interface IReportService {
  getReport(reportID: number): Observable<IReport>;
  getAllSymptoms(): Observable<Symptom[]>;
  getAllTests(): Observable<Test[]>;
  getAllMedicines(): Observable<Medicine[]>;
  getPetAppointmentHistory(PetID: number): Observable<PetAppointmentHistoryDTO>;
  patchReport(id: number, report: IReport): Observable<any>;
  UpdatePrescription(
    id: number,
    PrescribedMedicine: PrescribedMedicine
  ): Observable<any>;
  AddPrescription(
    prescriptionID: number,
    prescription: PrescribedMedicine
  ): Observable<any>;
  DeletePrescription(prescribedMedicineID: number): Observable<any>;
}

export let reportToken = new InjectionToken<IReportService>('IReportToken');

@Injectable({
  providedIn: 'root',
})
export class ReportService implements IReportService {
  constructor(private http: HttpClient) {}

  reportURL: string = appointmentServiceUrl + 'api/appointment/';

  getReport(reportID: number): Observable<IReport> {
    return this.http.get<IReport>(this.reportURL + 'report/' + reportID);
  }

  getAllSymptoms(): Observable<Symptom[]> {
    return this.http.get<Symptom[]>(this.reportURL + 'symptoms');
  }
  getAllTests(): Observable<Test[]> {
    return this.http.get<Test[]>(this.reportURL + 'tests');
  }
  getAllMedicines(): Observable<Medicine[]> {
    return this.http.get<Medicine[]>(this.reportURL + 'medicines');
  }

  getPetAppointmentHistory(
    PetID: number
  ): Observable<PetAppointmentHistoryDTO> {
    return this.http.get<PetAppointmentHistoryDTO>(
      this.reportURL + 'appointmenthistory/' + PetID
    );
  }

  patchReport(id: number, report: IReport) {
    return this.http.patch(this.reportURL + 'report/' + id, report);
  }
  UpdatePrescription(id: number, PrescribedMedicine: PrescribedMedicine) {
    return this.http.patch(
      this.reportURL + 'prescription/' + id,
      PrescribedMedicine
    );
  }
  AddPrescription(prescriptionID: number, prescription: PrescribedMedicine) {
    return this.http.post(
      this.reportURL + 'prescription/' + prescriptionID,
      prescription
    );
  }
  DeletePrescription(prescribedMedicineID: number) {
    return this.http.delete(
      this.reportURL + 'prescription/' + prescribedMedicineID
    );
  }
}
