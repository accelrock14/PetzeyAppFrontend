import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IVetProfileDTO } from '../../../models/Vets/IVetProfileDto';
import { VetsserviceService } from '../../../services/VetsServices/vetsservice.service';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IVet } from '../../../models/Vets/IVet';
import { Observable } from 'rxjs/internal/Observable';
import { VetAppointmentListComponent } from "../vet-appointment-list/vet-appointment-list.component";
import { AuthService } from '../../../services/UserAuthServices/auth.service';

@Component({
    selector: 'app-vet-profile',
    standalone: true,
    templateUrl: './vet-profile.component.html',
    styleUrl: './vet-profile.component.css',
    imports: [NgbModule, FormsModule, CommonModule, VetAppointmentListComponent]
})
export class VetProfileComponent implements OnInit {

  @ViewChild('successMessage') successMessage!: ElementRef;
  @ViewChild('deleteMessage') deleteMessage!: boolean;

  actualVet?:IVet;
  VetNPI:any;
// updateVet(vetid: number,vetPro: IVetProfileDTO) {
//   const fullVet:IVet=this.vetService.getFullVetById(vetid).subscribe(v=>this.actualVet=v);
//   fullVet.subscribe(vet=>{this.actualVet=fullVet});
//   this.vetService.updateVet(vetid,fullVet).subscribe();
// }
updateVet(vetid: number, vetPro: IVetProfileDTO) {
  // Fetch the full vet profile
  this.vetService.getFullVetById(vetid).subscribe((fullVet: IVet) => {
    // Update the matching attributes with values from vetPro
    Object.keys(vetPro).forEach(key => {
      if (fullVet.hasOwnProperty(key)) {
        // Type assertion to inform TypeScript about the types
        (fullVet as any)[key] = vetPro[key];
      }
    });

    // Pass the updated vet profile to the updateVet function
    this.vetService.updateVet(vetid, fullVet).subscribe(() => {
      // Optionally, you can perform any post-update actions here
      alert("Successfully Saved the Changes");
    });
  });
}
deleteVet(vetId:number){
  this.vetService.deleteVet(vetId).subscribe();
  this.deleteMessage = true;
  setTimeout(() => {
    this.router.navigate(['/vet']);
  }, 2000);
}


editVetProfile() {
throw new Error('Method not implemented.');
}
  vetProfile?: IVetProfileDTO;

  constructor(private route: ActivatedRoute, private vetService: VetsserviceService, private modalService: NgbModal, private router: Router,public auth: AuthService) { }
  // 
  ngOnInit(): void {
    // Get the vet ID from the route parameter
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam !== null) {
      const vetId = parseInt(idParam);
      // Fetch vet profile details by ID
      this.vetService.getVetById(vetId).subscribe(profile => {
        this.vetProfile = profile;
        console.log(this.vetProfile)
      });
    } else {
      // Handle the case when the route parameter is null
      console.error('Vet ID parameter is null.');
    }
    if (this.auth.isLoggedIn()) {
      this.actualVet = this.auth.getLoggedInUserObject()
    }
    this.VetNPI=this.auth.getVPIFromToken()
    console.log(this.VetNPI)

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
