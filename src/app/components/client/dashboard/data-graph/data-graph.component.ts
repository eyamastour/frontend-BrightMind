import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import {
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  LineController,
  BarController,
  BarElement
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { DeviceService } from '../../../../core/services/device.service';
import { Device } from '../../../../core/models/device.model';
import { DeviceHistory } from '../../../../core/models/device-history.model';
import { Subscription } from 'rxjs';

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineController,
  BarController,
  ChartDataLabels
);

@Component({
  selector: 'app-data-graph',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './data-graph.component.html',
  styleUrl: './data-graph.component.css'
})
export class DataGraphComponent implements OnInit, OnDestroy {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  private subscription?: Subscription;

  devices: Device[] = [];
  selectedDevice: Device | null = null;
  timeRange: number = 7; // Default to 7 days
  isLoading: boolean = false;
  hasError: boolean = false;
  errorMessage: string = '';

  public lineChartData: ChartConfiguration['data'] = {
    datasets: [],
    labels: []
  };

  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      ['y']: {
        type: 'linear' as const,
        display: true,
        position: 'left',
        beginAtZero: true,
        ticks: {
          font: {
            size: 12
          },
          callback: (value: number | string) => {
            const numValue = Number(value);
            if (isNaN(numValue)) return value;

            if (this.selectedDevice?.deviceType === 'actuator') {
              return numValue === 1 ? 'ON' : 'OFF';
            }

            const deviceType = this.selectedDevice?.type?.toLowerCase() || '';
            switch (deviceType) {
              case 'temperature':
                return `${numValue}°C`;
              case 'humidity':
                return `${numValue}%`;
              case 'light':
                return `${numValue} lux`;
              default:
                return numValue;
            }
          }
        },
        grid: {
          color: '#e0e0e0'
        }
      },
      ['x']: {
        type: 'category' as const,
        ticks: {
          font: {
            size: 12
          },
          maxRotation: 45,
          minRotation: 45
        },
        grid: {
          color: '#e0e0e0'
        }
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          font: {
            size: 14
          },
          padding: 20
        }
      },
      tooltip: {
        enabled: true,
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: 10,
        titleFont: {
          size: 14
        },
        bodyFont: {
          size: 13
        },
        callbacks: {
          label: (context: any) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            const deviceType = label.toLowerCase();
            
            if (deviceType.includes('temperature')) {
              return `${label}: ${value}°C`;
            } else if (deviceType.includes('humidity')) {
              return `${label}: ${value}%`;
            } else if (deviceType.includes('status')) {
              return `${label}: ${value === 1 ? 'ON' : 'OFF'}`;
            } else if (deviceType.includes('light')) {
              return `${label}: ${value} lux`;
            }
            return `${label}: ${value}`;
          },
          title: (tooltipItems: any[]) => {
            const item = tooltipItems[0];
            const date = new Date(item.label);
            return new Intl.DateTimeFormat('fr-FR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }).format(date);
          }
        }
      },
      datalabels: {
        display: true,
        align: 'top' as const,
        anchor: 'end' as const,
        formatter: (value: number) => {
          if (this.selectedDevice?.deviceType === 'actuator') {
            return value === 1 ? 'ON' : 'OFF';
          }
          const deviceType = this.selectedDevice?.type?.toLowerCase() || '';
          switch (deviceType) {
            case 'temperature':
              return `${value}°C`;
            case 'humidity':
              return `${value}%`;
            case 'light':
              return `${value} lux`;
            default:
              return value.toString();
          }
        },
        color: '#666',
        font: {
          size: 11
        },
        padding: {
          top: 5
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'nearest',
      axis: 'x'
    },
    animation: {
      duration: 750
    }
  };

  public lineChartType: ChartType = 'line';

  constructor(private deviceService: DeviceService) {}

  ngOnInit(): void {
    const installationId = this.deviceService.getInstallationId();
    if (installationId) {
      this.loadDevices(installationId);
    }

    this.subscription = this.deviceService.installationId$.subscribe(id => {
      if (id) {
        this.loadDevices(id);
      }
    });
  }

  loadDevices(installationId: string): void {
    this.isLoading = true;
    this.hasError = false;
    this.deviceService.getDevicesByInstallation(installationId).subscribe({
      next: (devices) => {
        this.devices = devices;
        if (devices.length > 0) {
          const device = devices[0];
          this.selectedDevice = device;
          this.loadDeviceHistory(device._id!, this.timeRange);
        } else {
          this.isLoading = false;
          this.hasError = true;
          this.errorMessage = 'No devices found for this installation';
        }
      },
      error: (error) => {
        console.error('Error loading devices:', error);
        this.isLoading = false;
        this.hasError = true;
        this.errorMessage = 'Failed to load devices. Please try again.';
      }
    });
  }

  onDeviceSelect(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const deviceId = select.value;
    const selectedDevice = this.devices.find(d => d._id === deviceId);
    if (selectedDevice) {
      this.selectedDevice = selectedDevice;
      this.loadDeviceHistory(deviceId, this.timeRange);
    }
  }

  updateTimeRange(days: number): void {
    this.timeRange = days;
    if (this.selectedDevice?._id) {
      this.loadDeviceHistory(this.selectedDevice._id, days);
    }
  }

  private loadDeviceHistory(deviceId: string, days: number): void {
    this.isLoading = true;
    this.hasError = false;
    this.deviceService.getDeviceHistory(deviceId, days).subscribe({
      next: (history) => {
        if (history.length === 0) {
          this.hasError = true;
          this.errorMessage = 'No data available for the selected time range';
        } else {
          this.updateChart(history);
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading device history:', error);
        this.isLoading = false;
        this.hasError = true;
        this.errorMessage = 'Failed to load device history. Please try again.';
      }
    });
  }

  private updateChart(history: DeviceHistory[]): void {
    if (!history.length) return;

    const formatDate = (date: Date): string => {
      return new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    };

    const labels = history.map(h => formatDate(new Date(h.timestamp)));
    
    // Convert to numerical values for the chart
    const chartValues = history.map(h => {
      if (this.selectedDevice?.deviceType === 'actuator') {
        return h.value === true ? 1 : 0;
      } else {
        return typeof h.value === 'number' ? h.value : 0;
      }
    });

    const deviceType = this.selectedDevice?.type || '';
    let yAxisLabel = '';
    let chartType: ChartType = 'line';
    let chartOptions = { ...this.lineChartOptions };

    if (this.selectedDevice?.deviceType === 'actuator') {
      yAxisLabel = 'Status';
      chartType = 'bar';
      if (chartOptions.scales?.['y']) {
        chartOptions.scales['y'].ticks = {
          ...chartOptions.scales['y'].ticks,
          callback: (value: number | string) => value === 1 ? 'ON' : 'OFF'
        };
      }
    } else {
      // Set label based on sensor type
      switch(deviceType.toLowerCase()) {
        case 'temperature':
          yAxisLabel = 'Temperature (°C)';
          break;
        case 'humidity':
          yAxisLabel = 'Humidity (%)';
          break;
        case 'light':
          yAxisLabel = 'Light Level';
          break;
        default:
          yAxisLabel = 'Value';
      }
    }

    this.lineChartType = chartType;
    this.lineChartOptions = chartOptions;

    const color = this.selectedDevice?.deviceType === 'actuator' ? 
      'rgb(255, 159, 64)' : 'rgb(75, 192, 192)';
    const backgroundColor = this.selectedDevice?.deviceType === 'actuator' ?
      'rgba(255, 159, 64, 0.5)' : 'rgba(75, 192, 192, 0.5)';

    this.lineChartData = {
      labels: labels,
      datasets: [{
        data: chartValues,
        label: `${this.selectedDevice?.name || 'Device'} - ${yAxisLabel}`,
        fill: false,
        tension: 0.4,
        borderColor: color,
        backgroundColor: backgroundColor,
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,
        pointBackgroundColor: color,
        pointHoverBackgroundColor: color,
        pointBorderColor: '#fff',
        pointHoverBorderColor: '#fff',
        pointBorderWidth: 2,
        pointHoverBorderWidth: 2,
        segment: {
          borderColor: () => '#666'
        },
        datalabels: {
          align: 'top',
          anchor: 'end',
          formatter: (value: number): string => {
            if (this.selectedDevice?.deviceType === 'actuator') {
              return value === 1 ? 'ON' : 'OFF';
            }
            const deviceType = this.selectedDevice?.type?.toLowerCase() || '';
            switch (deviceType) {
              case 'temperature':
                return `${value}°C`;
              case 'humidity':
                return `${value}%`;
              case 'light':
                return `${value} lux`;
              default:
                return value.toString();
            }
          },
          color: '#666',
          font: {
            size: 11
          },
          padding: {
            top: 5
          }
        }
      }]
    };

    if (this.chart) {
      this.chart.update();
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
