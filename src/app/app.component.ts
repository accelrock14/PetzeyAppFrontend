import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CreateOrEditPetComponent } from './components/Pets/create-or-edit-pet/create-or-edit-pet.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,CreateOrEditPetComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'PetzeyAppFrontend';

  expand: boolean = false;

  onExpand() {
    this.expand = !this.expand;
  }
}
