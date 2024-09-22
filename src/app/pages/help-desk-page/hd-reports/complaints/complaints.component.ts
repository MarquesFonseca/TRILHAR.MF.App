import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink } from '@angular/router';
import { ComplaintsService } from './complaints.service';

@Component({
    selector: 'app-complaints',
    standalone: true,
    imports: [MatCardModule, MatMenuModule, MatButtonModule, RouterLink],
    templateUrl: './complaints.component.html',
    styleUrl: './complaints.component.scss'
})
export class ComplaintsComponent {

    constructor(
        private complaintsService: ComplaintsService
    ) {}

    ngOnInit(): void {
        this.complaintsService.loadChart();
    }

}