import { PetsService, petToken } from './../../../services/PetsServices/pets.service';
import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { IPet } from '../../../models/Pets/IPet';
import { IPetFilterParams } from '../../../models/Pets/IPetFilterParams';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AgePipe } from "../../../pipes/Age/age.pipe";

@Component({
    selector: 'app-pets-list-grid',
    standalone: true,
    templateUrl: './pets-list-grid.component.html',
    styleUrl: './pets-list-grid.component.css',
    imports: [FormsModule, CommonModule, AgePipe]
})
export class PetsListGridComponent implements OnInit{

  speciesOptions = ['Dog', 'Cat', 'Reptile', 'Other'];

searchPets() {
  this.petsService.FilterPets(this.petsFilter).subscribe(pets => {
    this.pets=pets;
   })
}

  constructor(private petsService: PetsService){}




  ngOnInit(): void {
   this.petsService.FilterPets(this.petsFilter).subscribe(pets => {

    this.pets=pets;
   })
  }

  pets : IPet[] =[]
  petsFilter : IPetFilterParams ={
  PetName:"",
  Species:"",
  PetIDs:[]

  };

}
