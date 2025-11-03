import { GameResult } from './types';
import { Chart, registerables } from 'chart.js';

// Register Chart.js components
Chart.register(...registerables);

export function createChart(canvasId: string, result: GameResult): Chart {
  const ctx = document.getElementById(canvasId) as HTMLCanvasElement;

  const labels = result.rounds.map(r => `Round ${r.round}`);
  const player1Data = result.rounds.map(r => r.player1TotalScore);
  const player2Data = result.rounds.map(r => r.player2TotalScore);

  return new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: result.player1Strategy,
          data: player1Data,
          borderColor: '#2563eb',
          backgroundColor: 'rgba(37, 99, 235, 0.1)',
          tension: 0.3,
          fill: true
        },
        {
          label: result.player2Strategy,
          data: player2Data,
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.3,
          fill: true
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        legend: {
          position: 'top',
          labels: {
            font: {
              size: 14,
              weight: 'bold'
            }
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 12,
          bodyFont: {
            size: 14
          },
          titleFont: {
            size: 14,
            weight: 'bold'
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Total Score',
            font: {
              size: 14,
              weight: 'bold'
            }
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          }
        },
        x: {
          grid: {
            display: false
          },
          ticks: {
            maxRotation: 45,
            minRotation: 45
          }
        }
      }
    }
  });
}

export function updateChart(chart: Chart, result: GameResult): void {
  const labels = result.rounds.map(r => `Round ${r.round}`);
  const player1Data = result.rounds.map(r => r.player1TotalScore);
  const player2Data = result.rounds.map(r => r.player2TotalScore);

  chart.data.labels = labels;
  chart.data.datasets[0].data = player1Data;
  chart.data.datasets[0].label = result.player1Strategy;
  chart.data.datasets[1].data = player2Data;
  chart.data.datasets[1].label = result.player2Strategy;

  chart.update();
}
