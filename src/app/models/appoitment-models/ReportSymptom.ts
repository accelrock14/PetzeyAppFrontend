import { Symptom } from "./Symptom";


export interface ReportSymptom {
    ReportSymptomID: number;
    SymptomID: number;
    Symptom: Symptom | null;
}
