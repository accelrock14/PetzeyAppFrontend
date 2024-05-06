import { Component, OnInit } from '@angular/core';
import { IPet } from '../../../models/Pets/IPet';
import { PetsService } from '../../../services/PetsServices/pets.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/UserAuthServices/auth.service';
import { Router, RouterLink } from '@angular/router';

import { AgePipe } from '../../../pipes/Age/age.pipe';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
  imports: [CommonModule, RouterLink, AgePipe, ReactiveFormsModule],
})
export class UserProfileComponent implements OnInit {



  petParentID:any;

  NewPet: IPet = {
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
  };
  newPetForm: FormGroup;
  petDetailsForm: FormGroup;
  ToBeUpdatedPet: IPet = {} as IPet;
  // user!: User ;
  pets: IPet[] = [];
  petToDelete!: IPet;
  user!: any;

  constructor(
    private petsService: PetsService,
    public auth: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private toaster:ToastrService
  ) {
    this.newPetForm = this.fb.group({
      PetImage: [this.NewPet?.PetImage],
      PetName: ([this.NewPet?.PetName, Validators.required]),
      Species: ([this.NewPet?.Species, Validators.required]),
      Breed: ([this.NewPet?.Breed, Validators.required]),
      BloodGroup: ([this.NewPet?.BloodGroup,Validators.required]),
      Gender: ([this.NewPet?.Gender, Validators.required]),
      DateOfBirth: [this.NewPet?.DateOfBirth],
      Neutered: ([this.NewPet?.Neutered, Validators.required]),
      Allergies: ([this.NewPet?.Allergies, Validators.required]),
    });

    this.petDetailsForm = this.fb.group({
      PetImage: [this.ToBeUpdatedPet.PetImage],
      PetName: ([this.ToBeUpdatedPet.PetName,Validators.required]),
      Species: ([this.ToBeUpdatedPet.Species,Validators.required]),
      Breed: ([this.ToBeUpdatedPet.Breed, Validators.required]),
      BloodGroup: ([this.ToBeUpdatedPet.BloodGroup,Validators.required]),
      Gender: ([this.ToBeUpdatedPet.Gender, Validators.required]),
      DateOfBirth: ([this.ToBeUpdatedPet.DateOfBirth]),
      Neutered: [this.ToBeUpdatedPet.Neutered, Validators.required],
      Allergies: [this.ToBeUpdatedPet.Allergies, Validators.required],
    });
  }

  ngOnInit(): void {
    console.log('ngOnInit() is called');

    if (this.auth.isLoggedIn()) {
      this.user = this.auth.getLoggedInUserObject();
    }

    // this.petsService.getUser().subscribe((data) => {
    //   this.user = data;
    // })

    this.petParentID = this.auth.getUIDFromToken();
    console.log(this.petParentID);
    this.petsService
      .GetPetsByParentID(`${this.petParentID}`)
      .subscribe((data) => {
        this.pets = data;
      });
  }

  setPetToDelete(pet: IPet, event: MouseEvent) {
    event.stopPropagation();
    this.petToDelete = pet;
    this.openDeleteModal();
  }

  deleteConfirmedPet(event: MouseEvent) {
    event.stopPropagation();

    if (this.petToDelete) {
      this.petsService
        .DeletePetByPetID(this.petToDelete.PetID)
        .subscribe(() => {
          this.petsService.GetPetsByParentID(`${this.petParentID}`).subscribe(
            (data) => {
              this.pets = data;
            },
            (error) => {
              this.pets = [];
            }
          );
        });
    }
    // this.petsService
    //   .GetPetsByParentID(`${this.petParentID}`)
    //   .subscribe((data) => {
    //     this.pets = data;
    //   });
    this.closeDeleteModal(event);
  }

  toggleDropdown(event: MouseEvent) {
    event.stopPropagation(); // This thing is to prevent the card from clicking
    const dropdown = (event.target as HTMLElement).closest('.dropdown');
    if (dropdown) {
      const dropdownMenu = dropdown.querySelector('.dropdown-menu');
      if (dropdownMenu) {
        dropdownMenu.classList.toggle('show');
      }
    }
  }

  openDeleteModal() {
    const editModal: HTMLElement | null = document.querySelector('.modal'); // Get reference to the modal
    if (editModal) {
      editModal.style.display = 'block'; // Show the modal
    }
  }

  closeDeleteModal(event: MouseEvent) {
    event.stopPropagation();
    const editModal: HTMLElement | null = document.querySelector('.modal');
    if (editModal) {
      editModal.style.display = 'none'; // Hide the modal
    }
    // this.petsService
    //   .GetPetsByParentID(`${this.petParentID}`)
    //   .subscribe((data) => {
    //     this.pets = data;
    //   });
  }

  preventCardClick(event: MouseEvent) {
    event.stopPropagation();
    console.log('hi');
  }
  preventCardClickEdit($event: MouseEvent, arg1: number) {
    $event.stopPropagation();
    this.petsService.GetPetDetailsByID(arg1).subscribe(
      (pet) => {
        this.ToBeUpdatedPet = pet;
        console.log(this.ToBeUpdatedPet);
        this.petDetailsForm.patchValue(this.ToBeUpdatedPet);
        console.log(pet);
      },

      (error) => {
        console.log(error);
      }
    );

    if (this.ToBeUpdatedPet)
      this.petDetailsForm.patchValue(this.ToBeUpdatedPet);
    console.log(this.petDetailsForm.value);
  }

  OnLogout() {
    this.auth.logOut();
    this.router.navigate(['/']);
  }

  onSubmitAdd(): void {
    // Handle form submission
    if (this.newPetForm.valid) {
      // Update ToBeUpdatedPet with form values
      this.NewPet = {
        ...this.NewPet,
        ...this.newPetForm.value,
      };
      this.SavePetDetails()
      this.toaster.success("Pet Successfully Added!")
      this.NewPet = {} as IPet
    }
    else {
      this.toaster.error("Pet Failed To Be Added!")
    }
  }
  onSubmitEdit(): void {
    if (this.petDetailsForm.valid) {
      // Update ToBeUpdatedPet with form values
      this.ToBeUpdatedPet = {
        ...this.ToBeUpdatedPet,
        ...this.petDetailsForm.value,
      };
      this.SaveUpdatedPetDetails()
      this.toaster.success("Pet Successfully Edited")
      this.petsService.GetPetsByParentID(`${this.petParentID}`).subscribe((data) => {
        this.pets = data;
    });

    }
    else {
      this.toaster.error("Pet Failed To Be Edited!")
    }
  }
  handleFileAdd(event: any): void {
    const files: FileList = event.target.files;
    if (files && files.length > 0) {
      const file: File = files[0];
      console.log(file);
      this.convertImageToBase64Add(file);
    }
  }

  convertImageToBase64Add(file: File): void {
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64String: string | null = e.target?.result as string;
      if (base64String) {
        // Store the base64String in your object or send it to the backend
        this.NewPet!.PetImage = base64String;
        console.log(base64String);
        if (this.NewPet) this.newPetForm.patchValue(this.NewPet);
      }
    };
    reader.readAsDataURL(file);
  }
  handleFileEdit(event: any): void {
    const files: FileList = event.target.files;
    if (files && files.length > 0) {
      const file: File = files[0];
      this.convertImageToBase64Edit(file);
    }
  }
  convertImageToBase64Edit(file: File): void {
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64String: string | null = e.target?.result as string;
      if (base64String) {
        // Store the base64String in your object or send it to the backend
        this.ToBeUpdatedPet!.PetImage = base64String;
        if (this.ToBeUpdatedPet)
          this.petDetailsForm.patchValue(this.ToBeUpdatedPet);
      }
    };
    reader.readAsDataURL(file);
  }

  SavePetDetails() {
    this.NewPet!.PetParentID = this.auth.getUIDFromToken();
    console.log(this.NewPet);
    this.petsService.AddPet(this.NewPet!).subscribe({
      next: (updatedPet) => {
        // Handle success, if needed
        console.log('Pet updated successfully:', updatedPet);

        this.petsService
          .GetPetsByParentID(`${this.petParentID}`)
          .subscribe((data) => {
            this.pets = data;
          });
      },
      error: (error) => {
        // Handle error, if needed
        console.error('Error updating pet:', error);
      },
    });
  }

  SaveUpdatedPetDetails() {
    console.log(this.ToBeUpdatedPet);
    this.petsService.EditPet(this.ToBeUpdatedPet!).subscribe({
      next: (updatedPet) => {
        // Handle success, if needed
        console.log('Pet updated successfully:', updatedPet);
      },
      error: (error) => {
        // Handle error, if needed
        console.error('Error updating pet:', error);
      },
    });
  }

  clickedCancelEditButton() {
    this.petsService
      .GetPetsByParentID(`${this.petParentID}`)
      .subscribe((data) => {
        this.pets = data;
      });
  }
}
