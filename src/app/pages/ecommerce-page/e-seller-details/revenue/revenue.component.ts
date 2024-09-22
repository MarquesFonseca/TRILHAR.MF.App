import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink } from '@angular/router';
import { RevenueService } from './revenue.service';

@Component({
    selector: 'app-revenue:not(0)',
    standalone: true,
    imports: [MatCardModule, MatMenuModule, MatButtonModule, RouterLink],
    templateUrl: './revenue.component.html',
    styleUrl: './revenue.component.scss'
})
export class RevenueComponent {

    constructor(
        private revenueService: RevenueService
    ) {}

    ngOnInit(): void {
        this.revenueService.loadChart();
    }

}