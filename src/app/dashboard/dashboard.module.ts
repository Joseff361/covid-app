import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MainComponent } from './pages/main/main.component';
import { MapComponent } from './components/map/map.component';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { FooterComponent } from './components/footer/footer.component';
import { LineChartComponent } from './components/line-chart/line-chart.component';
import { SummaryComponent } from './components/summary/summary.component';
import { NgChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [
    MainComponent,
    MapComponent,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    LineChartComponent,
    SummaryComponent,
  ],
  exports: [MainComponent],
  imports: [CommonModule, HttpClientModule, NgChartsModule],
})
export class DashboardModule {}
