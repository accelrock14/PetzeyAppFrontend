import { Component, OnInit } from '@angular/core';
import {  NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { EditAppointmentFormComponent } from "./components/edit-appointment-form/edit-appointment-form.component";
import { NewAppointmentFormComponent } from './components/new-appointment-form/new-appointment-form.component';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/UserAuthServices/auth.service';
import { VetComponent } from './components/Vet/vet/vet.component';
import { DoctorDashboardComponent } from './components/dashboard/doctor-dashboard/doctor-dashboard.component';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [RouterOutlet, RouterLink, EditAppointmentFormComponent, NewAppointmentFormComponent,CommonModule, DoctorDashboardComponent,VetComponent]
})
export class AppComponent implements OnInit{
  userRole: string = '';
  selectedLink: string = '';
  constructor(private router: Router,public auth:AuthService) { // Inject Router here
  }
  ngOnInit() {

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const url = event.urlAfterRedirects;
        this.selectedLink = this.getLinkFromUrl(url); // Define function to extract link from URL
      }
    });

  }
  getLinkFromUrl(url: string): string {
    return url.split('/')[1]; // Assuming links are in format "/link-identifier"
  }
  title = 'PetzeyAppFrontend';

  expand: boolean = false;

  onExpand() {
    this.expand = !this.expand;
  }
  isSelected(link: string): boolean {
    return this.selectedLink === link;
}
}
