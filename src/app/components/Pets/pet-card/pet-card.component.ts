import { IPet } from './../../../models/Pets/IPet';
import { Component, Input } from '@angular/core';
import { AgePipe } from "../../../pipes/Age/age.pipe";
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/UserAuthServices/auth.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-pet-card',
    standalone: true,
    templateUrl: './pet-card.component.html',
    styleUrl: './pet-card.component.css',
    imports: [AgePipe,RouterLink,CommonModule]
})
export class PetCardComponent {

 // users:any[]=[];
  petOwner:string="";

  constructor( private authService: AuthService){}

  @Input()
  pet:IPet = {} as IPet;

  ngOnInit()
  {

    this.authService.getUserByID(this.pet.PetParentID).subscribe( (username) =>
     {
      console.log(username);
        this.petOwner=username;
     }
    )
  }

}
