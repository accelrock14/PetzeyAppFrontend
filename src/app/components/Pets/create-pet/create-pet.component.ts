import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PetsService } from '../../../services/PetsServices/pets.service';
import { IPet } from '../../../models/Pets/IPet';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-pet',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './create-pet.component.html',
  styleUrl: './create-pet.component.css'
})
export class CreatePetComponent {
CreateNewPet() {
  if(this.NewPet){
    this.petsService.AddPet(this.NewPet).subscribe();
  }
}
  constructor(private activatedRoute:ActivatedRoute, private petsService:PetsService){

  }

  NewPet:IPet={
    PetID: 0,
    PetParentId: 0,
    PetName: '',
    PetImage: new Uint8Array(0), 
    Species: '',
    Breed: '',
    BloodGroup:'',
    Gender: '',
    DateOfBirth: new Date(),
    Age: 0,
    Allergies: '',
    LastAppointmentdate: new Date()

  }



}
