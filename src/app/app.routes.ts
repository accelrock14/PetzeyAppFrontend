import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';

import { DetailsComponent } from './components/details/details.component';
import { ReportComponent } from './components/appointments/report/report.component';
import { ReportHistoryComponent } from './components/appointments/report-history/report-history.component';
import { AdminDashboardComponent } from './components/dashboard/admin-dashboard/admin-dashboard.component';
import { DoctorDashboardComponent } from './components/dashboard/doctor-dashboard/doctor-dashboard.component';
import { PatientDashboardComponent } from './components/dashboard/patient-dashboard/patient-dashboard.component';

import { AppointmentPetProfileComponent } from './components/Pets/appointment-pet-profile/appointment-pet-profile.component';
import { CreateOrEditPetComponent } from './components/Pets/create-or-edit-pet/create-or-edit-pet.component';
import { PetsListGridComponent } from './components/Pets/pets-list-grid/pets-list-grid.component';
import { UserProfileComponent } from './components/Pets/user-profile/user-profile.component';
import { PetProfileComponent } from './components/Pets/pet-profile/pet-profile.component';
import { PetsListGridPagedComponent } from './components/Pets/pets-list-grid-paged/pets-list-grid-paged.component';
import { VetComponent } from './components/Vet/vet/vet.component';
import { VetProfileComponent } from './components/Vet/vet-profile/vet-profile.component';
import { AddVetComponent } from './components/Vet/add-vet/add-vet.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
    { path: '',redirectTo:'home', pathMatch:'full' },
    { path: 'details', component: DetailsComponent},
  { path: 'report', component: ReportComponent },
  { path: 'reporthistory', component: ReportHistoryComponent },
  {
    path: 'AdminDashboard',
    component: AdminDashboardComponent,
    title: 'AdminDashboard',
  },
  {
    path: 'DoctorDashboard',
    component: DoctorDashboardComponent,
    title: 'DoctorDashboard',
  },
  {
    path: 'PatientDashboard',
    component: PatientDashboardComponent,
    title: 'PatientDashboard',
  },
  {
    path: 'createandedittemp',
    component: CreateOrEditPetComponent,
  },

  {
    path: 'pets-list',
    component: PetsListGridComponent,
  },
  {
    path: 'pets-profile/:id',
    component: PetProfileComponent,
  },
  { path: 'pets/:page', component: PetsListGridPagedComponent }, // Route for the component with page number parameter

  { path: 'appointmentPetDetails', component: AppointmentPetProfileComponent },

  { path: 'user', component: UserProfileComponent },
  {
    path: 'editpet/:id',
    component: CreateOrEditPetComponent,
  },
  {path:'add-vet',component:AddVetComponent},
  {path:'vet', component:VetComponent},
  {path:'vet-profile/:id', component:VetProfileComponent,title:'VetProfile'},
];
