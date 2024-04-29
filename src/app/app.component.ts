import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { DoctorDashboardComponent } from './components/dashboard/doctor-dashboard/doctor-dashboard.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, DoctorDashboardComponent],
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
