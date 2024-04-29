export interface Medicine {
    MedicineID: number
    MedicineName: string
}

export interface PrescribedMedicine {
    PrescribedMedicineID: number
    MedicineID: number
    Medicine: Medicine
    NumberOfDays: number
    Consume: boolean
    Dosages: number
    Comment: string
}

export interface Prescription {
    PrescriptionID: number
    PrescribedMedicines: PrescribedMedicine[]
}

export interface Symptom {
    SymptomID: number
    SymptomName: string
}

export interface ReportSymptom {
    ReportSymptomID: number
    SymptomID: number
    Symptom: Symptom | null
}

export interface Test {
    TestID: number
    TestName: string
}

export interface ReportTest {
    ReportTestID: number
    TestID: number
    Test: Test | null
}

export interface RecommendedDoctor {
    ID: number
    DoctorID: number
}

export interface IReport {
    ReportID: number
    Prescription: Prescription
    Symptoms: ReportSymptom[]
    Tests: ReportTest[]
    HeartRate: number
    Temperature: number
    OxygenLevel: number
    RecommendedDoctors: RecommendedDoctor[]
    Comment: string
}