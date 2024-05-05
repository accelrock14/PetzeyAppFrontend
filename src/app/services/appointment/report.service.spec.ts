import { TestBed } from '@angular/core/testing';

import { ReportService } from './report.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Medicine } from '../../models/appoitment-models/Medicine';
import { Symptom } from '../../models/appoitment-models/Symptom';
import { Test } from '../../models/appoitment-models/Test';
import { IReport } from '../../models/appoitment-models/Report';
import { PrescribedMedicine } from '../../models/appoitment-models/PrescribedMedicine';
import { ReportHistoryDTO } from '../../models/appoitment-models/ReportHistoryDTO';

describe('ReportService', () => {
  let service: ReportService;
  let httpMock: HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ReportService]
    });
    service = TestBed.inject(ReportService);
    httpMock = TestBed.inject(HttpTestingController)
  });
  afterEach(() => {
    httpMock.verify()
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all medicines', () => {
    let mockMedicine: Medicine[] = [
      {
        MedicineID: 1,
        MedicineName: 'Vitamine D'
      },
      {
        MedicineID: 2,
        MedicineName: 'Crocine'
      }
    ]

    service.getAllMedicines().subscribe(med => {
      expect(med.length).toBe(2);
      expect(med).toEqual(mockMedicine);
    });

    const apirul = httpMock.expectOne('https://petzeybackendappointmentapi20240502214622.azurewebsites.net/api/appointment/medicines');
    expect(apirul.request.method).toBe('GET');
    apirul.flush(mockMedicine);
  })

  it('should get all symptoms', () => {
    let mockSymptom: Symptom[] = [
      {
        SymptomID: 1,
        SymptomName: 'Vomiting'
      },
      {
        SymptomID: 2,
        SymptomName: 'Fainting'
      }
    ]

    service.getAllSymptoms().subscribe(sym => {
      expect(sym.length).toBe(2);
      expect(sym).toEqual(mockSymptom);
    });

    const apirul = httpMock.expectOne('https://petzeybackendappointmentapi20240502214622.azurewebsites.net/api/appointment/symptoms');
    expect(apirul.request.method).toBe('GET');
    apirul.flush(mockSymptom);
  })

  it('should get all tests', () => {
    let mockTest: Test[] = [
      {
        TestID: 1,
        TestName: 'ECG'
      },
      {
        TestID: 2,
        TestName: 'Cardio'
      }
    ]

    service.getAllTests().subscribe(test => {
      expect(test.length).toBe(2);
      expect(test).toEqual(mockTest);
    });

    const apirul = httpMock.expectOne('https://petzeybackendappointmentapi20240502214622.azurewebsites.net/api/appointment/tests');
    expect(apirul.request.method).toBe('GET');
    apirul.flush(mockTest);
  })

  it('should get report details', () => {
    let mockReport: IReport = {
      ReportID: 1,
      Prescription: {
        PrescriptionID: 1,
        PrescribedMedicines: []
      },
      Symptoms: [],
      Tests: [],
      HeartRate: 90,
      Temperature: 80,
      OxygenLevel: 70,
      RecommendedDoctors: [],
      Comment: 'none'
    }

    service.getReport(1).subscribe(report => {
      expect(report).toEqual(mockReport);
    })

    const apiurl = httpMock.expectOne('https://petzeybackendappointmentapi20240502214622.azurewebsites.net/api/appointment/report/1');
    expect(apiurl.request.method).toBe('GET');
    apiurl.flush(mockReport);
  })

  it('should post a new prescription', () => {
    let mockPrecription: PrescribedMedicine = {
      PrescribedMedicineID: 1,
      MedicineID: 0,
      Medicine: null,
      NumberOfDays: 0,
      Consume: false,
      Dosages: 0,
      Comment: ''
    }

    service.AddPrescription(1, mockPrecription).subscribe(pres => {
      expect(pres).toEqual(1);
    })

    const apiurl = httpMock.expectOne('https://petzeybackendappointmentapi20240502214622.azurewebsites.net/api/appointment/prescription/1');
    expect(apiurl.request.method).toBe('POST');
    expect(apiurl.request.body).toBe(mockPrecription)
    apiurl.flush(1);
  })

  it('should patch an existing prescription', () => {
    let mockPrecription: PrescribedMedicine = {
      PrescribedMedicineID: 1,
      MedicineID: 0,
      Medicine: null,
      NumberOfDays: 0,
      Consume: false,
      Dosages: 0,
      Comment: ''
    }

    service.UpdatePrescription(1, mockPrecription).subscribe(pres => {
      expect(pres).toEqual(mockPrecription);
    })

    const apiurl = httpMock.expectOne('https://petzeybackendappointmentapi20240502214622.azurewebsites.net/api/appointment/prescription/1');
    expect(apiurl.request.method).toBe('PATCH');
    expect(apiurl.request.body).toBe(mockPrecription)
    apiurl.flush(mockPrecription);
  })

  it('should delete an existing prescription', () => {
    service.DeletePrescription(1).subscribe(pres => {
      expect(pres).toEqual("prescription deleted successfully");
    })

    const apiurl = httpMock.expectOne('https://petzeybackendappointmentapi20240502214622.azurewebsites.net/api/appointment/prescription/1');
    expect(apiurl.request.method).toBe('DELETE');
    apiurl.flush("prescription deleted successfully");
  })

  it('should patch existing report details', () => {
    let mockReport: IReport = {
      ReportID: 1,
      Prescription: {
        PrescriptionID: 1,
        PrescribedMedicines: []
      },
      Symptoms: [],
      Tests: [],
      HeartRate: 90,
      Temperature: 80,
      OxygenLevel: 70,
      RecommendedDoctors: [],
      Comment: 'none'
    }

    service.patchReport(1, mockReport).subscribe(report => {
      expect(report).toEqual(mockReport);
    })

    const apiurl = httpMock.expectOne('https://petzeybackendappointmentapi20240502214622.azurewebsites.net/api/appointment/report/1');
    expect(apiurl.request.method).toBe('PATCH');
    expect(apiurl.request.body).toBe(mockReport)
    apiurl.flush(mockReport);
  })

  it('should get pet report history details', () => {
    let mockReport: ReportHistoryDTO = {
      HeartRate: 0,
      Temperature: 0,
      OxygenLevel: 0,
      Tests: [],
      Symptoms: [],
      Prescriptions: [],
      ScheduleDate: []
    }

    service.getPetHistory(1).subscribe(report => {
      expect(report).toEqual(mockReport);
    })

    const apiurl = httpMock.expectOne('https://petzeybackendappointmentapi20240502214622.azurewebsites.net/api/appointment/reporthistory/1');
    expect(apiurl.request.method).toBe('GET');
    apiurl.flush(mockReport);
  })
});
