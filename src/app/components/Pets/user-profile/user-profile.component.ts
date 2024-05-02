import { Component, OnInit } from '@angular/core';
import { IPet } from '../../../models/Pets/IPet';
import { PetsService } from '../../../services/PetsServices/pets.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/UserAuthServices/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit{

  // user!: User ;
  pets: IPet[] = [];
  petToDelete!: IPet;
  user!: any;

  constructor(private petsService: PetsService, private auth:AuthService, private router:Router) { }

  ngOnInit(): void {
    console.log("ngOnInit() is called");

    if(this.auth.isLoggedIn()){
      this.user = this.auth.getLoggedInUserObject()
    }

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

  preventCardClick(event: MouseEvent) {
    event.stopPropagation();
    console.log("hi");
    }

  OnLogout() {
    this.auth.logOut()
    this.router.navigate(['/']);
    }

}

