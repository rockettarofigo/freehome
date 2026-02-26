import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  stats = {
    lights: 0,
    shutters: 0,
    tvs: 0
  };
  currentTime: string = '';

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.loadStats();
    this.updateTime();
    setInterval(() => this.updateTime(), 1000);
  }

  loadStats(): void {
    this.apiService.getDevicesList('all', 'all', 'all').subscribe(
      (data: any) => {
        this.stats.lights = Object.keys(data.light || {}).length;
        this.stats.shutters = Object.keys(data.shutter || {}).length;
        this.stats.tvs = Object.keys(data.tv || {}).length;
      },
      error => console.error('Error loading stats', error)
    );
  }

  updateTime(): void {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString();
  }
}
