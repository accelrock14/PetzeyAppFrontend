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
import {MatPaginatorIntl, MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import { PetsPaginatorIntlService } from '../../../services/PetsServices/pets-paginator-intl.service';
import { IPetGridDto } from '../../../models/Pets/IPetGridDto';

@Component({
  selector: 'app-pets-list-grid',
  standalone: true,
  templateUrl: './pets-list-grid.component.html',
  styleUrl: './pets-list-grid.component.css',
  imports: [FormsModule, CommonModule, AgePipe, PetCardComponent, MatPaginatorModule],
  providers: [{ provide: MatPaginatorIntl, useClass: PetsPaginatorIntlService}]
})
export class PetsListGridComponent implements OnInit {

  constructor(private petsService: PetsService,
    private route: ActivatedRoute,
    private router: Router,
    public authService: AuthService,
    private vetService: VetsserviceService,
    private appointmentDetailsService: AppointmentDetailsService
  ) { }

  pets: IPet[] = []
  recentlyConsultedPets: IPetGridDto[] = []
  petsFilter: IPetFilterParams = {
    PetName: "",
    Species: "",
    PetIDs: []
  };

  pages: number[] = [];
  currentPage = 1;
  itemsPerPage = 5; // Number of Pets per page
  totalPages: number = 0;
  totalCount: number = 0;
  speciesOptions = ['Dog', 'Cat', 'Reptile', 'Other'];
  users!: any;
  errorMessage: string = '';

  ngOnInit(): void {

    // This Component is only for LoggedIn Users
    if (this.authService.isLoggedIn()) {
      console.log("logged in");

       let role: string = this.authService.getRoleFromToken()
      if (role == 'Doctor') {
        this.DoctorsFlow();
      }
      else if (role == 'Receptionist') {
        this.ReceptionistFlow();
      }

      // Get All User Objects - Required To display the Pet Owner Details
      this.authService.getAllUserIDsandNames().subscribe(users => {
        this.users = users
      })
    }

  }

  public ReceptionistFlow() {
    this.recentlyConsulted()
    this.fetchPets()

  }

  public DoctorsFlow() {
    console.log("doctor");
    let vpi = this.authService.getVPIFromToken()

    this.vetService.getVetsByNPINumber(vpi as string).subscribe(
      data => {
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
              this.recentlyConsulted()
              this.fetchPets();
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
    this.petsService.FilterPetIds(this.petsFilter)
      .subscribe(petIds => {

        console.log('Filter Pet Ids:', petIds);

         // get top 4 recently consulted
         // TODO



         // get pet details by pet Ids
          this.petsService.GetPetsGridByPetIDs(petIds.slice(0,4))
          .subscribe(data =>
            {
              this.recentlyConsultedPets = data;
              console.log("recently consulted pet details : "+this.recentlyConsultedPets[0].PetName)
            }
          )

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

  fetchPets(): void {

    console.log('filter', this.petsFilter.PetIDs)
    this.petsService.FilterPetsPaged(this.petsFilter, this.currentPage, this.itemsPerPage)
      .subscribe(data => {
        this.pets = data.Pets;
        this.totalCount = data.Count
        console.log('Original pets:', this.pets);
        this.totalPages = Math.ceil( this.totalCount / this.itemsPerPage)
        this.errorMessage = ''; // Clear error message on successful retrieval

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
  handlePageEvent(pageEvent: PageEvent) {
    console.log("handlepageevent", pageEvent)
    this.currentPage = pageEvent.pageIndex + 1
    this.itemsPerPage = pageEvent.pageSize
    this.fetchPets()
  }
  onSelectFilters(): void {
    this.recentlyConsulted();
    this.currentPage = 1;
    this.fetchPets();
  }

}
