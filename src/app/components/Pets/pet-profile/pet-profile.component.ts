import { Component, Input, OnInit } from '@angular/core';
import { IPet } from '../../../models/Pets/IPet';
import { ActivatedRoute } from '@angular/router';
import { AgePipe } from "../../../pipes/Age/age.pipe";

@Component({
    selector: 'app-pet-profile',
    standalone: true,
    templateUrl: './pet-profile.component.html',
    styleUrl: './pet-profile.component.css',
    imports: [AgePipe]
})
export class PetProfileComponent implements OnInit {

  constructor(private activatedRoute : ActivatedRoute){

  }

  id:string |null ="";
  ngOnInit(): void {

   this.id = this.activatedRoute.snapshot.paramMap.get('id')
   alert(this.id);

  }

  pet:IPet = {} as IPet;



  Pet:IPet = {
    PetID: 0,
    PetParentId: 5,
    PetName: 'Doggo',
    PetImage: new Uint8Array(),
    Species: 'Dog',
    BloodGroup: "O+ve",
    Breed: 'Afghan Hound',
    Gender: 'Female',
    DateOfBirth: new Date(),
    Allergies: '',
    LastAppointmentDate: new Date()
  }

  Owner = {
    ownerName: "Jack Hall",
    email: "jhondoe@gmail.com",
    address: "Bangalore, Karnataka, 560102",
    phoneNo : "+44 2071838750"
  }

}
