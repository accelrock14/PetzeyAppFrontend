
import { Component, Input, OnInit, inject, input } from '@angular/core';
import { IPet } from '../../../models/Pets/IPet';
import { ActivatedRoute } from '@angular/router';
import { PetsService, petToken } from '../../../services/PetsServices/pets.service';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, JsonPipe } from '@angular/common';

@Component({
  selector: 'app-create-or-edit-pet',
  standalone: true,
  imports: [ReactiveFormsModule, JsonPipe, CommonModule],
  templateUrl: './create-or-edit-pet.component.html',
  styleUrl: './create-or-edit-pet.component.css'
})
export class CreateOrEditPetComponent implements OnInit {
// }
onSumbit() {
  
}
  ToBeUpdatedPet?: IPet;
  constructor(private activatedRoute: ActivatedRoute, private petService: PetsService) {

  }
  ngOnInit(): void {
    //add the validators here

  }
  petNameValidationMessage : string = ''
  petSpeciesValidationMessage : string =''
  petBreedValidationMessage : string = ''
  petBloodGroupValidationMessage : string = ''
  petGenderValidationMessage : string = ''
  petDateOfBirthValidationMessage : string =''
  petAllergiesValidationMessage : string =''

  fb = inject (FormBuilder)
  petDetailsForm = this.fb.group
  (
    {
      petImage : ([this.ToBeUpdatedPet?.PetImage,Validators.required]),
      petName : ([this.ToBeUpdatedPet?.PetName,Validators.required]),
      petSpecies : ([this.ToBeUpdatedPet?.Species,Validators.required]),
      petBreed : ([this.ToBeUpdatedPet?.Breed, Validators.required]),
      petBloodGroup : ([this.ToBeUpdatedPet?.BloodGroup,Validators.required]),
      petGender : ([this.ToBeUpdatedPet?.Gender,Validators.required]),
      petDateOfBirth : ([this.ToBeUpdatedPet?.DateOfBirth,Validators.required]),
      petAge : (['']),
      petNeutered : (false),
      petAllergies : ([this.ToBeUpdatedPet?.Allergies,Validators.required])

    }
  )
  get PetImage() {
    return this.petDetailsForm.get('petImage')?.value
  }
  get PetName(){
    return this.petDetailsForm.get('petName')?.value
  }
  get PetSpecies(){
    return this.petDetailsForm.get('petSpecies')?.value
  }
  get PetBloodGroup(){
    return this.petDetailsForm.get('petBloodgroup')?.value
  }
  get PetGender(){
    return this.petDetailsForm.get('petGender')?.value
  }
  get PetDateOfBirth(){
    return this.petDetailsForm.get('petDateOfBirth')?.value
  }
  get PetAllergies(){
    return this.petDetailsForm.get('petAllergies')?.value
  }



  Pet?: IPet;


  SaveUpdatedPetDetails() {
    if (this.ToBeUpdatedPet) {
      this.petService.EditPet(this.ToBeUpdatedPet).subscribe(temp =>
        this.Pet = temp
      );
    }
  }

}

