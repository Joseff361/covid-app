import { Component, OnInit } from '@angular/core';
import { Country, Summary } from '../../interfaces';
import { CovidService } from '../../services/covid.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  public summary: Summary | null = null;

  constructor(private covidService: CovidService) {}

  ngOnInit(): void {
    this.covidService.getSummary().subscribe((data) => {
      this.summary = data;
      console.log(this.summary);
    });
  }

  get countriesData(): Country[] {
    return this.summary?.Countries || [];
  }

  get time(): string {
    const current = new Date(this.summary?.Date || '');
    const hours = current.getHours();
    const minutes = current.getMinutes();
    return `${hours}:${minutes}`;
  }

  setCountryData(countryTag: string) {
    this.covidService.setCurrentCountryData(countryTag);
  }
}
