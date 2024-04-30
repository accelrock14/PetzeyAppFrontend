import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { VetComponent } from './components/Vet/vet/vet.component';
import { VetProfileModalComponent } from './components/Vet/vet-profile-modal/vet-profile-modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,RouterLink,VetComponent,VetProfileModalComponent],
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
