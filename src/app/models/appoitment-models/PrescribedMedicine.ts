import { Medicine } from "./Medicine";


export interface PrescribedMedicine {
    PrescribedMedicineID: number;
    MedicineID: number;
    Medicine: Medicine;
    NumberOfDays: number;
    Consume: boolean;
    Dosages: number;
    Comment: string;
}
