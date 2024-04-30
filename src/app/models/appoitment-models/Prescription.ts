import { PrescribedMedicine } from "./PrescribedMedicine";


export interface Prescription {
    PrescriptionID: number;
    PrescribedMedicines: PrescribedMedicine[];
}
