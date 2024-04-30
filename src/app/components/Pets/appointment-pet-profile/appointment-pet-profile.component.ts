import { Component, Input } from '@angular/core';
import { IPet } from '../../../models/Pets/IPet';
import { AgePipe } from "../../../pipes/Age/age.pipe";

@Component({
    selector: 'app-appointment-pet-profile',
    standalone: true,
    templateUrl: './appointment-pet-profile.component.html',
    styleUrl: './appointment-pet-profile.component.css',
    imports: [AgePipe]
})
export class AppointmentPetProfileComponent {

  @Input()
  Pet:IPet = {
    PetID: 0,
    PetParentId: 5,
    PetName: 'Doggo',
    PetImage: 'arraybuffer',
    Species: 'Dog',
    Breed: 'Afghan Hound',
    Gender: 'Female',
    DateOfBirth: new Date(),
    Allergies: '',
    LastAppointmentdate: ''
  }

  Owner = {
    ownerName: "Jack Hall",
    email: "jhondoe@gmail.com",
    address: "Bangalore, Karnataka, 560102",
    phoneNo : "+44 2071838750"
  }
}
