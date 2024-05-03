import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { VetsserviceService } from '../../../services/VetsServices/vetsservice.service';
import { IVet } from '../../../models/Vets/IVet';

@Component({
  selector: 'app-add-vet',
  standalone: true,
  imports: [FormsModule,CommonModule],
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
    Photo: "",
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
  addVet() {
    this.vetService.addVet(this.vet);
    console.log(this.vet)
    
    }
}
