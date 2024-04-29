export interface Medicine {
    medicineID: number
    medicineName: string
}

export interface PrescribedMedicine {
    prescribedMedicineID: number
    medicineID: number
    medicine: Medicine
    numberOfDays: number
    consume: boolean
    dosages: number
    comment: string
}

export interface Prescription {
    prescriptionID: number
    prescribedMedicines: PrescribedMedicine[]
}

export interface Symptom {
    symptomID: number
    symptomName: string
}

export interface ReportSymptom {
    reportSymptomID: number
    symptomID: number
    symptom: Symptom
}

export interface Test {
    testID: number
    testName: string
}

export interface ReportTest {
    reportTestID: number
    testID: number
    test: Test
}

export interface RecommendedDoctor {
    ID: number
    doctorID: number
}

export interface Report {
    reportID: number
    prescription: Prescription
    symptoms: ReportSymptom[]
    tests: ReportTest[]
    heartRate: number
    temperature: number
    oxygenLevel: number
    recommendedDoctors: RecommendedDoctor[]
    comment: string
}