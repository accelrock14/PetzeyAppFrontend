import { Component, OnInit } from '@angular/core';
import { IVetCardDTO } from '../../../models/Vets/IVetCardDto';
import { VetsserviceService } from '../../../services/VetsServices/vetsservice.service';
import { CommonModule } from '@angular/common';
import { IVetProfileDTO } from '../../../models/Vets/IVetProfileDto';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'; 
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-vet',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './vet.component.html',
  styleUrl: './vet.component.css'
})
export class VetComponent implements OnInit{

  vets: IVetCardDTO[] = [];
  filteredVets: IVetCardDTO[]=[];
  searchQuery: string = '';

  constructor(private vetService: VetsserviceService,private router: Router) { }

  ngOnInit(): void {
    this.getAllVets();
  }

  getAllVets(): void {
    this.vetService.getAllVets()
      .subscribe(
        (vets: IVetCardDTO[]) => {
          this.vets = vets;
          this.filteredVets = [...this.vets]; 
          console.log(this.vets)
        },
        error => {
          console.error('Error fetching vets:', error);
        }
      );
  }
  openVetProfile(id: number): void {
    
      this.router.navigate(['/vet-profile', id]);
     
      
    }
    filterVets(): void {
      // Filter vets based on the searchQuery
      if (this.searchQuery.trim() === '') {
        // If the search query is empty, display all vets
        this.filteredVets = [...this.vets];
      } else {
        this.filteredVets = this.vets.filter(vet =>
          vet.Name.toLowerCase().includes (this.searchQuery.toLowerCase()) ||
          vet.Speciality.toLowerCase().includes (this.searchQuery.toLowerCase()) 
        );
      }
    }
    
  }

