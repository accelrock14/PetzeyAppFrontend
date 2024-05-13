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
import { ToastrService, provideToastr } from 'ngx-toastr';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';

bootstrapApplication(Component, {
  providers: [
    provideToastr({
      timeOut: 100
    }), 
    provideAnimations(), // required animations providers
  ]
});

@Component({
    selector: 'app-vet-profile',
    standalone: true,
    templateUrl: './vet-profile.component.html',
    styleUrl: './vet-profile.component.css',
    imports: [NgbModule, FormsModule, CommonModule, VetAppointmentListComponent]
})
export class VetProfileComponent implements OnInit {
setActive(id:number|undefined)
{
  this.vetService.SetActive(id!,true).subscribe(p=>{
    console.log("Activated")
    alert("Vet Status Activated")
    this.router.navigate(['/vet'])
  });
}

  @ViewChild('successMessage') successMessage!: ElementRef;

  actualVet?:IVet;
  VetNPI:any;
  selectedFile: File | null = null;

constructor(private route: ActivatedRoute, private vetService: VetsserviceService, private modalService: NgbModal, private router: Router,public auth: AuthService,private toastr: ToastrService,) { }


  

  



editVetProfile() {
throw new Error('Method not implemented.');
}
  vetProfile?: IVetProfileDTO;

  role:any;
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

    this.role=this.auth.getRoleFromToken();

    
    if (this.auth.isLoggedIn()) {
    this.VetNPI=this.auth.getVPIFromToken()
    this.vetService.getVetsByNPINumber(this.VetNPI).subscribe((data) =>{
      this.actualVet=data;
    })
  }

    }
    
  imageSrc: string | ArrayBuffer | null = null;
  onImageSelected(event: any): void {
    console.log('File selected');
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file; // Update the component-level variable
      const reader = new FileReader();
      reader.onload = (e: any) => this.imageSrc = e.target.result; // For image preview
      reader.readAsDataURL(file);
    }
  }
  goToVet(){
    this.router.navigate(['/vet']);
  
  }
  updateVet(vetId: number, vetPro: IVetProfileDTO) {
    // Fetch the full vet profile first
    this.vetService.getFullVetById(vetId).subscribe({
      next: (fullVet: IVet) => {
        // Update the matching attributes with values from vetPro
        Object.keys(vetPro).forEach(key => {
          if (fullVet.hasOwnProperty(key)) {
            (fullVet as any)[key] = vetPro[key];  // Type assertion to inform TypeScript
          }
        });
  
        // Check if a new file has been selected for upload
        if (this.selectedFile) {
          // Upload the photo first
          this.vetService.uploadPhoto(vetId, this.selectedFile).subscribe({
            next: (response) => {
              console.log('File uploaded successfully:', response);
              // Update the Photo property in the vetProfile
              fullVet.Photo = `${response.fileName}`;
              console.log('Full Vet: ',fullVet)// Update with the new photo URL
              //this.vetProfile!.Photo = fullVet.Photo;
              // After successful photo upload, update the other profile details
              this.sendProfileUpdate(vetId, fullVet);
              this.selectedFile= null;
            },
            error: (error) => {
              console.error('Error uploading file:', error);
              // Optionally, handle the error specific to file upload
            }
          });
        } else {
          // If no file is selected, directly update the profile
          this.sendProfileUpdate(vetId, fullVet);
          console.log('In update',fullVet);
        }
      },
      error: (error) => {
        console.error('Error fetching vet details:', error);
        // Optionally, handle the error specific to fetching details
      }
    });
  }
  
  private sendProfileUpdate(vetId: number, fullVet: IVet) {
    this.vetService.updateVet(vetId, fullVet).subscribe({
      next: () => {
        alert("Successfully Saved the Changes");
        console.log('sendprofile',fullVet)
        // Optionally, perform any other post-update actions here
      },
      error: (error) => {
        console.error('Error updating vet profile:', error);
        // Optionally, handle the error specific to profile update
      }
    });
    console.log('after sending', fullVet)
    console.log(this.vetService.getFullVetById(vetId).subscribe())
  }

  //Added
  // v:boolean=false;
  // CheckNpiNumber(npi:string):boolean{

  //   return this.vetService.checkNpi(npi)
  // }
  
  // decideDestiny():void{
  //   if(this.auth.isLoggedIn()){
  //     if(this.auth.getRoleFromToken()=="Doctor"){
  //       if(this.CheckNpiNumber(this.auth.getVPIFromToken())){
  //         this.router.navigate(['/home']);
  //       }
  //       else{
  //         this.auth.logOut();
  //         this.router.navigate(['/signin'])
  //       }
  //     }
  //   }
  // }
  //Ended
  deleteVet(vetId:number){
    this.vetService.deleteVet(vetId).subscribe({
      next: () => {
        alert('Vet deleted');
        this.router.navigate(['/vet']);
      },
      error: (error) => {
        console.error('Error updating vet profile:', error);
        // Optionally, handle the error specific to profile update
      }
    });
    

  }
}
