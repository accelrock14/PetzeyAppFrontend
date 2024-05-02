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
import { SigninComponent } from './components/user-authentiaction/signin/signin.component';
import { VetComponent } from './components/Vet/vet/vet.component';
import { VetProfileComponent } from './components/Vet/vet-profile/vet-profile.component';
import { AddVetComponent } from './components/Vet/add-vet/add-vet.component';
import { NewAppointmentFormComponent } from './components/new-appointment-form/new-appointment-form.component';
import { EditAppointmentFormComponent } from './components/edit-appointment-form/edit-appointment-form.component';

import { CreatePetComponent } from './components/Pets/create-pet/create-pet.component';
import { VetProfileApptComponent } from './components/Vet/vet-profile-appt/vet-profile-appt.component';
import { doctorGuard } from './guards/doctor.guard';
import { receptionistGuard } from './guards/receptionist.guard';
import { loggedInGuard } from './guards/logged-in.guard';
VetProfileApptComponent
export const routes: Routes = [
  { path: 'home', component: HomeComponent },
    { path: '',redirectTo:'home', pathMatch:'full' },
    { path: 'AdminDashboard/details/:id', component: DetailsComponent},
    { path: 'DoctorDashboard/details/:id', component: DetailsComponent},
    { path: 'PatientDashboard/details/:id', component: DetailsComponent},
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
    path: 'pets-list/:page',
    component: PetsListGridComponent,
  },
  {
    path: 'pets-list/:page/pets-profile/:id',
    component: PetProfileComponent,
  },
  {
    path: 'profile/pets-profile/:id',
    component: PetProfileComponent,
  },
  { path: 'pets/:page', component: PetsListGridPagedComponent }, // Route for the component with page number parameter

  { path: 'appointmentPetDetails', component: AppointmentPetProfileComponent },

  { path: 'user', component: UserProfileComponent },
  {
    path: 'editpet/:id',
    component: CreateOrEditPetComponent,
  },
  {
      path: 'newPet', component:CreatePetComponent
  },
  {
    path: 'profile',
    component: UserProfileComponent,
    title: "UserProfile",
  },
  {
    path: 'signin',
    component: SigninComponent,
    title: "SignIn",
  },
  {path:'add-vet',component:AddVetComponent,canActivate:[loggedInGuard,receptionistGuard]},
  {path:'vet', component:VetComponent},

  {path:'vet-profile/:id', component:VetProfileComponent,title:'VetProfile'},

  {
    path:'addAppointment',component:NewAppointmentFormComponent
  },
  {
    path:'editAppointment/:AppointmentID',component:EditAppointmentFormComponent
  }
];
