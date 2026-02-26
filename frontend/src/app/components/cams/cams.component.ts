import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cams',
  templateUrl: './cams.component.html',
  styleUrls: ['./cams.component.css']
})
export class CamsComponent implements OnInit {
  cams = [0, 1, 2, 3, 4, 5];
  baseUrl = 'http://localhost:8000'; // FastAPI address

  constructor() { }

  ngOnInit(): void {
  }

  handleError(event: any, camId: number): void {
    console.log(`Camera ${camId} not available`);
    event.target.style.display = 'none';
  }
}
