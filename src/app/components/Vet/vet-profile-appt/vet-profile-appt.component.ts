import { Component } from '@angular/core';
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
  
  }

