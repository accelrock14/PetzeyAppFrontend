import { Component } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-create-or-edit-pet',
  standalone: true,
  imports: [MatDatepickerModule,MatNativeDateModule, MatFormFieldModule],
  templateUrl: './create-or-edit-pet.component.html',
  styleUrl: './create-or-edit-pet.component.css'
})
export class CreateOrEditPetComponent {

}

