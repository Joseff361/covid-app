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

  constructor(public covidService: CovidService) {}

  private createUniqueKey(month: number, year: number): number {
    return yearCode[year] + month;
  }

  private createLabel(month: number, year?: number): string {
    return `${months[month]}`;
  }

  private createCasesPerMonthObj(
    data: Status[]
  ): Record<number, CasesPerMonth> {
    const casesPerMonth: Record<number, CasesPerMonth> = {};

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

      casesPerMonth[key] = {
        cases: currentTotalCases,
        label,
      };
    }

    // Set the final cases per month
    const keys = Object.keys(casesPerMonth);

    keys.forEach((key, index) => {
      if (index > 0) {
        casesPerMonth[Number(key)].cases -=
          casesPerMonth[Number(keys[index - 1])].cases;
      }
    });

    return casesPerMonth;
  }

  private createCasesPerMonthArr(
    casesPerMonth: Record<number, CasesPerMonth>,
    limit: number
  ): dataMonths[] {
    const pieceOfMonth: dataMonths[] = [];
    const keys = Object.keys(casesPerMonth);

    keys.reverse().forEach((key, index) => {
      if (index < limit) {
        pieceOfMonth.push({
          label: casesPerMonth[Number(key)].label,
          cases: casesPerMonth[Number(key)].cases,
        });
      }
    });

    return pieceOfMonth.reverse();
  }

  ngOnInit(): void {
    this.covidService.currentCountryData.subscribe((data) => {
      if (data.length > 0) {
        const casesPerMonthObj = this.createCasesPerMonthObj(data);

        const casesPerMonthArr = this.createCasesPerMonthArr(
          casesPerMonthObj,
          MONTHS_LIMIT
        );

        this.lineChartData = {
          datasets: [
            {
              data: casesPerMonthArr.map((data) => data.cases),
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
          labels: casesPerMonthArr.map((data) => data.label),
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
