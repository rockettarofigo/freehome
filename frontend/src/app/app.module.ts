import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LightComponent } from './components/light/light.component';
import { ShutterComponent } from './components/shutter/shutter.component';
import { TvComponent } from './components/tv/tv.component';
import { CamsComponent } from './components/cams/cams.component';
import { SettingsComponent } from './components/settings/settings.component';
import { SolarComponent } from './components/solar/solar.component';
import { AirconComponent } from './components/aircon/aircon.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    LightComponent,
    ShutterComponent,
    TvComponent,
    CamsComponent,
    SettingsComponent,
    SolarComponent,
    AirconComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
