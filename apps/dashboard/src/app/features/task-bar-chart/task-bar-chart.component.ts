import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective, NgChartsModule } from 'ng2-charts';
import { ChartOptions, ChartType } from 'chart.js';
import { Task } from '../task/models/task.model';

@Component({
  selector: 'app-task-bar-chart',
  standalone: true,
  imports: [CommonModule, NgChartsModule], // ✅ correct
  template: `
    <div>
      <canvas baseChart
              [data]="barChartData"
              [options]="barChartOptions"
              [type]="barChartType">
      </canvas>
    </div>
  `,
})
export class TaskBarChartComponent {
  @Input() todoTasks: Task[] = [];
  @Input() inProgressTasks: Task[] = [];
  @Input() doneTasks: Task[] = [];

  barChartType: ChartType = 'bar';
  barChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Task Completion Overview' },
    },
  };

  get barChartData() {
    return {
      labels: ['To Do', 'In Progress', 'Done'],
      datasets: [
        {
          data: [
            this.todoTasks.length,
            this.inProgressTasks.length,
            this.doneTasks.length,
          ],
          backgroundColor: ['#f87171', '#fbbf24', '#34d399'],
        },
      ],
    };
  }
}
