import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartType } from 'chart.js';
import { dataMonths, Status, CasesPerMonth } from '../../interfaces';
import { CovidService } from '../../services/covid.service';
import { months, yearCode } from '../../shared';

const MONTHS_LIMIT: number = 10;

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss'],
})
export class LineChartComponent implements OnInit {
  public lineChartType: ChartType = 'line';
  public lineChartData: ChartConfiguration['data'] | null = null;
  public lineChartOptions: ChartConfiguration['options'];
  public casesPerMonth: Record<number, CasesPerMonth> = {};
  public pieceOfMonth: dataMonths[] = [];

  constructor(public covidService: CovidService) {}

  private createUniqueKey(month: number, year: number): number {
    return yearCode[year] + month;
  }

  private createLabel(month: number, year: number): string {
    return `${months[month]} ${year}`;
  }

  private setCasesPerMonth(data: Status[]): void {
    // Set the final cases in each month
    for (let i = 0; i < data.length; i++) {
      const currentTotalCases: number = Number(data[i].Cases);
      const currentDate: Date = new Date(data[i].Date);

      const key = this.createUniqueKey(
        currentDate.getMonth(),
        currentDate.getFullYear()
      );

      const label = this.createLabel(
        currentDate.getMonth(),
        currentDate.getFullYear()
      );

      this.casesPerMonth[key] = {
        cases: currentTotalCases,
        label,
      };
    }

    // Set the final cases per month
    const keys = Object.keys(this.casesPerMonth);

    keys.forEach((key, index) => {
      if (index > 0) {
        this.casesPerMonth[Number(key)].cases -=
          this.casesPerMonth[Number(keys[index - 1])].cases;
      }
    });
  }

  private transformDataMonths(): void {
    const keys = Object.keys(this.casesPerMonth);

    keys.reverse().forEach((key, index) => {
      if (index < MONTHS_LIMIT) {
        this.pieceOfMonth.push({
          label: this.casesPerMonth[Number(key)].label,
          cases: this.casesPerMonth[Number(key)].cases,
        });
      }
    });

    this.pieceOfMonth.reverse();
  }

  private cleanChart(): void {
    this.casesPerMonth = {};
    this.pieceOfMonth = [];
  }

  ngOnInit(): void {
    this.covidService.currentCountryData.subscribe((data) => {
      if (data.length > 0) {
        this.cleanChart();

        this.setCasesPerMonth(data);
        this.transformDataMonths();

        this.lineChartData = {
          datasets: [
            {
              data: this.pieceOfMonth.map((data) => data.cases),
              label: 'Cases per Month',
              backgroundColor: '#222222',
              borderColor: '#FFF',
              pointBackgroundColor: '#222222',
              pointBorderColor: '#FFF',
              pointHoverBackgroundColor: '#FFF',
              pointHoverBorderColor: '#FFF',
              fill: 'origin',
            },
          ],
          labels: this.pieceOfMonth.map((data) => data.label),
        };

        this.lineChartOptions = {
          elements: {
            line: {
              tension: 0.5,
            },
          },
        };
      }
    });
  }
}
