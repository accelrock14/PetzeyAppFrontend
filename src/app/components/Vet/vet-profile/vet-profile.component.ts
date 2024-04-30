import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IVetProfileDTO } from '../../../models/Vets/IVetProfileDto';
import { VetsserviceService } from '../../../services/VetsServices/vetsservice.service';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EditModalComponent } from '../edit-modal/edit-modal.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vet-profile',
  standalone: true,
  imports: [NgbModule, FormsModule, CommonModule],
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
  // openEditModal(): void {
  //   const modalRef = this.modalService.open(EditModalComponent, { size: 'lg' });
  //   // You can pass data to the modal using modalRef.componentInstance
  //   // For example:
  //   // modalRef.componentInstance.vetProfile = this.vetProfile;
    
  //   modalRef.result.then((result) => {
  //     // Handle modal close (e.g., save changes)
  //     console.log('Modal closed with result:', result);
  //   }, (reason) => {
  //     // Handle modal dismiss (e.g., cancel editing)
  //     console.log('Modal dismissed with reason:', reason);
  //   });
  // }
  imageSrc: string | ArrayBuffer | null = null;

  onImageSelected(event: Event): void {
    const element = event.target as HTMLInputElement;
    const file = element.files ? element.files[0] : null;
    if (file) {
      const reader = new FileReader();
      reader.onload = e => this.imageSrc = reader.result; // Update imageSrc to the file's content
      reader.readAsDataURL(file);
    }
  }
  

}
