import { Component, Input, OnInit } from '@angular/core';
import { IPet } from '../../../models/Pets/IPet';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AgePipe } from '../../../pipes/Age/age.pipe';
import { PetsService } from '../../../services/PetsServices/pets.service';
import { ReportHistoryComponent } from '../../appointments/report-history/report-history.component';
import { DatePipe, NgIf, formatDate } from '@angular/common';
import { FormatDatePipe } from '../../../pipes/Date/format-date.pipe';
import { PetAppointmentsListComponent } from '../pet-appointments-list/pet-appointments-list.component';
import { AuthService } from '../../../services/UserAuthServices/auth.service';

@Component({
  selector: 'app-pet-profile',
  standalone: true,
  templateUrl: './pet-profile.component.html',
  styleUrl: './pet-profile.component.css',
  imports: [
    AgePipe,
    FormatDatePipe,
    DatePipe,
    NgIf,
    RouterLink,
    ReportHistoryComponent,
    PetAppointmentsListComponent,
  ],
})
export class PetProfileComponent implements OnInit {
  Owner: any | null;
  constructor(
    private petsService: PetsService,
    private activatedRoute: ActivatedRoute,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    if (this.auth.isLoggedIn()) {
      this.Owner = this.auth.getLoggedInUserObject();
      console.log(this.Owner);
    }

    const id = this.activatedRoute.snapshot.paramMap.get('id');
    console.log(id);
    this.petsService.GetPetDetailsByID(Number(id)).subscribe((pet) => {
      this.Pet = pet;
      console.log(pet.PetName);
      console.log(this.Pet.PetID);
    });
  }

  Pet: IPet = {} as IPet;
}
