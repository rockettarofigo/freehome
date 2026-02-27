import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:8000'; // FastAPI address

  constructor(private http: HttpClient) { }

  controlLight(room: string, onoff: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/light`, { light: room, onoff });
  }

  controlShutter(shutter: string, percentage: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/shutter`, { shutter, percentage });
  }

  shutterStartStop(shutter: string, startstop: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/shutterstartstop`, { shutter, startstop });
  }

  controlTv(channel: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/tv`, { channel });
  }

  getDevicesList(light?: string, shutter?: string, tv?: string): Observable<any> {
    const payload: any = {};
    if (light) payload.light = light;
    if (shutter) payload.shutter = shutter;
    if (tv) payload.tv = tv;
    return this.http.post(`${this.apiUrl}/getdeviceslist`, payload);
  }

  newDevice(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/newdevice`, data);
  }

  deleteDevice(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/deletedevice`, data);
  }
}
