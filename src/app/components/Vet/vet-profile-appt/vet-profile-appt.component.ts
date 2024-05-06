import { Component, Input } from '@angular/core';
import { VetsserviceService } from '../../../services/VetsServices/vetsservice.service';
import { ActivatedRoute } from '@angular/router';
import { IVetProfileDTO } from '../../../models/Vets/IVetProfileDto';

@Component({
  selector: 'app-vet-profile-appt',
  standalone: true,
  imports: [],
  templateUrl: './vet-profile-appt.component.html',
  styleUrl: './vet-profile-appt.component.css'
})
export class VetProfileApptComponent {
    constructor(private route: ActivatedRoute, private vetService: VetsserviceService) { }
    vetProfile?: IVetProfileDTO;
  
    
    ngOnInit(): void {
      
        console.log("vets"+this.VetId);
        this.vetService.getVetById(parseInt(this.VetId)).subscribe(profile => {
          this.vetProfile = profile;
          
        });
      
      console.log("vet here"+this.vetProfile);
    }
    @Input()
    VetId:string = '';
  
  }

