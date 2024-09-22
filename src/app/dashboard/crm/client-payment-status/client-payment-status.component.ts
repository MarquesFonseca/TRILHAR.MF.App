import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink } from '@angular/router';
import { ClientPaymentStatusService } from './client-payment-status.service';

@Component({
    selector: 'app-client-payment-status',
    standalone: true,
    imports: [MatCardModule, MatMenuModule, MatButtonModule, RouterLink],
    templateUrl: './client-payment-status.component.html',
    styleUrl: './client-payment-status.component.scss'
})
export class ClientPaymentStatusComponent {

    constructor(
        private clientPaymentStatusService: ClientPaymentStatusService
    ) {}

    ngOnInit(): void {
        this.clientPaymentStatusService.loadChart();
    }

}