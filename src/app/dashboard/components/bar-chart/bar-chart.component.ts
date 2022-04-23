import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { CharData, Status } from '../../interfaces';
import { CovidService } from '../../services/covid.service';
import { switchMap } from 'rxjs';

const COUNTRY_TO_COMPARE = 'Peru';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss'],
})
export class BarChartComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  public barChartType: ChartType = 'bar';
  public barChartData: ChartData<'bar'> | any;
  public casesPerYearArr: CharData[] = [];
  public country: string = '';

  constructor(private covidService: CovidService) {}

  private createCasesPerYearObj(data: Status[]): Record<number, number> {
    const casesPerYear: Record<number, number> = {};
    data.forEach((state) => {
      const currentDate = new Date(state.Date);
      casesPerYear[currentDate.getFullYear()] = state.Cases;
    });

    const keys = Object.keys(casesPerYear);

    keys.forEach((key, index) => {
      if (index > 0) {
        casesPerYear[Number(key)] -= casesPerYear[Number(keys[index - 1])];
      }
    });

    return casesPerYear;
  }

  private createCasesPerYearArr(yearObj: Record<number, number>): CharData[] {
    const dataPerYear: CharData[] = [];
    const keys = Object.keys(yearObj);

    keys.forEach((key) => {
      dataPerYear.push({
        label: key,
        cases: yearObj[Number(key)],
      });
    });

    return dataPerYear;
  }

  ngOnInit(): void {
    this.covidService.currentCountryData
      .pipe(
        switchMap((data) => {
          if (data.length > 0) {
            const casesPerYearObj = this.createCasesPerYearObj(data);
            this.casesPerYearArr = this.createCasesPerYearArr(casesPerYearObj);
            this.country = data[0].Country;
          }

          return this.covidService.getCountryData(
            COUNTRY_TO_COMPARE,
            'confirmed'
          );
        })
      )
      .subscribe((data) => {
        if (data.length > 0) {
          const casesPerYearObj = this.createCasesPerYearObj(data);
          const casesPerYearArrPE = this.createCasesPerYearArr(casesPerYearObj);

          this.barChartData = {
            labels: this.casesPerYearArr.map((data) => data.label),
            datasets: [
              {
                data: this.casesPerYearArr.map((data) => data.cases),
                label: this.country,
                backgroundColor: '#fda536',
              },
              {
                data: casesPerYearArrPE.map((data) => data.cases),
                label: COUNTRY_TO_COMPARE,
                backgroundColor: '#55e737',
              },
            ],
          };
        }
      });
  }
}
