import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  menuItems = [
    { name: 'Lights', icon: '💡', route: '/light', description: 'Control your smart lights' },
    { name: 'Shutters', icon: '🪟', route: '/shutter', description: 'Open or close blinds' },
    { name: 'TV', icon: '📺', route: '/tv', description: 'Manage TV and Firestick' },
    { name: 'Cameras', icon: '📹', route: '/cams', description: 'Live security feeds' },
    { name: 'Solar', icon: '☀️', route: '/solar', description: 'Monitor solar production' },
    { name: 'Aircon', icon: '❄️', route: '/aircon', description: 'Climate control' },
    { name: 'Settings', icon: '⚙️', route: '/settings', description: 'Device configuration' }
  ];
  
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
        // data is { "light": {...}, "shutter": {...}, "tv": {...} }
        this.stats.lights = Object.keys(data.light || {}).length;
        this.stats.shutters = Object.keys(data.shutter || {}).length;
        this.stats.tvs = Object.keys(data.tv || {}).length;
      },
      error => console.error('Error loading stats', error)
    );
  }

  updateTime(): void {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}
