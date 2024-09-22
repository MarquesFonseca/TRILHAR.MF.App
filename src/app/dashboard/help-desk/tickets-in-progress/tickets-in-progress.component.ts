import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { CustomizerSettingsService } from '../../../customizer-settings/customizer-settings.service';
import { TicketsInProgressService } from './tickets-in-progress.service';

@Component({
    selector: 'app-tickets-in-progress',
    standalone: true,
    imports: [MatCardModule, RouterLink],
    templateUrl: './tickets-in-progress.component.html',
    styleUrl: './tickets-in-progress.component.scss'
})
export class TicketsInProgressComponent {

    // isToggled
    isToggled = false;

    constructor(
        public themeService: CustomizerSettingsService,
        private ticketsInProgressService: TicketsInProgressService
    ) {
        this.themeService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });
    }

    ngOnInit(): void {
        this.ticketsInProgressService.loadChart();
    }

}