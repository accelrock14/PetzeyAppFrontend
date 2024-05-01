import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { DoctorDashboardComponent } from './components/dashboard/doctor-dashboard/doctor-dashboard.component';
import { VetComponent } from './components/Vet/vet/vet.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DoctorDashboardComponent, RouterLinkActive,RouterLink,VetComponent],
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
