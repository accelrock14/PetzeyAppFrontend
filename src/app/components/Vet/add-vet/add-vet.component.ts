import { Component, ElementRef } from '@angular/core';
import { VetsserviceService } from '../../../services/VetsServices/vetsservice.service';
import { IVet } from '../../../models/Vets/IVet';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { ToastrModule, ToastrService, provideToastr } from 'ngx-toastr';
import { Router } from '@angular/router';
import { bootstrapApplication } from '@angular/platform-browser';

bootstrapApplication(Component, {
  providers: [
    provideAnimations(), // required animations providers
    provideToastr(), // Toastr providers
  ]
});



@Component({
  selector: 'app-add-vet',
  standalone: true,
  imports: [CommonModule, FormsModule],
  
  templateUrl: './add-vet.component.html',
  styleUrl: './add-vet.component.css',
})



export class AddVetComponent {
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
      city: '',
      street: '',
      zipcode: '',
      state: '',
    },
  };
  selectedFile: File | null = null;
  constructor(private vetService: VetsserviceService,     private toastr: ToastrService,    private router: Router,

  ) {}

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
        vet.VetId = response.VetId;
        console.log('Full Vet: ', vet);
      },
      error: (error) => {
        console.error('Error uploading file:', error);
      },
    });

    if (this.selectedFile) {
      this.vetService.uploadPhoto(this.vet.VetId, this.selectedFile).subscribe({
        next: (response) => {
          console.log('File uploaded successfully:', response);
          // Update the Photo property in the vetProfile
          vet.Photo = `${response.fileName}`;
          console.log('Full Vet: ', vet);
          this.sendProfileUpdate(this.vet.VetId, vet);

        },
        error: (error) => {
          console.error('Error uploading file:', error);
        },
      });
    
  }
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
    }
  });
}
}
