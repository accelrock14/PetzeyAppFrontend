import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AdminDashboardComponent } from './components/dashboard/admin-dashboard/admin-dashboard.component';
import { DoctorDashboardComponent } from './components/dashboard/doctor-dashboard/doctor-dashboard.component';
import { PatientDashboardComponent } from './components/dashboard/patient-dashboard/patient-dashboard.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: "AdminDashboard", component: AdminDashboardComponent, title: "AdminDashboard" },
    { path: "DoctorDashboard", component: DoctorDashboardComponent, title: "DoctorDashboard" },
    { path: 'PatientDashboard', component: PatientDashboardComponent, title: "PatientDashboard" }
];
