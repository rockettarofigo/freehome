import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-shutter',
  templateUrl: './shutter.component.html',
  styleUrls: ['./shutter.component.css']
})
export class ShutterComponent implements OnInit {
  shutters: any[] = [];
  loading = false;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.loadShutters();
  }

  loadShutters(): void {
    this.loading = true;
    this.apiService.getDevicesList(undefined, 'all').subscribe(
      (data: any) => {
        this.shutters = Object.keys(data.shutter || {}).map(key => ({
          name: key,
          position: 0
        }));
        this.loading = false;
      },
      error => {
        console.error('Error loading shutters', error);
        this.loading = false;
      }
    );
  }

  setPosition(shutter: any, pos: number): void {
    shutter.position = pos;
    this.apiService.controlShutter(shutter.name, pos).subscribe(
      response => console.log(`Shutter ${shutter.name} set to ${pos}%`, response),
      error => console.error('Error controlling shutter', error)
    );
  }

  control(shutter: any, action: string): void {
    this.apiService.shutterStartStop(shutter.name, action).subscribe(
      response => console.log(`Shutter ${shutter.name} action: ${action}`, response),
      error => console.error('Error controlling shutter', error)
    );
  }
}
