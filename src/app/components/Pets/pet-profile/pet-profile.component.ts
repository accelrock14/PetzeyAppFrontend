import { Component, Input, OnInit } from '@angular/core';
import { IPet } from '../../../models/Pets/IPet';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AgePipe } from "../../../pipes/Age/age.pipe";
import { PetsService } from '../../../services/PetsServices/pets.service';
import { ReportHistoryComponent } from '../../appointments/report-history/report-history.component';

@Component({
    selector: 'app-pet-profile',
    standalone: true,
    templateUrl: './pet-profile.component.html',
    styleUrl: './pet-profile.component.css',
    imports: [AgePipe, ReportHistoryComponent]
})
export class PetProfileComponent implements OnInit {

  constructor(private petsService: PetsService,private activatedRoute : ActivatedRoute){

  }




  // id:string |null ="";
  ngOnInit(): void {

   const id = (this.activatedRoute.snapshot.paramMap.get('id'))
   console.log(id);
   this.petsService.GetPetDetailsByID(Number(id)).subscribe( pet =>
     {
      this.Pet = pet
      console.log(pet.PetName);
      console.log(this.Pet.PetName);
    });


  }

  Pet:IPet = {} as IPet;

  Owner = {
    ownerName: "Jack Hall",
    email: "jhondoe@gmail.com",
    address: "Bangalore, Karnataka, 560102",
    phoneNo : "+44 2071838750"
  }

}
