import { Component, OnInit } from '@angular/core';
import { IPet } from '../../../models/Pets/IPet';
import { PetsService } from '../../../services/PetsServices/pets.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/UserAuthServices/auth.service';
import { Router, RouterLink } from '@angular/router';
import { AgePipe } from "../../../pipes/Age/age.pipe";
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-user-profile',
    standalone: true,
    templateUrl: './user-profile.component.html',
    styleUrl: './user-profile.component.css',
    imports: [CommonModule, RouterLink, AgePipe, ReactiveFormsModule]
})
export class UserProfileComponent implements OnInit{

  imageUrl: string | undefined;
  NewPet?: IPet;
  newPetForm: FormGroup;
  petDetailsForm: FormGroup;
  ToBeUpdatedPet?: IPet;
  // user!: User ;
  pets: IPet[] = [];
  petToDelete!: IPet;
  user!: any;

  constructor(private petsService: PetsService, private auth:AuthService, private router:Router, private fb:FormBuilder) {
    this.newPetForm = this.fb.group({
      PetName: [this.NewPet?.PetName],
      Species: [this.NewPet?.Species],
      Breed: [this.NewPet?.Breed],
      BloodGroup: [this.NewPet?.BloodGroup],
      Gender: [this.NewPet?.Gender],
      DateOfBirth: [this.NewPet?.DateOfBirth],
      Neutered: [this.NewPet?.Neutered],
      Allergies: [this.NewPet?.Allergies]
    });

    this.petDetailsForm = this.fb.group({
      PetName: [this.ToBeUpdatedPet?.PetName],
      Species: [this.ToBeUpdatedPet?.Species],
      Breed: [this.ToBeUpdatedPet?.Breed],
      BloodGroup: [this.ToBeUpdatedPet?.BloodGroup],
      Gender: [this.ToBeUpdatedPet?.Gender],
      DateOfBirth: [this.ToBeUpdatedPet?.DateOfBirth],
      Neutered: [this.ToBeUpdatedPet?.Neutered],
      Allergies: [this.ToBeUpdatedPet?.Allergies]
    });
   }

  ngOnInit(): void {
    console.log("ngOnInit() is called");

    if(this.auth.isLoggedIn()){
      this.user = this.auth.getLoggedInUserObject()
    }

    // this.petsService.getUser().subscribe((data) => {
    //   this.user = data;
    // })

    this.petsService.GetPetsByParentID("1").subscribe((data) => {
      this.pets = data;
    })
    if (this.NewPet) {
      this.newPetForm.patchValue(this.NewPet);
    }
    if (this.NewPet)
      this.displayImage(this.NewPet?.PetImage)

  }

  setPetToDelete(pet: IPet, event: MouseEvent) {
    event.stopPropagation();
    this.petToDelete = pet;
    this.openDeleteModal();
  }

  deleteConfirmedPet(event: MouseEvent){
    event.stopPropagation();
    if(this.petToDelete){
      this.petsService.DeletePetByPetID(this.petToDelete.PetID).subscribe(() => {

      });
    }
    this.closeDeleteModal(event);
  }



  testClick() {
    alert("Pet Card clicked");
  }

  toggleDropdown(event: MouseEvent) {
    event.stopPropagation();// This thing is to prevent the card from clicking
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
  }

  preventCardClick(event: MouseEvent) {
    event.stopPropagation();
    console.log("hi");
    }
  preventCardClickEdit($event: MouseEvent,arg1: number) {
    $event.stopPropagation();
    this.petsService.GetPetDetailsByID(arg1).subscribe(
      pet =>{
        this.ToBeUpdatedPet = pet
        console.log(this.ToBeUpdatedPet)
        this.petDetailsForm.patchValue(this.ToBeUpdatedPet)
        console.log(pet)
      },
      error=>{
        console.log(error)
      });
      
    if(this.ToBeUpdatedPet)
      this.petDetailsForm.patchValue(this.ToBeUpdatedPet)
      console.log(this.petDetailsForm.value )
    }

  OnLogout() {
    this.auth.logOut()
    this.router.navigate(['/']);
    }

    onSubmitAdd(): void {
      // Handle form submission
      if (this.newPetForm.valid) {
        // Update ToBeUpdatedPet with form values
        this.NewPet = {
          ...this.NewPet,
          ...this.newPetForm.value
        };
        this.SavePetDetails()
      }
    }
    onSubmitEdit(): void {
      if (this.petDetailsForm.valid) {
        // Update ToBeUpdatedPet with form values
        this.ToBeUpdatedPet = {
          ...this.ToBeUpdatedPet,
          ...this.petDetailsForm.value
        };
        this.SaveUpdatedPetDetails()       
      }
    }
    handleFileAdd(event: any): void {
      const files: FileList = event.target.files;
      if (files && files.length > 0) {
        const file: File = files[0];
        this.convertImageToBase64(file, 0);
      }
    }
    handleFileEdit(event: any): void {
      const files: FileList = event.target.files;
      if (files && files.length > 0) {
        const file: File = files[0];
        this.convertImageToBase64(file,1);
      }
    }
    convertImageToBase64(file: File, bias:number): void {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String: string | null = e.target?.result as string;
        if (base64String) {
          // Store the base64String in your object or send it to the backend
          if(bias == 0){
            this.NewPet!.PetImage = base64String;
          }
          if(bias == 1){
            this.ToBeUpdatedPet!.PetImage = base64String;
          }
          this.displayImage(base64String);
        }
      };
      reader.readAsDataURL(file);
    }
    displayImage(base64String: string): void {
      this.imageUrl = base64String;
      console.log(this.imageUrl);
    }
    SavePetDetails() {
      console.log(this.NewPet)
      this.petsService.AddPet(this.NewPet!).subscribe({
        next: updatedPet => {
          // Handle success, if needed
          console.log('Pet updated successfully:', updatedPet);
        },
        error: error => {
          // Handle error, if needed
          console.error('Error updating pet:', error);
        }
      });
    }
    
      SaveUpdatedPetDetails() {
        console.log(this.ToBeUpdatedPet)
        this.petsService.EditPet(this.ToBeUpdatedPet!).subscribe({
          next: updatedPet => {
            // Handle success, if needed
            console.log('Pet updated successfully:', updatedPet);
        },
        error: error => {
            // Handle error, if needed
            console.error('Error updating pet:', error);
        }
      });
  
    }
}

