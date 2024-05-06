import { AuthService } from './../../../services/UserAuthServices/auth.service';
import { IPet } from './../../../models/Pets/IPet';
import { Component, Input, OnInit } from '@angular/core';
import { AgePipe } from "../../../pipes/Age/age.pipe";
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EllipsisPipe } from '../../../pipes/Ellipsis/ellipsis.pipe';
import { User } from '../../../models/User-Authentication/User';

@Component({
    selector: 'app-pet-card',
    standalone: true,
    templateUrl: './pet-card.component.html',
    styleUrl: './pet-card.component.css',
    imports: [AgePipe,RouterLink,CommonModule, EllipsisPipe]
})
export class PetCardComponent  {

  // constructor(private authService:AuthService){}
  // users!:any;
  // ngOnInit(){
  //   this.authService.getAllUsers().subscribe(users => {
  //     this.users = users
  //   })

  //   console.log("card"+this.users);
  // }

  @Input()
  pet:IPet = {} as IPet;

  @Input()
  petOwner:string = "";


}


