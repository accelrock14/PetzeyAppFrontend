import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { DetailsComponent } from './components/details/details.component';
import { ReportComponent } from './components/appointments/report/report.component';
import { ReportHistoryComponent } from './components/appointments/report-history/report-history.component';
import { AdminDashboardComponent } from './components/dashboard/admin-dashboard/admin-dashboard.component';
import { DoctorDashboardComponent } from './components/dashboard/doctor-dashboard/doctor-dashboard.component';
import { PatientDashboardComponent } from './components/dashboard/patient-dashboard/patient-dashboard.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'details', component: DetailsComponent},
  { path: 'report', component: ReportComponent },
  { path: 'reporthistory', component: ReportHistoryComponent },
    { path: "AdminDashboard", component: AdminDashboardComponent, title: "AdminDashboard" },
    { path: "DoctorDashboard", component: DoctorDashboardComponent, title: "DoctorDashboard" },
    { path: 'PatientDashboard', component: PatientDashboardComponent, title: "PatientDashboard" }
];
