import { Component, ElementRef } from '@angular/core';
import { VetsserviceService } from '../../../services/VetsServices/vetsservice.service';
import { IVet } from '../../../models/Vets/IVet';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-vet',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './add-vet.component.html',
  styleUrl: './add-vet.component.css'
})
export class AddVetComponent {
  vet: IVet = {
    vetId: 0,
    LName: '',
    FName: '',
    npiNumber: '',
    username: '',
    Phone: '',
    email: '',
    speciality: '',
    shortBio: '',
    status: false,
    photo: "",
    gender: '',
    dob: new Date(),
    rating: 0,
    addressId: 0,
    address: {
        AddressId: 0,
        city: '',
        street: '',
        zipcode: '',
        state: ''
    }
};
  constructor(private vetService:VetsserviceService){}
  addVet(vet:IVet) {
    console.log(vet);
    
    
    this.vetService.addVet(vet).subscribe();
   
    
    }
}