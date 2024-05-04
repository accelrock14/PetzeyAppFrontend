import { Component, Input, OnInit } from '@angular/core';
import { IPet } from '../../../models/Pets/IPet';
import { AgePipe } from "../../../pipes/Age/age.pipe";
import { PetsService } from '../../../services/PetsServices/pets.service';
import { AuthService } from '../../../services/UserAuthServices/auth.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-appointment-pet-profile',
    standalone: true,
    templateUrl: './appointment-pet-profile.component.html',
    styleUrl: './appointment-pet-profile.component.css',
    imports: [AgePipe, CommonModule]
})
export class AppointmentPetProfileComponent implements OnInit {
  Owner: any | null;
  constructor(private petsService: PetsService,public auth: AuthService) {}
  ngOnInit(): void {
    if (this.auth.isLoggedIn()) {
      this.Owner = this.auth.getLoggedInUserObject();
      console.log(this.Owner);
    }
    this.petsService.GetPetDetailsByID(this.PetId).subscribe( pet => {
      this.Pet = pet;
      console.log("here" +this.Pet)
    })
    // call service and get pet details
  }

  @Input()
  PetId:number = 0;

  Pet:IPet = {
    PetID: 0,
    PetParentID: '',
    PetName: '',
    PetImage: '',
    Species: '',
    Breed: '',
    BloodGroup: '',
    Gender: '',
    Neutered: false,
    DateOfBirth: new Date(),
    Allergies: '',
    LastAppointmentDate: new Date()
  }

}
