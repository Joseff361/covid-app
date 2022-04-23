import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { switchMap } from 'rxjs';
import { CountryService } from '../../services/country.service';
import { CovidService } from '../../services/covid.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent {
  private map!: L.Map;
  public longitude: number = 39.8282;
  public latitude: number = -98.5795;
  public zoom: number = 4.5;

  constructor(
    private covidService: CovidService,
    private countryService: CountryService
  ) {}

  private initMap(): void {
    this.map = L.map('map', {
      center: [this.latitude, this.longitude],
      zoom: this.zoom,
    });

    const tiles = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 18,
        minZoom: 3,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }
    );

    tiles.addTo(this.map);

    L.marker([this.latitude, this.longitude]).addTo(this.map);
  }

  ngAfterViewInit(): void {
    this.initMap();

    this.covidService.currentCountryData
      .pipe(
        switchMap((data) => this.countryService.getCountry(data[0].Country))
      )
      .subscribe((country) => {
        if (country.length > 0) {
          const countrySelected = country[0];
          const latitude = countrySelected.latlng[0];
          const longitude = countrySelected.latlng[1];
          this.map.setView([latitude, longitude], this.zoom);

          const text = `${countrySelected.name.common} ${countrySelected.flag}`;

          L.marker([latitude, longitude])
            .addTo(this.map)
            .bindPopup(text)
            .openPopup();
        }
      });
  }
}
