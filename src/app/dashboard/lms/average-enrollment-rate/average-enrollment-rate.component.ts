import { Component } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { AverageEnrollmentRateService } from './average-enrollment-rate.service';

@Component({
    selector: 'app-average-enrollment-rate',
    standalone: true,
    imports: [MatCardModule, MatMenuModule, MatButtonModule, RouterLink],
    templateUrl: './average-enrollment-rate.component.html',
    styleUrl: './average-enrollment-rate.component.scss'
})
export class AverageEnrollmentRateComponent {

    constructor(
        private averageEnrollmentRateService: AverageEnrollmentRateService
    ) {}

    ngOnInit(): void {
        this.averageEnrollmentRateService.loadChart();
    }

}