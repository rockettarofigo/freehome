import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LightComponent } from './components/light/light.component';
import { ShutterComponent } from './components/shutter/shutter.component';
import { TvComponent } from './components/tv/tv.component';
import { CamsComponent } from './components/cams/cams.component';
import { SolarComponent } from './components/solar/solar.component';
import { AirconComponent } from './components/aircon/aircon.component';
import { SettingsComponent } from './components/settings/settings.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'light', component: LightComponent },
  { path: 'shutter', component: ShutterComponent },
  { path: 'tv', component: TvComponent },
  { path: 'cams', component: CamsComponent },
  { path: 'solar', component: SolarComponent },
  { path: 'aircon', component: AirconComponent },
  { path: 'settings', component: SettingsComponent },
  { path: '**', redirectTo: '/dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
