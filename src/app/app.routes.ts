import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AppointmentPetProfileComponent } from './components/Pets/appointment-pet-profile/appointment-pet-profile.component';
import { CreateOrEditPetComponent } from './components/Pets/create-or-edit-pet/create-or-edit-pet.component';
import { PetsListGridComponent } from './components/Pets/pets-list-grid/pets-list-grid.component';
import { PetsListGridWithPagesComponent } from './components/Pets/pets-list-grid-with-page/pets-list-grid-with-page.component';

export const routes: Routes = [
    {
        path: '', component: HomeComponent
    },
    {
        path:'createandedittemp', component:CreateOrEditPetComponent
    },

    {
      path:'pets', component:PetsListGridComponent
    },
    { path: 'pets/:page', component: PetsListGridWithPagesComponent }, // Route for the component with page number parameter

    { path: 'appointmentPetDetails', component:AppointmentPetProfileComponent }

];
