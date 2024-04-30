import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IVetProfileDTO } from '../../../models/Vets/IVetProfileDto';
import { VetsserviceService } from '../../../services/VetsServices/vetsservice.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditModalComponent } from '../edit-modal/edit-modal.component';

@Component({
  selector: 'app-vet-profile',
  standalone: true,
  imports: [],
  templateUrl: './vet-profile.component.html',
  styleUrl: './vet-profile.component.css'
})
export class VetProfileComponent implements OnInit {
editVetProfile() {
throw new Error('Method not implemented.');
}
  vetProfile?: IVetProfileDTO;

  constructor(private route: ActivatedRoute, private vetService: VetsserviceService,private modalService: NgbModal) { }

  ngOnInit(): void {
    // Get the vet ID from the route parameter
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam !== null) {
      const vetId = parseInt(idParam);
      // Fetch vet profile details by ID
      this.vetService.getVetById(vetId).subscribe(profile => {
        this.vetProfile = profile;
      });
    } else {
      // Handle the case when the route parameter is null
      console.error('Vet ID parameter is null.');
    }
  }
  openEditModal(): void {
    const modalRef = this.modalService.open(EditModalComponent, { size: 'lg' });
    // You can pass data to the modal using modalRef.componentInstance
    // For example:
    // modalRef.componentInstance.vetProfile = this.vetProfile;
    
    modalRef.result.then((result) => {
      // Handle modal close (e.g., save changes)
      console.log('Modal closed with result:', result);
    }, (reason) => {
      // Handle modal dismiss (e.g., cancel editing)
      console.log('Modal dismissed with reason:', reason);
    });
  }
  

}
