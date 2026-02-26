import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-tv',
  templateUrl: './tv.component.html',
  styleUrls: ['./tv.component.css']
})
export class TvComponent implements OnInit {
  channels = [
    { name: 'netflix', icon: '🎬' },
    { name: 'kodi', icon: '📦' },
    { name: 'disney', icon: '🏰' }
  ];

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
  }

  setChannel(channel: string): void {
    this.apiService.controlTv(channel).subscribe(
      response => console.log(`TV channel set to ${channel}`, response),
      error => console.error('Error controlling TV', error)
    );
  }
}
