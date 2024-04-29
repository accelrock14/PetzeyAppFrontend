import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AppointmentPetProfileComponent } from './components/Pets/appointment-pet-profile/appointment-pet-profile.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'appointmentPetDetails', component:AppointmentPetProfileComponent }
];
