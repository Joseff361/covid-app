import { Component, OnInit } from '@angular/core';
import { Summary } from '../../interfaces';
import { CovidService } from '../../services/covid.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
})
export class SummaryComponent implements OnInit {
  public summary: Summary | null = null;

  constructor(private covidService: CovidService) {}

  ngOnInit(): void {
    this.covidService.getSummary().subscribe((data) => {
      this.summary = data;
    });
  }

  get totalConfirmed(): number {
    return this.summary?.Global.TotalConfirmed || 0;
  }

  get totalRecovered(): number {
    return this.summary?.Global.TotalRecovered || 0;
  }

  get newConfirmed(): number {
    return this.summary?.Global.NewConfirmed || 0;
  }

  get totalDeaths(): number {
    return this.summary?.Global.TotalDeaths || 0;
  }
}
