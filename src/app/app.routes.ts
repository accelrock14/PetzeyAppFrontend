import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { VetComponent } from './components/Vet/vet/vet.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    {path:'vet', component:VetComponent}
];
