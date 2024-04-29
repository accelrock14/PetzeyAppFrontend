import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PetsService } from '../../../services/PetsServices/pets.service';
import { IPet } from '../../../models/Pets/IPet';

@Component({
  selector: 'app-create-pet',
  standalone: true,
  imports: [],
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

  NewPet?:IPet;



}
