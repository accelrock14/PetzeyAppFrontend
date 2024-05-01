import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PetsService } from '../../../services/PetsServices/pets.service';
import { IPet } from '../../../models/Pets/IPet';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, JsonPipe } from '@angular/common';

@Component({
  selector: 'app-create-pet',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, JsonPipe, CommonModule],
  templateUrl: './create-pet.component.html',
  styleUrl: './create-pet.component.css'
})
export class CreatePetComponent implements OnInit {
  imageUrl: string | undefined;
  NewPet?: IPet;
  newPetForm: FormGroup;


  constructor(private fb: FormBuilder, private activatedRoute: ActivatedRoute, private petsService: PetsService) {
    this.newPetForm = this.fb.group({
      PetName: [this.NewPet?.PetName],
      Species: [this.NewPet?.Species],
      Breed: [this.NewPet?.Breed],
      BloodGroup: [this.NewPet?.BloodGroup],
      Gender: [this.NewPet?.Gender],
      DateOfBirth: [this.NewPet?.DateOfBirth],
      Neutered: [this.NewPet?.Neutered],
      Allergies: [this.NewPet?.Allergies]
    });
  }
  ngOnInit(): void {
    if (this.NewPet) {
      this.newPetForm.patchValue(this.NewPet);
    }
    if (this.NewPet)
      this.displayImage(this.NewPet?.PetImage)

  }

  onSubmit(): void {
    // Handle form submission
    if (this.newPetForm.valid) {
      // Update ToBeUpdatedPet with form values
      this.NewPet = {
        ...this.NewPet,
        ...this.newPetForm.value
      };
      this.SavePetDetails()
    }
  }
  handleFile(event: any): void {
    const files: FileList = event.target.files;
    if (files && files.length > 0) {
      const file: File = files[0];
      this.convertImageToBase64(file);
    }
  }
  convertImageToBase64(file: File): void {
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64String: string | null = e.target?.result as string;
      if (base64String) {
        // Store the base64String in your object or send it to the backend
        this.NewPet!.PetImage = base64String;
        this.displayImage(base64String);
      }
    };
    reader.readAsDataURL(file);
  }
  displayImage(base64String: string): void {
    this.imageUrl = base64String;
    console.log(this.imageUrl);
  }
  SavePetDetails() {
    console.log(this.NewPet)
    this.petsService.AddPet(this.NewPet!).subscribe({
      next: updatedPet => {
        // Handle success, if needed
        console.log('Pet updated successfully:', updatedPet);
      },
      error: error => {
        // Handle error, if needed
        console.error('Error updating pet:', error);
      }
    });
  }



}
