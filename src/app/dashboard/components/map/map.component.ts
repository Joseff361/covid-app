import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { CovidService } from '../../services/covid.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  private map!: L.Map;
  public longitude: number = 39.8282;
  public latitude: number = -98.5795;

  constructor(private covidService: CovidService) {}

  private initMap(): void {
    this.map = L.map('map', {
      center: [this.latitude, this.longitude],
      zoom: 4.5,
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

    L.marker([39.8282, -98.5795]).addTo(this.map);
  }

  ngOnInit(): void {
    this.covidService.getCountryData('peru').subscribe((data) => {
      this.latitude = Number(data[0].Lat);
      this.longitude = Number(data[0].Lon);

      this.map.setView([this.latitude, this.longitude], 4.5);
    });
  }

  ngAfterViewInit(): void {
    this.initMap();
  }
}
