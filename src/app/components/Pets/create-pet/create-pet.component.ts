import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PetsService } from '../../../services/PetsServices/pets.service';
import { IPet } from '../../../models/Pets/IPet';
import { FormsModule } from '@angular/forms';
import { flush } from '@angular/core/testing';

@Component({
  selector: 'app-create-pet',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './create-pet.component.html',
  styleUrl: './create-pet.component.css',
})
export class CreatePetComponent {
  handleFile(file:File) {
    if (file) {
      this.convertToBinary(file);
    }
  }
  convertToUint8Array(binaryString: string): Uint8Array {
    const length = binaryString.length;
    const uintArray = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
      uintArray[i] = binaryString.charCodeAt(i);
    }
    return uintArray;
  }
  convertToBinary(file: File): void {
    const reader = new FileReader();
    reader.onload = () => {
      const binaryString: string = reader.result as string;
      this.NewPet.PetImage = this.convertToUint8Array(binaryString);
      console.log(this.NewPet.PetImage);
    };
  }
  CreateNewPet() {
    if(this.tempFile){
      alert("bleh");
      this.handleFile(this.tempFile)
    }
      
     
    if (this.NewPet) {
      this.petsService.AddPet(this.NewPet).subscribe();
    }
  }
  constructor(
    private activatedRoute: ActivatedRoute,
    private petsService: PetsService
  ) {}

  NewPet: IPet = {
    PetID: 0,
    PetParentId: 0,
    PetName: '',
    PetImage: new Uint8Array(0),
    Species: '',
    Breed: '',
    BloodGroup: '',
    Gender: '',
    DateOfBirth: new Date(),
    Allergies: '',
    LastAppointmentdate: new Date(),
  };
  tempFile?:File;
}
