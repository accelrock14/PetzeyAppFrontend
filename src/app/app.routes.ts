import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AppointmentPetProfileComponent } from './components/Pets/appointment-pet-profile/appointment-pet-profile.component';
import { CreateOrEditPetComponent } from './components/Pets/create-or-edit-pet/create-or-edit-pet.component';

export const routes: Routes = [
    {
        path: '', component: HomeComponent
    },
    {
        path:'createandedittemp', component:CreateOrEditPetComponent
    },
    { path: 'appointmentPetDetails', component:AppointmentPetProfileComponent }
];
