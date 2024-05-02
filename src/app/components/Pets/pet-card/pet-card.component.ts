import { IPet } from './../../../models/Pets/IPet';
import { Component, Input } from '@angular/core';
import { AgePipe } from "../../../pipes/Age/age.pipe";
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-pet-card',
    standalone: true,
    templateUrl: './pet-card.component.html',
    styleUrl: './pet-card.component.css',
    imports: [AgePipe,RouterLink]
})
export class PetCardComponent {


  @Input()
  pet:IPet = {} as IPet;

  

}
