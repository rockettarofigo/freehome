import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export interface PvResult {
  id: number;
  date: string;
  error: string;
  active_power: number;
  daily_kwh: number;
  num_strings: number;
  soc_percent: number;
  alarms: string;
  irradiance: number;
}

export interface PvResponse {
  status: string;
  count: number;
  results: PvResult[];
}

export interface ApiResponse<T> {
  status: number;
  response: T;
}

@Component({
  selector: 'app-solar',
  templateUrl: './solar.component.html',
  styleUrls: ['./solar.component.css']
})
export class SolarComponent implements OnInit {

  data: PvResult[] = [];
  loading = false;

  startDate: string = '';
  endDate: string = '';

  private charts: Chart[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.setDefaultDates();
    this.fetchPv();
  }

  setDefaultDates(): void {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    const baseDate = `${year}-${month}-${day}`;

    this.startDate = `${baseDate}T07:00`;
    this.endDate = `${baseDate}T20:00`;
  }

  fetchPv(): void {

    this.loading = true;

    if (!this.startDate || !this.endDate) {
      console.warn('Seleziona entrambe le date');
      this.loading = false;
      return;
    }

    const start = this.startDate.replace('T', ' ') + ':00';
    const end = this.endDate.replace('T', ' ') + ':00';

    this.apiService.fetchData(start, end).subscribe({
      next: (res: ApiResponse<PvResponse>) => {

        this.data = res.response.results || [];
        this.loading = false;

        if (this.data.length === 0) return;

        const labels = this.data.map(r =>
          new Date(r.date).toLocaleTimeString('it-IT', {
            hour: '2-digit',
            minute: '2-digit'
          })
        );

        setTimeout(() => {

          this.destroyCharts();

          this.charts.push(
            this.createChart('chart_power', labels, this.data.map(r => r.active_power)),
            this.createChart('chart_kwh', labels, this.data.map(r => r.daily_kwh)),
            this.createChart('chart_soc', labels, this.data.map(r => r.soc_percent)),
            this.createChart('chart_irradiance', labels, this.data.map(r => r.irradiance))
          );

        });

      },
      error: (err) => {
        console.error('PV error:', err);
        this.loading = false;
      }
    });
  }

  createChart(id: string, labels: string[], values: number[]): Chart {

    const canvas = document.getElementById(id) as HTMLCanvasElement;

    if (!canvas) {
      console.warn('Canvas not found:', id);
      return {} as Chart;
    }

    return new Chart(canvas, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          data: values,
          borderColor: '#4cc9f0',
          backgroundColor: 'rgba(76, 201, 240, 0.15)',
          pointBackgroundColor: '#4cc9f0',
          pointBorderColor: '#ffffff',
          pointRadius: 3,
          pointHoverRadius: 5,
          tension: 0.35,
          fill: true,
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        interaction: {
          mode: 'index',
          intersect: false
        },
        scales: {
          x: {
            ticks: { maxTicksLimit: 6 }
          },
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  destroyCharts(): void {
    this.charts.forEach(c => c.destroy());
    this.charts = [];
  }
}