import { Component, Input, OnInit } from '@angular/core';
import { IPet } from '../../../models/Pets/IPet';
import { ActivatedRoute } from '@angular/router';
import { PetsService, petToken } from '../../../services/PetsServices/pets.service';
import { Form, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, JsonPipe } from '@angular/common';

@Component({
  selector: 'app-create-or-edit-pet',
  standalone: true,
  imports: [ReactiveFormsModule, JsonPipe, CommonModule],
  templateUrl: './create-or-edit-pet.component.html',
  styleUrl: './create-or-edit-pet.component.css'
  
})
export class CreateOrEditPetComponent implements OnInit {
  imageUrl:string | undefined;
  @Input() ToBeUpdatedPet?: IPet;
  petDetailsForm: FormGroup;

  constructor(private fb: FormBuilder, private activatedRoute: ActivatedRoute, private petService: PetsService) {
    this.petDetailsForm = this.fb.group({
      PetName: [this.ToBeUpdatedPet?.PetName],
      Species: [this.ToBeUpdatedPet?.Species],
      Breed: [this.ToBeUpdatedPet?.Breed],
      BloodGroup: [this.ToBeUpdatedPet?.BloodGroup],
      Gender: [this.ToBeUpdatedPet?.Gender],
      DateOfBirth: [this.ToBeUpdatedPet?.DateOfBirth],
      Neutered: [this.ToBeUpdatedPet?.Neutered],
      Allergies: [this.ToBeUpdatedPet?.Allergies]
    });
  }

  ngOnInit(): void {
    if (this.ToBeUpdatedPet) {
      this.petDetailsForm.patchValue(this.ToBeUpdatedPet);
    }
    if(this.ToBeUpdatedPet)
      this.displayImage(this.ToBeUpdatedPet?.PetImage)
    
  }

  onSubmit(): void {
    // Handle form submission
    if (this.petDetailsForm.valid) {
      // Update ToBeUpdatedPet with form values
      this.ToBeUpdatedPet = {
        ...this.ToBeUpdatedPet,
        ...this.petDetailsForm.value
      };
      this.SaveUpdatedPetDetails()       
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
        this.ToBeUpdatedPet!.PetImage = base64String;
        this.displayImage(base64String);
      }
    };
    reader.readAsDataURL(file);
  }
  
  displayImage(base64String: string): void {
    this.imageUrl = base64String;
    console.log(this.imageUrl);
  }






  SaveUpdatedPetDetails() {
    console.log(this.ToBeUpdatedPet)
    this.petService.EditPet(this.ToBeUpdatedPet!).subscribe({
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
