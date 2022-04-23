import { Component, OnInit } from '@angular/core';
import { CovidService } from './dashboard/services/covid.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'covid19-app';

  constructor(private covidService: CovidService) {}

  ngOnInit(): void {
    this.covidService.setCurrentCountryData('pe');
  }
}
