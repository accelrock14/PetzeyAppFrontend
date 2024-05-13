import { Component, OnInit } from '@angular/core';
import { IPet } from '../../../models/Pets/IPet';
import { PetsService } from '../../../services/PetsServices/pets.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/UserAuthServices/auth.service';
import { Router, RouterLink } from '@angular/router';

import { AgePipe } from '../../../pipes/Age/age.pipe';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Allergy } from '../../../models/Pets/IAllergy';
import { IPetAndAllergy } from '../../../models/Pets/IPetAndAllergy';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
  imports: [CommonModule, RouterLink, AgePipe, ReactiveFormsModule, FormsModule],
})
export class UserProfileComponent implements OnInit {


  petParentID: any;

  NewPet: IPet = {} as IPet;
  NewPetAndAllergy: IPetAndAllergy = {} as IPetAndAllergy
  newPetForm: FormGroup;
  petDetailsForm: FormGroup;
  ToBeUpdatedPet: IPet = {} as IPet;
  ToBeUpdatedPetAndAllergy: IPetAndAllergy = {} as IPetAndAllergy
  // user!: User ;
  pets: IPet[] = [];
  petToDelete!: IPet;
  user!: any;
  allergies: Allergy[] = [];
  filteredAllergies: Allergy[] = []
  allergiesForPet: number[] = []
  allergiesForPetToBeEdited: number[] = []
  filter: string = '';

  constructor(
    private petsService: PetsService,
    public auth: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private toaster: ToastrService
  ) {
    this.newPetForm = this.fb.group({
      PetImage: [this.NewPet?.PetImage],
      PetName: ([this.NewPet?.PetName, Validators.required]),
      Species: ([this.NewPet?.Species, Validators.required]),
      Breed: ([this.NewPet?.Breed, Validators.required]),
      BloodGroup: ([this.NewPet?.BloodGroup, Validators.required]),
      Gender: ([this.NewPet?.Gender, Validators.required]),
      DateOfBirth: [this.NewPet?.DateOfBirth],
      Neutered: ([this.NewPet?.Neutered, Validators.required]),
      Allergies: (['']),
    });

    this.petDetailsForm = this.fb.group({
      PetImage: [this.ToBeUpdatedPet?.PetImage],
      PetName: ([this.ToBeUpdatedPet?.PetName, Validators.required]),
      Species: ([this.ToBeUpdatedPet?.Species, Validators.required]),
      Breed: ([this.ToBeUpdatedPet?.Breed, Validators.required]),
      BloodGroup: ([this.ToBeUpdatedPet?.BloodGroup, Validators.required]),
      Gender: ([this.ToBeUpdatedPet?.Gender, Validators.required]),
      DateOfBirth: ([this.ToBeUpdatedPet?.DateOfBirth]),
      Neutered: [this.ToBeUpdatedPet?.Neutered, Validators.required],
      Allergies: (['']),
    });
  }

  ngOnInit(): void {
    if (this.auth.isLoggedIn()) {
      this.user = this.auth.getLoggedInUserObject();
    }
    this.petParentID = this.auth.getUIDFromToken();
    console.log(this.petParentID);
    this.petsService
      .GetPetsByParentID(`${this.petParentID}`)
      .subscribe((data) => {
        this.pets = data;
      });
    console.log(this.allergies)

  }

  // Sets pet to be deleted
  setPetToDelete(pet: IPet, event: MouseEvent) {
    event.stopPropagation(); // Prevents the card from being clicked
    this.petToDelete = pet;
    this.openDeleteModal(); // this method opens the modal of deleting pet
  }

  deleteConfirmedPet(event: MouseEvent) {
    event.stopPropagation();

    // Check if the petToDelete is notNull 
    if (this.petToDelete) {
      // Call the method in the service to delete the pet 
      this.petsService
        .DeletePetByPetID(this.petToDelete.PetID)
        .subscribe(() => {
          // To auto-update the pets without refreshing the page
          this.petsService.GetPetsByParentID(`${this.petParentID}`).subscribe(
            (data) => {
              this.pets = data;
            },
            // In case of network issue or server errors the pets array is set to empty array
            // In order not to display the incorrect data
            (error) => {
              this.pets = [];
            }
          );
        });

      // Provide a toast notification service for the user
      this.toaster.success("Pet Deleted Successfully!")
    }

    this.closeDeleteModal(event);
  }

  toggleDropdown(event: MouseEvent) {
    event.stopPropagation();
    // closest method traverse up the DOM tree untill it element with specifed class (.dropdown)
    const dropdown = (event.target as HTMLElement).closest('.dropdown');
    if (dropdown) {
      // querySelector selects the first element that matches the specified CSS selector ".dropdown-menu"
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
    const editModal: HTMLElement | null = document.querySelector('.modal'); // Get reference to the modal
    if (editModal) {
      editModal.style.display = 'none'; // Hide the modal
    }
    this.petsService
      .GetPetsByParentID(`${this.petParentID}`)
      .subscribe((data) => {
        this.pets = data;
      });
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
        // Patches the form with the values of ToBeUpdatedPet
        this.petDetailsForm.patchValue(this.ToBeUpdatedPet);
        console.log(pet);
      },

      (error) => {
        // Logs the error on to the console
        console.log(error);
      }
    );
    this.petsService.GetAllAllergies().subscribe(petAllergies => this.allergies = petAllergies)
    console.log(this.allergies)
    this.petsService.GetPetAllergiesByPetID(this.ToBeUpdatedPet?.PetID).subscribe(allergies => this.allergiesForPetToBeEdited = allergies);
    console.log(this.allergiesForPetToBeEdited)
    if (this.ToBeUpdatedPet)
      this.petDetailsForm.patchValue(this.ToBeUpdatedPet);
    console.log(this.petDetailsForm.value);
  }

  OnLogout() {
    this.auth.logOut();
    // navigates back to home page on logout
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
      // Provide a toastr notification to the user
      this.toaster.success("Pet Successfully Added!")
      this.NewPet = {} as IPet
    }
    else {
      // Incase of any error provide the necessary message to the user
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
      // Incase of any error provide the necessary message to the user
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
      // Extracts the base64 encoded string of file from the result property of the fileReader
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
    // Gets the userID and assigns it to petParentID
    this.NewPet!.PetParentID = this.auth.getUIDFromToken();
    this.NewPetAndAllergy!.Pet = this.NewPet;
    this.NewPetAndAllergy!.allergies = this.allergiesForPet;
    this.petsService.AddPet(this.NewPetAndAllergy!).subscribe({
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
    this.ToBeUpdatedPetAndAllergy!.Pet = this.ToBeUpdatedPet;
    this.ToBeUpdatedPetAndAllergy!.allergies = this.allergiesForPetToBeEdited;
    this.petsService.EditPet(this.ToBeUpdatedPetAndAllergy).subscribe({
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
    // To auto-update the cards without refreshing
    this.petsService
      .GetPetsByParentID(`${this.petParentID}`)
      .subscribe((data) => {
        this.pets = data;
      });
  }


  filterPetAllergies() {
    console.log(this.filter)
    if (!this.newPetForm.get('Allergies')?.value.length) {
      this.filteredAllergies = this.allergies;
    }
    else {
      this.filteredAllergies = this.allergies.filter(c => c.AllergyName.toLowerCase().includes(this.newPetForm.get('Allergies')?.value.toLowerCase()));
    }
  }

  selectPetAllergy(allID: number) {
    this.newPetForm.get('Allergies')?.setValue('');
    this.allergiesForPet.push(allID);
  }
  onRemoveAllergy(allID: number) {
    this.allergiesForPet = this.allergiesForPet.filter(n => n !== allID);
  }
  OnAddorEditClick() {
    this.petsService.GetAllAllergies().subscribe(petAllergies => this.allergies = petAllergies)
    console.log(this.allergies)
  }
  filterEditPetAllergies() {
    if (!this.petDetailsForm.get('Allergies')?.value.length) {
      this.filteredAllergies = this.allergies;
    }
    else {
      this.filteredAllergies = this.allergies.filter(c => c.AllergyName.toLowerCase().includes(this.petDetailsForm.get('Allergies')?.value.toLowerCase()));
    }  }
  onRemoveEditPetAllergy(allID: number) {
    this.allergiesForPetToBeEdited = this.allergiesForPetToBeEdited.filter(n => n !== allID);
  }
  selectEditPetAllergy(allID: number) {
    this.petDetailsForm.get('Allergies')?.setValue('');
    this.allergiesForPetToBeEdited.push(allID);
  }
}
