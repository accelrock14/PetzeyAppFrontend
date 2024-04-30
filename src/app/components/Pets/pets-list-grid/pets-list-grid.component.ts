import { PetsService, petToken } from './../../../services/PetsServices/pets.service';
import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { IPet } from '../../../models/Pets/IPet';
import { IPetFilterParams } from '../../../models/Pets/IPetFilterParams';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AgePipe } from "../../../pipes/Age/age.pipe";
import { PetCardComponent } from "../pet-card/pet-card.component";

@Component({
    selector: 'app-pets-list-grid',
    standalone: true,
    templateUrl: './pets-list-grid.component.html',
    styleUrl: './pets-list-grid.component.css',
    imports: [FormsModule, CommonModule, AgePipe, PetCardComponent]
})
export class PetsListGridComponent implements OnInit{

  pets : IPet[] =[]
  recentlyConsultedPets : IPet[] =[]
  petsFilter : IPetFilterParams ={
    PetName:"",
    Species:"",
    PetIDs:[]
   };

  speciesOptions = ['Dog', 'Cat', 'Reptile', 'Other'];
  errorMessage: string ='';

searchPets() {
  this.petsService.FilterPets(this.petsFilter)
  .subscribe(pets => {
    this.pets = pets;
    console.log('Original pets:',this.pets);

    this.recentlyConsultedPets =pets.slice().sort((a, b) => new Date(b.LastAppointmentDate).getTime() - new Date(a.LastAppointmentDate).getTime()).slice(0,2);
    console.log('Top 4 recently consulted pets:', this.recentlyConsultedPets);

    this.errorMessage = ''; // Clear error message on successful retrieval
   },
   error => {
     if (error.status === 404) {
       this.errorMessage = 'No pets found matching your search criteria.'; // Set error message for 404
     } else {
       this.errorMessage = 'An error occurred while fetching pets.'; // Generic error message for other cases
     }
   })
}

  constructor(private petsService: PetsService){}
  ngOnInit(): void {

   // get pet IDs for doctors flow
    const petIds=[1,2];
    this.petsFilter.PetIDs=petIds;

    this.searchPets();
  }



}
