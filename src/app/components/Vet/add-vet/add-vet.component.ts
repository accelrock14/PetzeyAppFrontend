import { Component, ElementRef } from '@angular/core';
import { VetsserviceService } from '../../../services/VetsServices/vetsservice.service';
import { IVet } from '../../../models/Vets/IVet';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  BrowserAnimationsModule,
  provideAnimations,
} from '@angular/platform-browser/animations';
import { ToastrModule, ToastrService, provideToastr } from 'ngx-toastr';
import { Router } from '@angular/router';
import { bootstrapApplication } from '@angular/platform-browser';

bootstrapApplication(Component, {
  providers: [
    provideAnimations(), // required animations providers
    provideToastr(), // Toastr providers
  ],
});

@Component({
  selector: 'app-add-vet',
  standalone: true,
  imports: [CommonModule, FormsModule],

  templateUrl: './add-vet.component.html',
  styleUrl: './add-vet.component.css',
})
export class AddVetComponent {
  maxDOB: string;
  minDOB: string;

  vet: IVet = {
    VetId: 0,
    LName: '',
    FName: '',
    npiNumber: '',
    username: '',
    Phone: '',
    email: '',
    speciality: '',
    shortBio: '',
    status: false,
    Photo: '',
    gender: '',
    dob: new Date(),
    rating: 0,
    addressId: 0,
    address: {
      AddressId: 0,
      City: '',
      street: '',
      zipcode: '',
      state: '',
    },
  };
  selectedFile: File | null = null;
  maxDate?:string
  constructor(
    private vetService: VetsserviceService,
    private toastr: ToastrService,
    private router: Router
  ) {
    const today = new Date();
    const maxDate = new Date(today.getFullYear() - 21, today.getMonth(), today.getDate());
    const minDate = new Date(today.getFullYear() - 65, today.getMonth(), today.getDate());
    this.minDOB = minDate.toISOString().split('T')[0];  
    this.maxDOB = maxDate.toISOString().split('T')[0];
  }

  onImageSelected(event: any): void {
    console.log('File selected');
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();

      reader.readAsDataURL(file);
    }
  }
  addVet(vet: IVet) {
    console.log(vet);
    this.vetService.addVet(vet).subscribe({
      next: (response) => {
        console.log('Vet added successfully:', response);
        vet.VetId = response.VetId;  // Ensure response includes VetId

        if (this.selectedFile) {
          this.vetService.uploadPhoto(vet.VetId, this.selectedFile).subscribe({
            next: (fileResponse) => {
              console.log('File uploaded successfully:', fileResponse);
              vet.Photo = `${fileResponse.fileName}`;  // Assuming fileName is the key in response
              console.log('Full Vet after photo upload: ', vet);
              this.sendProfileUpdate(vet.VetId, vet);
            },
            error: (fileError) => {
              console.error('Error uploading file:', fileError);
            }
          });
        } else {
          console.log('No file selected for upload.');
          this.sendProfileUpdate(vet.VetId, vet);
        }
      },
      error: (addVetError) => {
        console.error('Error adding vet:', addVetError);
      }
    });
}




    

  private sendProfileUpdate(vetId: number, fullVet: IVet) {
    this.vetService.updateVet(vetId, fullVet).subscribe({
      next: () => {
        this.toastr.success('Vet added successfully');
        this.router.navigate(['/vet']);
        // Optionally, perform any other post-update actions here
      },
      error: (error) => {
        console.error('Error updating vet profile:', error);
        // Optionally, handle the error specific to profile update
      },
    });
  }
}







