import { Component, Input, input } from '@angular/core';
import { IPet } from '../../../models/Pets/IPet';
import { ActivatedRoute } from '@angular/router';
import { PetsService, petToken } from '../../../services/PetsServices/pets.service';
import { I18nPluralPipe } from '@angular/common';

@Component({
  selector: 'app-create-or-edit-pet',
  standalone: true,
  imports: [],
  templateUrl: './create-or-edit-pet.component.html',
  styleUrl: './create-or-edit-pet.component.css'
})
export class CreateOrEditPetComponent {
  constructor(private activatedRoute:ActivatedRoute, private petService: PetsService){

  }

@Input()
ToBeUpdatedPet?:IPet;

Pet?:IPet;


SaveUpdatedPetDetails() {
  if (this.ToBeUpdatedPet) {
    this.petService.EditPet(this.ToBeUpdatedPet).subscribe(temp =>
      this.Pet = temp
    );
  }
}

}

