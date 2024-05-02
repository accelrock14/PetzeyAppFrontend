import { PetsService, petToken } from './../../../services/PetsServices/pets.service';
import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { IPet } from '../../../models/Pets/IPet';
import { IPetFilterParams } from '../../../models/Pets/IPetFilterParams';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AgePipe } from "../../../pipes/Age/age.pipe";
import { PetCardComponent } from "../pet-card/pet-card.component";
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/UserAuthServices/auth.service';

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
  currentPage = 1;
  itemsPerPage = 4; // Change this value as per your requirement
  totalPages = 0;
  pages: number[] = [];

searchPets() {
  this.petsService.FilterPets(this.petsFilter)
  .subscribe(pets => {

    console.log('Original pets:',this.pets);

    this.recentlyConsultedPets =pets.slice().sort((a, b) => new Date(b.LastAppointmentDate).getTime() - new Date(a.LastAppointmentDate).getTime()).slice(0,4);
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

  constructor(private petsService: PetsService,
    private route: ActivatedRoute,
    private router: Router,
    private authService : AuthService){}

  ngOnInit(): void {

   if(this.authService.isLoggedIn())
    {
      console.log("logged in");
       if(this.authService.getRoleFromToken() == 'Doctor')
        {
          console.log("doctor");
          this.petsFilter.PetIDs=[1,2,4,5,6];
          console.log(this.petsFilter.PetIDs);
        }
    }

    this.calculateTotalPages();

    this.route.params.subscribe(params => {
      const pageNumber = +params['page'];
      if (!isNaN(pageNumber) && pageNumber > 0) {
        this.currentPage = pageNumber;
        this.filterPetsPerPage(pageNumber);
      } else {
        this.updateRoute(1)
      }
    });

    // this.searchPets();
  }


  filterPetsPerPage(page: number): void {
    this.calculateTotalPages()
    this.petsService.FilterPetsPerPage(this.petsFilter, page, this.itemsPerPage)
      .subscribe(pets => {
        this.pets = pets;
        console.log('Original pets:', this.pets);

        this.recentlyConsultedPets = this.pets.slice().sort((a, b) => new Date(b.LastAppointmentDate).getTime() - new Date(a.LastAppointmentDate).getTime()).slice(0, 4);
        console.log('Top 4 recently consulted pets:', this.recentlyConsultedPets);

        this.errorMessage = ''; // Clear error message on successful retrieval

        this.currentPage = page;
      },
        error => {
          if (error.status === 404) {
            this.errorMessage = 'No pets found matching your search criteria.'; // Set error message for 404
          } else {
            this.errorMessage = 'An error occurred while fetching pets.'; // Generic error message for other cases
          }
        }
      );

  }

  calculateTotalPages(): void {

    this.petsService.GetPetsCount(this.petsFilter).subscribe(count => {
      this.totalPages = Math.ceil(count / this.itemsPerPage);
      console.log(this.totalPages)
      this.generatePageNumbers();
    });
  }

  generatePageNumbers(): void {
    this.pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      this.pages.push(i);
    }
  }

  goToPage(page: number): void {
    this.updateRoute(page);
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.updateRoute(this.currentPage - 1);
    }
  }

  nextPage(): void {
    if(this.currentPage < this.pages[this.pages.length - 1]){
      this.updateRoute(this.currentPage + 1);
    }
    console.log(this.pets)
  }

  updateRoute(page: number): void {
    this.router.navigateByUrl(`/pets-list/${page}`);
  }
}
