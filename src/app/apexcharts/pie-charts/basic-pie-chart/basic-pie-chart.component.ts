import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { BasicPieChartService } from './basic-pie-chart.service';

@Component({
    selector: 'app-basic-pie-chart',
    standalone: true,
    imports: [RouterLink, MatCardModule],
    templateUrl: './basic-pie-chart.component.html',
    styleUrl: './basic-pie-chart.component.scss'
})
export class BasicPieChartComponent {

    constructor(
        private basicPieChartService: BasicPieChartService
    ) {}

    ngOnInit(): void {
        this.basicPieChartService.loadChart();
    }

}