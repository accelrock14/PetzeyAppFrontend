import { Component, Input, OnInit } from '@angular/core';
import { IPet } from '../../../models/Pets/IPet';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pet-profile',
  standalone: true,
  imports: [],
  templateUrl: './pet-profile.component.html',
  styleUrl: './pet-profile.component.css'
})
export class PetProfileComponent implements OnInit {

  constructor(private activatedRoute : ActivatedRoute){

  }

  id:string |null ="";
  ngOnInit(): void {

   this.id = this.activatedRoute.snapshot.paramMap.get('id')
   alert(this.id);

  }

  pet:IPet = {} as IPet;
}
