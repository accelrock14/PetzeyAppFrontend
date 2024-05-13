import { Prescription } from "./Prescription"
import { RecommendedDoctor } from "./RecommendedDoctor"
import { ReportSymptom } from "./ReportSymptom"
import { ReportTest } from "./ReportTest"

export interface IReport {
    ReportID: number
    Prescription: Prescription
    Symptoms: ReportSymptom[]
    Tests: ReportTest[]
    RecommendedDoctors: RecommendedDoctor[]
    Comment: string
}