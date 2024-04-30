import { Component, Input } from '@angular/core';
import { IPet } from '../../../models/Pets/IPet';

@Component({
  selector: 'app-appointment-pet-profile',
  standalone: true,
  imports: [],
  templateUrl: './appointment-pet-profile.component.html',
  styleUrl: './appointment-pet-profile.component.css'
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
    Age: 4,
    Allergies: '',
    LastAppointmentDate: new Date(),
  }

  Owner = {
    ownerName: "Jack Hall",
    email: "jhondoe@gmail.com",
    address: "Bangalore, Karnataka, 560102",
    phoneNo : "+44 2071838750"
  }
}
