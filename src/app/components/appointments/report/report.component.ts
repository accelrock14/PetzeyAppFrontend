import { CommonModule, NgClass, NgIf } from '@angular/common';
import domtoimage from 'dom-to-image';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  NgModel,
  ReactiveFormsModule,
} from '@angular/forms';
import { IReport } from '../../../models/appoitment-models/Report';
import { ReportTest } from '../../../models/appoitment-models/ReportTest';
import { Test } from '../../../models/appoitment-models/Test';
import { ReportSymptom } from '../../../models/appoitment-models/ReportSymptom';
import { Symptom } from '../../../models/appoitment-models/Symptom';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import {
  ReportService,
  reportToken,
} from '../../../services/appointment/report.service';
import { ListItem } from 'ng-multiselect-dropdown/multiselect.model';
import { PrescribedMedicine } from '../../../models/appoitment-models/PrescribedMedicine';
import { Medicine } from '../../../models/appoitment-models/Medicine';
import {
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { RecommendedDoctor } from '../../../models/appoitment-models/RecommendedDoctor';
import jspdf, { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { VetsserviceService } from '../../../services/VetsServices/vetsservice.service';
import { IVetCardDTO } from '../../../models/Vets/IVetCardDto';
import { AuthService } from '../../../services/UserAuthServices/auth.service';
import { ToastrService } from 'ngx-toastr';
import { error } from 'jquery';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [
    NgIf,
    FormsModule,
    FormsModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule,
    NgClass,
    CommonModule,
    RouterLink,
  ],
  templateUrl: './report.component.html',
  styleUrl: './report.component.css',
})
export class ReportComponent implements OnInit {
  // pass the reportID to get the report details
  @Input() reportId: number = 3;

  // pass the doctorID to get the doctor details
  @Input() doctorId: string = '';

  report: IReport = {
    ReportID: 1,
    Prescription: {
      PrescriptionID: 1,
      PrescribedMedicines: [
        {
          PrescribedMedicineID: 1,
          MedicineID: 1,
          Medicine: {
            MedicineID: 1,
            MedicineName: 'Crocin',
          },
          NumberOfDays: 10,
          Consume: false,
          Dosages: 1,
          Comment: 'dont sadtfy asdiaasdas asdsad asd trtm sssot worter',
        },
        {
          PrescribedMedicineID: 1,
          MedicineID: 1,
          Medicine: {
            MedicineID: 1,
            MedicineName: 'Crocin',
          },
          NumberOfDays: 10,
          Consume: false,
          Dosages: 1,
          Comment: 'dont sadtfy asdiaasdas asdsad asd trtm sssot worter',
        },
      ],
    },
    Symptoms: [
      {
        SymptomID: 1,
        Symptom: {
          SymptomID: 1,
          SymptomName: 'Stress',
        },
        ReportSymptomID: 1,
      },
      {
        SymptomID: 2,
        Symptom: {
          SymptomID: 2,
          SymptomName: 'ECG',
        },
        ReportSymptomID: 2,
      },
    ],
    Tests: [
      {
        ReportTestID: 1,
        Test: {
          TestID: 1,
          TestName: 'ECG',
        },
        TestID: 1,
      },
      {
        ReportTestID: 2,
        Test: {
          TestID: 2,
          TestName: 'Excercise Stress Test',
        },
        TestID: 2,
      },
    ],
    RecommendedDoctors: [],
    Comment: 'Patient has IBS. Food intake needs to me monitored',
  };
  prescriptionForm = {
    prescribedMedicineID: 0,
    medicine: 0,
    days: 0,
    consume: '',
    dosage: [false, false, false],
    comment: '',
  };
  recommendation: RecommendedDoctor = {
    ID: 0,
    DoctorID: '',
    Reason: ''
  }
  myForm!: FormGroup;
  ShowFilter = true;
  limitSelection = false;
  symptoms: Symptom[] = [];
  tests: Test[] = [];
  medicines: Medicine[] = [];
  doctors: IVetCardDTO[] = [];
  selectedSymptoms: any[] = [];
  selectedTests: any[] = [];
  selectedDoctors: any[] = [];
  symptomSettings: any = {};
  testSettings: any = {};
  medicineSettings: any = {};
  doctorSettings: any = {};
  deletePrescribedMedicineID: number = 0;
  deleteRecommendationID: number = 0;
  isDoctor: boolean = true;
  isEditing = false;
  doctor!: IVetCardDTO;

  ngOnInit(): void {
    // get report details from report service and set the data in variable
    this.reportService.getReport(this.reportId).subscribe((r) => {
      this.report = r;

      this.configureForms();

      this.getAllMasterDataForForms();

      // get list of existing symptoms, tests and doctors in the report
      this.selectedSymptoms = this.report.Symptoms.map((s) => s.Symptom);
      this.selectedTests = this.report.Tests.map((r) => r.Test);

      // check if the user is a doctor
      this.isDoctor = this.authService.getRoleFromToken() == 'Doctor';
    });
  }

  constructor(
    private fb: FormBuilder,
    private reportService: ReportService,
    private elementRef: ElementRef,
    private vetService: VetsserviceService,
    private authService: AuthService,
    private toastr: ToastrService
  ) { }

  enableEdit(): void {
    this.isEditing = true;
  }

  save(): void {
    this.isEditing = false;
    // update report data on clicking save button
    this.reportService.patchReport(this.reportId, this.report).subscribe(
      (p) => {
        console.log(p);
        this.toastr.success('Data saved successfully');
      },
      (error) => {
        this.toastr.error(
          'Could not save the data, Please try after some time'
        );
      }
    );
  }

  onSelectSymptom(symptom: ListItem) {
    let newSymptom: Symptom = symptom as unknown as Symptom;
    var reportSymptom: ReportSymptom = {
      SymptomID: newSymptom.SymptomID,
      ReportSymptomID: 1,
      Symptom: null,
    };
    // add selected symptom to report object
    this.report.Symptoms.push(reportSymptom);
  }
  onDeselectSymptom(symptom: ListItem) {
    let newSymptom: Symptom = symptom as unknown as Symptom;
    let index: number = this.report.Symptoms.findIndex(
      (s) => s.SymptomID == newSymptom.SymptomID
    );
    // remove the symptom from report object
    this.report.Symptoms.splice(index, 1);
  }

  onSelectTest(test: ListItem) {
    let newTest: Test = test as unknown as Test;
    var reportTest: ReportTest = {
      TestID: newTest.TestID,
      ReportTestID: 1,
      Test: null,
    };
    // add selected test to report object
    this.report.Tests.push(reportTest);
  }
  onDeselectTest(test: ListItem) {
    let newTest: Test = test as unknown as Test;
    let index: number = this.report.Tests.findIndex(
      (t) => t.TestID == newTest.TestID
    );
    // remove the test from report object
    this.report.Tests.splice(index, 1);
  }



  getSymptomById(id: number): Symptom | undefined {
    return this.symptoms.find((s) => {
      if (s.SymptomID != null && s.SymptomID == id) {
        return s;
      } else {
        return undefined;
      }
    });
  }
  getTestById(id: number): Test | undefined {
    return this.tests.find((t) => {
      if (t.TestID != null && t.TestID == id) {
        return t;
      } else {
        return undefined;
      }
    });
  }

  getMedicineById(id: number): Medicine | undefined {
    return this.medicines.find((m) => {
      if (m.MedicineID != null && m.MedicineID == id) {
        return m;
      } else {
        return undefined;
      }
    });
  }

  getDoctorById(id: string): IVetCardDTO | undefined {
    return this.doctors.find((d) => {
      if (d.VetId.toString() == id) {
        return d;
      } else return undefined;
    });
  }

  validateNumber(event: KeyboardEvent): void {
    const key = event.key;
    // Allow only numbers and backspace
    if (!(key >= '0' && key <= '9') && key !== 'Backspace') {
      event.preventDefault();
    }
  }

  setDeleteMedicineID(prescribedMedicineID: number) {
    // set the id of prescribed medicine to be deleted
    this.deletePrescribedMedicineID = prescribedMedicineID;
  }

  setDeleteRecommendation(recommendationID: number) {
    this.deleteRecommendationID = recommendationID
  }

  // delete the selected prescribed medicine
  confirmDeleteMedicine() {
    this.reportService
      .DeletePrescription(this.deletePrescribedMedicineID)
      .subscribe((p) => {
        this.reportService.getReport(this.reportId).subscribe((r) => {
          this.report = r;
          this.toastr.success('Medicine removed successfully');
        });
      });
  }

  confirmDeleteRecommendation() {
    // api service to delete recommendation
    this.reportService.DeleteRecommendation(this.deleteRecommendationID)
      .subscribe((d) => {
        this.reportService.getReport(this.reportId).subscribe((r) => {
          this.report = r;
          this.toastr.success('Recommendation removed successfully');
        });
      });
  }

  activatePrescriptionModal(id: number) {
    this.myForm.get('medicine')?.reset();
    // reset the form if new medicine button was clicked
    if (id == 0) {
      this.prescriptionForm.prescribedMedicineID = 0;
      this.prescriptionForm.medicine = 0;
      this.prescriptionForm.days = 0;
      this.prescriptionForm.dosage = [false, false, false];
      this.prescriptionForm.consume = '';
      this.prescriptionForm.comment = '';
    } else {
      // get the details of prescribed medicine selected
      let prescribedMedicine: PrescribedMedicine | undefined =
        this.report.Prescription.PrescribedMedicines.find(
          (p) => p.PrescribedMedicineID == id
        );
      //update the form values
      if (prescribedMedicine != undefined) {
        this.prescriptionForm.prescribedMedicineID =
          prescribedMedicine?.PrescribedMedicineID;
        this.prescriptionForm.medicine = prescribedMedicine.MedicineID;
        this.prescriptionForm.days = prescribedMedicine.NumberOfDays;
        this.prescriptionForm.dosage = [false, false, false];
        this.myForm
          .get('medicine')
          ?.setValue([this.getMedicineById(prescribedMedicine.MedicineID)]);
        //morning
        if (
          prescribedMedicine.Dosages == 0 ||
          prescribedMedicine.Dosages == 3 ||
          prescribedMedicine.Dosages == 4 ||
          prescribedMedicine.Dosages == 6
        ) {
          this.prescriptionForm.dosage[0] = true;
        }
        //  afternoon
        if (
          prescribedMedicine.Dosages == 1 ||
          prescribedMedicine.Dosages == 3 ||
          prescribedMedicine.Dosages == 5 ||
          prescribedMedicine.Dosages == 6
        ) {
          this.prescriptionForm.dosage[1] = true;
        }
        //  night
        if (
          prescribedMedicine.Dosages == 2 ||
          prescribedMedicine.Dosages == 4 ||
          prescribedMedicine.Dosages == 5 ||
          prescribedMedicine.Dosages == 6
        ) {
          this.prescriptionForm.dosage[2] = true;
        }

        if (prescribedMedicine.Consume) {
          this.prescriptionForm.consume = 'before';
        } else {
          this.prescriptionForm.consume = 'after';
        }
        this.prescriptionForm.comment = prescribedMedicine.Comment;
      }
    }
  }

  activateRecommendationModal(id: number) {
    this.myForm.get('doctor')?.reset();
    // reset the form if new medicine button was clicked
    if (id == 0) {
      this.recommendation.DoctorID = '0';
      this.recommendation.ID = 0;
      this.recommendation.Reason = ''
    }
    else {
      // get the details of prescribed medicine selected
      let recommendedDoctor: RecommendedDoctor | undefined =
        this.report.RecommendedDoctors.find(
          (d) => d.ID == id
        );
      //update the form values
      if (recommendedDoctor != undefined) {
        this.recommendation.Reason = recommendedDoctor.Reason
        this.recommendation.DoctorID = recommendedDoctor.DoctorID
        this.recommendation.ID = recommendedDoctor.ID
        this.myForm
          .get('doctor')
          ?.setValue([this.getDoctorById(recommendedDoctor.DoctorID)]);
      }
    }
  }

  updatePrescription() {
    let prescribedMedicine: PrescribedMedicine = {
      PrescribedMedicineID: 0,
      MedicineID: this.prescriptionForm.medicine,
      Medicine: null,
      NumberOfDays: this.prescriptionForm.days,
      Consume: false,
      Dosages: 0,
      Comment: this.prescriptionForm.comment,
    };

    if (this.prescriptionForm.consume == 'before') {
      prescribedMedicine.Consume = true;
    }

    // dosage
    if (this.prescriptionForm.dosage[0]) {
      prescribedMedicine.Dosages = 0;
      if (this.prescriptionForm.dosage[1] && this.prescriptionForm.dosage[2]) {
        prescribedMedicine.Dosages = 6;
      } else if (this.prescriptionForm.dosage[1]) {
        prescribedMedicine.Dosages = 3;
      } else if (this.prescriptionForm.dosage[2]) {
        prescribedMedicine.Dosages = 4;
      }
    } else if (this.prescriptionForm.dosage[1]) {
      prescribedMedicine.Dosages = 1;
      if (this.prescriptionForm.dosage[2]) {
        prescribedMedicine.Dosages = 5;
      }
    } else {
      prescribedMedicine.Dosages = 2;
    }

    // call add prescription service if new medicine is being added
    if (this.prescriptionForm.prescribedMedicineID == 0) {
      this.reportService
        .AddPrescription(
          this.report.Prescription.PrescriptionID,
          prescribedMedicine
        )
        .subscribe(
          (p) => {
            this.toastr.success('Medicine added to Prescription');
            prescribedMedicine.PrescribedMedicineID = parseInt(p.toString());
            this.report.Prescription.PrescribedMedicines.push(
              prescribedMedicine
            );
          },
          (error) => {
            this.toastr.error(
              'Medicine could be added to Prescription, Please try after sometime'
            );
          }
        );
    } else {
      // call update prescription if existing prescribed medicine is being modified
      this.reportService
        .UpdatePrescription(
          this.prescriptionForm.prescribedMedicineID,
          prescribedMedicine
        )
        .subscribe((p) => {
          this.toastr.success('Prescription updated successfully');
          this.reportService.getReport(this.reportId).subscribe(
            (r) => {
              this.report = r;
            },
            (error) => {
              this.toastr.error(
                'Prescription could not be updated, Please try after sometime'
              );
            }
          );
        });
    }
  }

  updateRecommendation() {
    this.reportService.UpdateRecommendation(this.report.ReportID, this.recommendation)
      .subscribe((d) => {
        this.toastr.success('Recommendation updated successfully');
        this.reportService.getReport(this.reportId).subscribe(
          (r) => {
            this.report = r;
          },
          (error) => {
            this.toastr.error(
              'Recommendation could not be updated, Please try after sometime'
            );
          }
        );
      });
  }

  selectMedicine(medicine: ListItem) {
    let selectMed: Medicine = medicine as unknown as Medicine;
    this.prescriptionForm.medicine = selectMed.MedicineID;
  }

  onSelectDoctor(doctor: ListItem) {
    let newDoctor: IVetCardDTO = doctor as unknown as IVetCardDTO;
    this.recommendation.DoctorID = newDoctor.VetId.toString()
  }

  // emit event to download the page as pdf
  @Output() messageEvent = new EventEmitter();

  captureElementAsCanvas(element: any, index: number) {
    return html2canvas(element, {
      scale: window.devicePixelRatio, // Scale for high-density displays
      onclone: function (clonedDoc) {
        // Modify cloned document if needed (e.g., removing scrollbars)
        const clonedElement = clonedDoc.querySelector(
          '.capture-section'
        ) as HTMLElement; // Example: select element by class name
        if (clonedElement && index == 2) {
          // Increase the size (scale) of the cloned element

          clonedElement.style.width = `${clonedElement.offsetWidth * 2}px`; // Adjust width after scaling
          clonedElement.style.height = `${clonedElement.offsetHeight * 1}px`; // Adjust height after scaling
        }
      },
    });
  }

  callToastThenExport() {
    this.toastr.info('Your PDF will be downloaded in sometime. Please wait !');

    this.messageEvent.emit();
  }

  // configure the multiselect form settings
  configureForms() {
    this.symptomSettings = {
      singleSelection: false,
      idField: 'SymptomID',
      textField: 'SymptomName',
      enableCheckAll: false,
      itemsShowLimit: 3,
      allowSearchFilter: this.ShowFilter,
    };
    this.testSettings = {
      singleSelection: false,
      idField: 'TestID',
      textField: 'TestName',
      enableCheckAll: false,
      itemsShowLimit: 3,
      allowSearchFilter: this.ShowFilter,
    };
    this.medicineSettings = {
      singleSelection: true,
      idField: 'MedicineID',
      textField: 'MedicineName',
      enableCheckAll: false,
      itemsShowLimit: 3,
      allowSearchFilter: this.ShowFilter,
    };
    this.doctorSettings = {
      singleSelection: true,
      idField: 'VetId',
      textField: 'Name',
      enableCheckAll: false,
      itemsShowLimit: 3,
      allowSearchFilter: this.ShowFilter,
    };
  }

  getAllMasterDataForForms() {
    // get allsymptoms from service
    this.reportService.getAllSymptoms().subscribe(
      (s) => {
        this.symptoms = s;
      },
      (error) => {
        this.toastr.error(
          'Could not load the Symptoms. Plese visit after some time'
        );
      }
    );

    // get all tests from service
    this.reportService.getAllTests().subscribe(
      (t) => {
        this.tests = t;
      },
      (error) => {
        this.toastr.error(
          'Could not load the Tests. Plese visit after some time'
        );
      }
    );

    // get all medicines from service
    this.reportService.getAllMedicines().subscribe(
      (m) => {
        this.medicines = m;
      },
      (error) => {
        this.toastr.error(
          'Could not load the Medicines. Plese visit after some time'
        );
      }
    );

    // get all vets from vet service
    this.vetService.getAllVets().subscribe(
      (v) => {
        //this.doctors = v;
        v.forEach((doc) => {
          this.doctors.push({
            VetId: doc.VetId,
            Name: doc.Name + ' - ' + doc.Speciality,
            PhoneNumber: doc.PhoneNumber,
            Speciality: doc.Speciality,
            Photo: doc.Photo,
            Status:doc.Status,
            City:doc.City
          });
        });
        this.report.RecommendedDoctors.forEach((doctor) => {
          this.selectedDoctors.push(this.getDoctorById(doctor.DoctorID));
        });

        let index: number = this.doctors.findIndex(
          (d) => d.VetId == parseInt(this.doctorId)
        );
        // remove doctor recommendation from report object
        this.doctor = this.doctors[index];
        this.doctors.splice(index, 1);
        console.log(this.doctors);

        // set the default selected values of the forms
        this.myForm = this.fb.group({
          symptom: [this.selectedSymptoms],
          test: [this.selectedTests],
          medicine: [[]],
          doctor: [this.selectedDoctors],
        });
      },
      (error) => {
        this.toastr.error(
          'Could not load the Vets. Plese visit after some time'
        );
      }
    );
  }
}
