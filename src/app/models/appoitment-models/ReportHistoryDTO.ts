import { Prescription } from "./Prescription"
import { ReportSymptom } from "./ReportSymptom"
import { ReportTest } from "./ReportTest"

export interface ReportHistoryDTO {
    HeartRate: number
    Temperature: number
    OxygenLevel: number
    Tests: ReportTest[]
    Symptoms: ReportSymptom[]
    Prescriptions: Prescription[]
    ScheduleDate: Date[]
}