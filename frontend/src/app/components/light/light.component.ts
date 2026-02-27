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
        // data is now { "name": "ip", ... }
        this.lights = Object.keys(data).map(key => ({
          name: key,
          status: 'off'
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
