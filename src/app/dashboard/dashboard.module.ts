import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MainComponent } from './pages/main/main.component';
import { MapComponent } from './components/map/map.component';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { LineChartComponent } from './components/line-chart/line-chart.component';
import { SummaryComponent } from './components/summary/summary.component';
import { NgChartsModule } from 'ng2-charts';
import { BarChartComponent } from './components/bar-chart/bar-chart.component';
import { LoaderComponent } from './pages/loader/loader.component';

@NgModule({
  declarations: [
    MainComponent,
    MapComponent,
    HeaderComponent,
    SidebarComponent,
    LineChartComponent,
    SummaryComponent,
    BarChartComponent,
    LoaderComponent,
  ],
  exports: [MainComponent, LoaderComponent],
  imports: [CommonModule, HttpClientModule, NgChartsModule],
})
export class DashboardModule {}
