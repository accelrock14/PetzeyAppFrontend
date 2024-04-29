import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { DetailsComponent } from './components/details/details.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'details', component: DetailsComponent},
    // for testing nav-bar, later componenets to be added
    {path:'dashboard',component:HomeComponent,title:'dashboard'},
    {path:'pets',component:HomeComponent,title:'dashboard'},
    {path:'doctors',component:HomeComponent,title:'dashboard'},
    {path:'profile',component:HomeComponent,title:'dashboard'},
    
];
