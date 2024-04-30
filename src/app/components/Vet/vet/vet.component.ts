import { Component } from '@angular/core';
import { IVetCardDTO } from '../../../models/Vets/IVetCardDto';
import { VetsserviceService } from '../../../services/VetsServices/vetsservice.service';
import { CommonModule } from '@angular/common';
import { IVetProfileDTO } from '../../../models/Vets/IVetProfileDto';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'; 
import { VetProfileModalComponent } from '../vet-profile-modal/vet-profile-modal.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vet',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vet.component.html',
  styleUrl: './vet.component.css'
})
export class VetComponent {

  vets: IVetCardDTO[] = [];

  constructor(private vetService: VetsserviceService,private router: Router) { }

  ngOnInit(): void {
    this.getAllVets();
  }

  getAllVets(): void {
    this.vetService.getAllVets()
      .subscribe(
        (vets: IVetCardDTO[]) => {
          this.vets = vets;
          console.log(this.vets)
        },
        error => {
          console.error('Error fetching vets:', error);
        }
      );
  }
  openVetProfile(id: number): void {
    // Fetch vet profile details by ID
    this.vetService.getVetById(id).subscribe(profile => {
      this.router.navigate(['/vet-profile', id]);
     
      
    });
  }
}
