import { Component } from '@angular/core';
import { IVetCardDTO } from '../../../models/Vets/IVetCardDto';
import { VetsserviceService } from '../../../services/VetsServices/vetsservice.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vet',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vet.component.html',
  styleUrl: './vet.component.css'
})
export class VetComponent {

  vets: IVetCardDTO[] = [];

  constructor(private vetService: VetsserviceService) { }

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





}
