import { Component, OnInit } from '@angular/core';
import { IPet } from '../../../models/Pets/IPet';
import { PetsService } from '../../../services/PetsServices/pets.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit{
  // user!: User ;
  pets: IPet[] = [];
  petToDelete!: IPet;

  constructor(private petsService: PetsService) { }

  ngOnInit(): void {
    console.log("ngOnInit() is called");

    // this.petsService.getUser().subscribe((data) => {
    //   this.user = data;
    // })

    this.petsService.GetPetsByParentID(1).subscribe((data) => {
      this.pets = data;
    })

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
  
}
