import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  deviceType = 'light';
  deviceName = '';
  deviceIp = '';
  message = '';
  isError = false;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
  }

  saveDevice(): void {
    if (!this.deviceName || !this.deviceIp) {
      this.showMessage('Please fill all fields', true);
      return;
    }

    const data: any = {
      ip: this.deviceIp,
      [this.deviceType]: this.deviceName
    };

    this.apiService.newDevice(data).subscribe(
      () => {
        this.showMessage('Device saved successfully!');
        this.clearForm();
      },
      err => this.showMessage('Error saving device: ' + err.message, true)
    );
  }

  deleteDevice(): void {
    if (!this.deviceName) {
      this.showMessage('Please enter the device name to delete', true);
      return;
    }

    const data: any = {
      [this.deviceType]: this.deviceName
    };

    this.apiService.deleteDevice(data).subscribe(
      () => {
        this.showMessage('Device deleted successfully!');
        this.clearForm();
      },
      err => this.showMessage('Error deleting device: ' + err.message, true)
    );
  }

  private showMessage(text: string, error = false): void {
    this.message = text;
    this.isError = error;
    setTimeout(() => this.message = '', 3000);
  }

  private clearForm(): void {
    this.deviceName = '';
    this.deviceIp = '';
  }
}
