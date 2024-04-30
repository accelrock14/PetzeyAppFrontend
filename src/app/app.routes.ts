import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { VetComponent } from './components/Vet/vet/vet.component';
import { VetProfileComponent } from './components/Vet/vet-profile/vet-profile.component';
import { AddVetComponent } from './components/Vet/add-vet/add-vet.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    {path:'vet', component:VetComponent},
    {path:'vet-profile/:id', component:VetProfileComponent,title:'VetProfile'},
    {path:'add-vet',component:AddVetComponent}
];
