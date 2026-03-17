import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-tv',
  templateUrl: './tv.component.html',
  styleUrls: ['./tv.component.css']
})
export class TvComponent implements OnInit {
  tvs: any[] = [];
  loading = false;
  
  // These are the actions/apps we can launch on the Firestick
  channels = [
    { name: 'netflix', icon: '🎬' },
    { name: 'kodi', icon: '📦' },
    { name: 'disney', icon: '🏰' }
  ];

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.loadTvs();
  }

  loadTvs(): void {
    this.loading = true;
    this.apiService.getDevicesList(undefined, undefined, 'all').subscribe(
      (data: any) => {
        this.tvs = Object.keys(data).map(key => ({
          name: key,
          ip: data[key]
        }));
        this.loading = false;
      },
      error => {
        console.error('Error loading TVs', error);
        this.loading = false;
      }
    );
  }

  setChannel(channel: string): void {
    this.apiService.controlTv(channel).subscribe(
      response => console.log(`TV channel set to ${channel}`, response),
      error => console.error('Error controlling TV', error)
    );
  }
}
