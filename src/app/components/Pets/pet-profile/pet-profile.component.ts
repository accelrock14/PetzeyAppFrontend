import { Component, Input, OnInit } from '@angular/core';
import { IPet } from '../../../models/Pets/IPet';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AgePipe } from '../../../pipes/Age/age.pipe';
import { PetsService } from '../../../services/PetsServices/pets.service';
import { ReportHistoryComponent } from '../../appointments/report-history/report-history.component';
import { CommonModule, DatePipe, NgIf, formatDate } from '@angular/common';
import { FormatDatePipe } from '../../../pipes/Date/format-date.pipe';
import { PetAppointmentsListComponent } from '../pet-appointments-list/pet-appointments-list.component';
import { AuthService } from '../../../services/UserAuthServices/auth.service';
import { User } from '../../../models/User-Authentication/User';
import { Allergy } from '../../../models/Pets/IAllergy';

@Component({
  selector: 'app-pet-profile',
  standalone: true,
  templateUrl: './pet-profile.component.html',
  styleUrl: './pet-profile.component.css',

  imports: [
    AgePipe,
    FormatDatePipe,
    DatePipe,
    NgIf,
    RouterLink,
    ReportHistoryComponent,
    PetAppointmentsListComponent,
    CommonModule
  ],
})
export class PetProfileComponent implements OnInit {


  petOwner:User | any={} as User ;
  allergies: Allergy[] = [];
  petAllergies : number[] =[] ;

  allUsers: User[]=[]
  constructor(
    private petsService: PetsService,
    private activatedRoute: ActivatedRoute,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    // Retrieve pet ID from the route parameters
    const id = this.activatedRoute.snapshot.paramMap.get('id');

    console.log(id);
    // Fetch details of the pet using its ID
    this.petsService.GetPetDetailsByID(Number(id)).subscribe((pet) => {
      this.Pet = pet;
      console.log(pet.PetName);
      console.log(this.Pet.PetID);
    });

    // Fetch All Allergies
    this.petsService.GetAllAllergies().subscribe(petAllergies => {
      this.allergies = petAllergies
      console.log(this.allergies)

    })
    // Fetch Pet Allergy
    this.petsService.GetPetAllergiesByPetID(Number(id)).subscribe(allergies => this.petAllergies = allergies);
    

     if (this.auth.isLoggedIn() ){
      // Fetch details of all users
      this.auth.getAllUsers().subscribe(
        (data) =>
          {
            console.log(data);
            this.allUsers=data;
            // Find the pet owner from the fetched users based on PetParentID
            this.petOwner=this.allUsers.find(u => u.Id==this.Pet.PetParentID)
            console.log("else "+this.petOwner);
          }
      )
      }

  }

  Pet: IPet = {} as IPet;

}
