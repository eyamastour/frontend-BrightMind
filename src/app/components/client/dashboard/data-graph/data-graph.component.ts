import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Chart, ChartConfiguration, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { saveAs } from 'file-saver';
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
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left',
        min: 0,
        max: 1,
        ticks: {
          stepSize: 1,
          font: {
            size: 14,
            weight: 'bold'
          },
          callback: (value: number | string) => {
            return value === 1 ? 'ON' : 'OFF';
          }
        },
        grid: {
          color: '#e0e0e0',
          lineWidth: 2
        }
      },
      x: {
        type: 'category' as const,
        ticks: {
          font: {
            size: 12
          },
          maxRotation: 45,
          minRotation: 45
        },
        grid: {
          display: false
        }
      }
    },
    plugins: {
      legend: {
        display: false
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
            return `${label}: ${value === 1 ? 'ON' : 'OFF'}`;
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
        display: false
      }
    },
    interaction: {
      intersect: false,
      mode: 'nearest',
      axis: 'x'
    },
    animation: {
      duration: 500
    },
    elements: {
      line: {
        tension: 0, // straight lines
        borderWidth: 2,
        fill: false,
        stepped: 'before' as const // This creates the step effect for the line
      },
      point: {
        radius: 0, // hide points
        hitRadius: 10
      }
    }
  };

  public lineChartType: ChartType = 'line';

  constructor(
    private deviceService: DeviceService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Get deviceId from route parameter
    const deviceId = this.route.snapshot.paramMap.get('deviceId');
    if (deviceId) {
      // Load device details first
      this.deviceService.getDevice(deviceId).subscribe({
        next: (device: Device) => {
          this.selectedDevice = device;
          this.loadDeviceHistory(deviceId, this.timeRange);
        },
        error: (error: Error) => {
          console.error('Error loading device:', error);
          this.hasError = true;
          this.errorMessage = 'Failed to load device details';
        }
      });
    } else {
      // Fallback to original behavior if no deviceId in route
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
  }

  loadDevices(installationId: string): void {
    this.isLoading = true;
    this.hasError = false;
    this.deviceService.getDevicesByInstallation(installationId).subscribe({
      next: (devices: Device[]) => {
        // Filter to only include actuator devices (binary state devices)
        this.devices = devices.filter(device => device.deviceType === 'actuator');
        
        if (this.devices.length > 0) {
          const device = this.devices[0];
          this.selectedDevice = device;
          this.loadDeviceHistory(device._id!, this.timeRange);
        } else {
          this.isLoading = false;
          this.hasError = true;
          this.errorMessage = 'No binary state devices found for this installation';
        }
      },
      error: (error: Error) => {
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
      next: (history: DeviceHistory[]) => {
        if (history.length === 0) {
          this.hasError = true;
          this.errorMessage = 'No data available for the selected time range';
        } else {
          this.updateChart(history);
        }
        this.isLoading = false;
      },
      error: (error: Error) => {
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

    // Filter out duplicate consecutive values to simplify the graph
    const filteredHistory = history.reduce((acc: DeviceHistory[], current, index) => {
      // Always include the first item
      if (index === 0) {
        acc.push(current);
        return acc;
      }
      
      // Include if value is different from the previous one
      const prev = acc[acc.length - 1];
      if (prev.value !== current.value) {
        acc.push(current);
      }
      
      return acc;
    }, []);

    const labels = filteredHistory.map(h => formatDate(new Date(h.timestamp)));
    
    // Get the current value (most recent)
    const currentValue = filteredHistory[filteredHistory.length - 1]?.value;
    const currentValueDisplay = currentValue === true ? 'ON' : 'OFF';

    // Convert to numerical values for the chart (1 for ON, 0 for OFF)
    const chartValues = filteredHistory.map(h => h.value === true ? 1 : 0);

    // Set device name and current status
    const deviceName = this.selectedDevice?.name || 'Device';
    const currentValueLabel = ` (Current: ${currentValueDisplay})`;

    this.lineChartData = {
      labels: labels,
      datasets: [{
        data: chartValues,
        label: `${deviceName} Status${currentValueLabel}`,
        fill: false,
        stepped: 'before' as const,
        borderColor: '#007bff',
        backgroundColor: 'rgba(0, 123, 255, 0.1)',
        borderWidth: 3
      }]
    };

    if (this.chart) {
      this.chart.update();
    }
  }

  downloadCSV(): void {
    if (!this.selectedDevice?._id) return;
    
    this.isLoading = true;
    this.deviceService.getDeviceHistory(this.selectedDevice._id, this.timeRange).subscribe({
      next: (history: DeviceHistory[]) => {
        if (history.length === 0) {
          this.hasError = true;
          this.errorMessage = 'No data available to download';
          this.isLoading = false;
          return;
        }
        
        // Sort history by timestamp (oldest first)
        const sortedHistory = [...history].sort((a, b) => 
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
        
        // Create CSV header
        const csvHeader = 'Timestamp,Device Name,Device Type,Status\n';
        
        // Create CSV content
        const csvContent = sortedHistory.map(item => {
          const timestamp = new Date(item.timestamp).toLocaleString('fr-FR');
          const deviceName = item.deviceName || this.selectedDevice?.name || 'Unknown';
          const deviceType = item.deviceType || 'actuator';
          const status = item.value === true ? 'ON' : 'OFF';
          
          return `"${timestamp}","${deviceName}","${deviceType}","${status}"`;
        }).join('\n');
        
        // Combine header and content
        const csv = csvHeader + csvContent;
        
        // Create blob and download
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
        const filename = `${this.selectedDevice?.name || 'device'}_history_${new Date().toISOString().slice(0, 10)}.csv`;
        
        saveAs(blob, filename);
        this.isLoading = false;
      },
      error: (error: Error) => {
        console.error('Error downloading device history:', error);
        this.isLoading = false;
        this.hasError = true;
        this.errorMessage = 'Failed to download device history. Please try again.';
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
