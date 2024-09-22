import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink } from '@angular/router';
import { TicketsByTypeService } from './tickets-by-type.service';

@Component({
    selector: 'app-tickets-by-type',
    standalone: true,
    imports: [MatCardModule, MatMenuModule, MatButtonModule, RouterLink],
    templateUrl: './tickets-by-type.component.html',
    styleUrl: './tickets-by-type.component.scss'
})
export class TicketsByTypeComponent {

    constructor(
        private ticketsByTypeService: TicketsByTypeService
    ) {}

    ngOnInit(): void {
        this.ticketsByTypeService.loadChart();
    }

}