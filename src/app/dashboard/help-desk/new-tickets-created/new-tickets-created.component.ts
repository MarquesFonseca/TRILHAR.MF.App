import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink } from '@angular/router';
import { NewTicketsCreatedService } from './new-tickets-created.service';

@Component({
    selector: 'app-new-tickets-created',
    standalone: true,
    imports: [MatCardModule, MatMenuModule, MatButtonModule, RouterLink],
    templateUrl: './new-tickets-created.component.html',
    styleUrl: './new-tickets-created.component.scss'
})
export class NewTicketsCreatedComponent {

    constructor(
        private newTicketsCreatedService: NewTicketsCreatedService
    ) {}

    ngOnInit(): void {
        this.newTicketsCreatedService.loadChart();
    }

}