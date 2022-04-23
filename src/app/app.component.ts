import { Component, OnInit } from '@angular/core';
import { CovidService } from './dashboard/services/covid.service';
import { SharedService } from './dashboard/services/shared.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public isLoading: boolean = false;
  title = 'covid19-app';

  constructor(
    private sharedService: SharedService,
    private covidService: CovidService
  ) {}

  ngOnInit(): void {
    this.sharedService.loading.next(true);
    this.covidService.getCountryData('FR', 'confirmed').subscribe((data) => {
      if (data.length > 0) {
        this.covidService.currentCountryData.next(data);
      }
      this.sharedService.loading.next(false);
    });

    this.sharedService.loading.subscribe((isLoading) => {
      this.isLoading = isLoading;
    });
  }
}
