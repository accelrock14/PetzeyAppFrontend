import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ReportComponent } from './components/appointments/report/report.component';
import { ReportHistoryComponent } from './components/appointments/report-history/report-history.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'report', component: ReportComponent },
  { path: 'reporthistory', component: ReportHistoryComponent },
];
