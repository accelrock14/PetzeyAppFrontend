import { PetsService, petToken } from './../../../services/PetsServices/pets.service';
import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { IPet } from '../../../models/Pets/IPet';
import { IPetFilterParams } from '../../../models/Pets/IPetFilterParams';
import { FormsModule } from '@angular/forms';
import { CommonModule, NumberFormatStyle } from '@angular/common';
import { AgePipe } from "../../../pipes/Age/age.pipe";
import { PetCardComponent } from "../pet-card/pet-card.component";
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/UserAuthServices/auth.service';
import { AppointmentDetailsService } from '../../../services/appointment-details.service';
import { User } from '../../../models/User-Authentication/User';
import { VetsserviceService } from '../../../services/VetsServices/vetsservice.service';

@Component({
  selector: 'app-pets-list-grid',
  standalone: true,
  templateUrl: './pets-list-grid.component.html',
  styleUrl: './pets-list-grid.component.css',
  imports: [FormsModule, CommonModule, AgePipe, PetCardComponent]
})
export class PetsListGridComponent implements OnInit {

  constructor(private petsService: PetsService,
    private route: ActivatedRoute,
    private router: Router,
    public authService: AuthService,
    private vetService: VetsserviceService,
    private appointmentDetailsService: AppointmentDetailsService
  ) 
  { }

  ngOnInit(): void {

    // This Component is only for LoggedIn Users
    if (this.authService.isLoggedIn()) {
      console.log("logged in");

      if (this.authService.getRoleFromToken() == 'Doctor') {
        this.DoctorsFlow();
      }
      if (this.authService.getRoleFromToken() == 'Receptionist') {
        this.ReceptionistFlow();
      }

      // Get All User Objects - Required To display the Pet Owner Details
      this.authService.getAllUserIDsandNames().subscribe(users => {
        this.users = users
      })
    }

  }

  pets: IPet[] = []
  recentlyConsultedPets: IPet[] = []
  petsFilter: IPetFilterParams = {
    PetName: "",
    Species: "",
    PetIDs: []
  };

  pages: number[] = [];
  currentPage = 1;
  itemsPerPage = 8; // Number of Pets per page
  speciesOptions = ['Dog', 'Cat', 'Reptile', 'Other'];
  users!:any;
  totalPages = 0;
  errorMessage: string = '';

  public ReceptionistFlow() {

    this.calculateTotalPages();   // To Calculate Total Number of Pages

    // fetch pet details based on page number
    this.route.params.subscribe(params => { 
      const pageNumber = +params['page'];
      if (!isNaN(pageNumber) && pageNumber > 0) {
        this.currentPage = pageNumber;
        this.recentlyConsulted()
        this.filterPetsPerPage(pageNumber);
      } else {
        this.updateRoute(1); 
      }
    });

  }

  public DoctorsFlow() {
    console.log("doctor");
    let vpi = this.authService.getVPIFromToken()

    this.vetService.getVetsByNPINumber(vpi as string).subscribe(
      data =>
        {
          console.log("vid " + data.VetId);
          
          // Get All pet Ids consulted by the currently logged in Doctor
          this.appointmentDetailsService.GetAllPetIDByVetId(data.VetId)
            .subscribe({
            next: (data) => {
            console.log('data', data);
            
            // if doctor has consulted pets before
            if (data.length != 0) {
              this.petsFilter.PetIDs = data;
              this.errorMessage = '';
            }
            else { // doctor has not consulted any pets 
              this.petsFilter.PetIDs = [-1];
            }
            this.calculateTotalPages();

            this.route.params.subscribe(params => {
              const pageNumber = +params['page'];
              if (!isNaN(pageNumber) && pageNumber > 0) {
                this.currentPage = pageNumber;
                this.recentlyConsulted()
                this.filterPetsPerPageForDoctor(pageNumber);
              } else {
                this.updateRoute(1);
              }
            });
        },
          error: (err) => {
            this.petsFilter.PetIDs = [-1];
            console.log("error while fetching", err);
            if (err.status === 404) {
              this.errorMessage = 'No pets found matching your search criteria.'; // Set error message for 404
            } else {
              this.errorMessage = 'An error occurred while fetching pets.';
            }
          }
        });
      }
    )
  }
  
  recentlyConsulted() {
    this.petsService.FilterPets(this.petsFilter)
      .subscribe(pets => {

        console.log('Original pets:', this.pets);

        // this.recentlyConsultedPets = pets.filter(p => p.LastAppointmentDate != null).slice().sort((a, b) => new Date(b.LastAppointmentDate).getTime() - new Date(a.LastAppointmentDate).getTime()).slice(0, 4);
        console.log('Top 4 recently consulted pets:', this.recentlyConsultedPets);

        this.errorMessage = ''; // Clear error message on successful retrieval
      },
        error => {
          if (error.status === 404) {
            this.errorMessage = 'No pets found matching your search criteria.'; // Set error message for 404
          } else {
            this.errorMessage = 'An error occurred while fetching pets.';
          }
        });
  }

  filterPetsPerPageForDoctor(page: number): void {
    this.calculateTotalPages()
    console.log('filter', this.petsFilter.PetIDs)
    this.petsService.FilterPetsPerPage(this.petsFilter, page, this.itemsPerPage)
      .subscribe(pets => {
        this.pets = pets;
        console.log('Original pets:', this.pets);
        // this.recentlyConsultedPets = this.pets.filter(p => p.LastAppointmentDate != null).slice().sort((a, b) => new Date(b.LastAppointmentDate).getTime() - new Date(a.LastAppointmentDate).getTime()).slice(0, 4);
        // console.log('Top 4 recently consulted pets:', this.recentlyConsultedPets);
        // this.recentlyConsulted()

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

  filterPetsPerPage(page: number): void {
    this.calculateTotalPages()
    console.log('filter', this.petsFilter.PetIDs)
    this.petsService.FilterPetsPerPage(this.petsFilter, page, this.itemsPerPage)
      .subscribe(pets => {
        this.pets = pets;   // Get All the Pets based on Current Filter
        console.log('Original pets:', this.pets);

        // Get Recently Consulted Pets based on Last Appointment Date
        // this.recentlyConsultedPets = this.pets.slice().sort((a, b) => new Date(b.LastAppointmentDate).getTime() - new Date(a.LastAppointmentDate).getTime()).slice(0, 4);
        // console.log('Top 4 recently consulted pets:', this.recentlyConsultedPets);
        // this.recentlyConsulted()
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

  // Get the count of pages that will be needed to display all pets
  calculateTotalPages(): void {
    this.petsService.GetPetsCount(this.petsFilter).subscribe(count => {
      this.totalPages = Math.ceil(count / this.itemsPerPage);  // Calculate the total no of pages based on number of pets per page
      // console.log(this.totalPages)
      this.generatePageNumbers();
    });
  }

  generatePageNumbers(): void {
    this.pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      this.pages.push(i);
    }
  }

  // goToPage(page: number): void {
  //   this.updateRoute(page);
  // }

  // navigate to previous page
  prevPage(): void {
    if (this.currentPage > 1) {
      this.updateRoute(this.currentPage - 1);
    }
  }

  // navigate to next page
  nextPage(): void {
    if (this.currentPage < this.pages[this.pages.length - 1]) {
      this.updateRoute(this.currentPage + 1);
    }
    console.log(this.pets)
  }

  // nevigate to a specific page number
  updateRoute(page: number): void {
    this.router.navigateByUrl(`/pets-list/${page}`);
  }
}
