import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink } from '@angular/router';
import { TotalCoursesSalesService } from './total-courses-sales.service';

@Component({
    selector: 'app-total-courses-sales',
    standalone: true,
    imports: [MatCardModule, MatMenuModule, MatButtonModule, RouterLink],
    templateUrl: './total-courses-sales.component.html',
    styleUrl: './total-courses-sales.component.scss'
})
export class TotalCoursesSalesComponent {

    constructor(
        private totalCoursesSalesService: TotalCoursesSalesService
    ) {}

    ngOnInit(): void {
        this.totalCoursesSalesService.loadChart();
    }

}