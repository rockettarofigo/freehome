import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-light',
  templateUrl: './light.component.html',
  styleUrls: ['./light.component.css']
})
export class LightComponent implements OnInit {
  lights: any[] = [];
  loading = false;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.loadLights();
  }

  loadLights(): void {
    this.loading = true;
    this.apiService.getDevicesList('all').subscribe(
      (data: any) => {
        // Assume data is an array of light names from the response
        // Based on the backend, getdeviceslist returns what hosts.getdeviceslist returns.
        this.lights = Object.keys(data.light || {}).map(key => ({
          name: key,
          status: 'off' // Default status as we don't have real-time state yet
        }));
        this.loading = false;
      },
      error => {
        console.error('Error loading lights', error);
        this.loading = false;
      }
    );
  }

  toggleLight(light: any, state: string): void {
    light.status = state;
    this.apiService.controlLight(light.name, state).subscribe(
      response => console.log(`Light ${light.name} set to ${state}`, response),
      error => console.error('Error controlling light', error)
    );
  }
}
