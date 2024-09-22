import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink } from '@angular/router';
import { CustomerSatisfactionService } from './customer-satisfaction.service';

@Component({
    selector: 'app-customer-satisfaction',
    standalone: true,
    imports: [MatCardModule, MatMenuModule, MatButtonModule, RouterLink],
    templateUrl: './customer-satisfaction.component.html',
    styleUrl: './customer-satisfaction.component.scss'
})
export class CustomerSatisfactionComponent {

    constructor(
        private customerSatisfactionService: CustomerSatisfactionService
    ) {}

    ngOnInit(): void {
        this.customerSatisfactionService.loadChart();
    }

}