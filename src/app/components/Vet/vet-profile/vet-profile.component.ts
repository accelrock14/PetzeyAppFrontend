import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IVetProfileDTO } from '../../../models/Vets/IVetProfileDto';
import { VetsserviceService } from '../../../services/VetsServices/vetsservice.service';

@Component({
  selector: 'app-vet-profile',
  standalone: true,
  imports: [],
  templateUrl: './vet-profile.component.html',
  styleUrl: './vet-profile.component.css'
})
export class VetProfileComponent implements OnInit {
  vetProfile?: IVetProfileDTO;

  constructor(private route: ActivatedRoute, private vetService: VetsserviceService) { }

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
