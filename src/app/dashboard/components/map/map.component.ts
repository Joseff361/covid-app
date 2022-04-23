import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
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

  constructor(private covidService: CovidService) {}

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

    this.covidService.currentCountryData.subscribe((data) => {
      const countrySelected = data[0];
      this.latitude = Number(countrySelected.Lat);
      this.longitude = Number(countrySelected.Lon);
      this.map.setView([this.latitude, this.longitude], this.zoom);

      const text = `${countrySelected.Country} (${countrySelected.CountryCode})`;

      L.marker([this.latitude, this.longitude])
        .addTo(this.map)
        .bindPopup(text)
        .openPopup();
    });
  }
}
