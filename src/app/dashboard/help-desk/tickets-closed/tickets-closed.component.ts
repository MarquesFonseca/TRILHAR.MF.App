import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { CustomizerSettingsService } from '../../../customizer-settings/customizer-settings.service';
import { TicketsClosedService } from './tickets-closed.service';

@Component({
    selector: 'app-tickets-closed',
    standalone: true,
    imports: [MatCardModule, RouterLink],
    templateUrl: './tickets-closed.component.html',
    styleUrl: './tickets-closed.component.scss'
})
export class TicketsClosedComponent {

    // isToggled
    isToggled = false;

    constructor(
        public themeService: CustomizerSettingsService,
        private ticketsClosedService: TicketsClosedService
    ) {
        this.themeService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });
    }

    ngOnInit(): void {
        this.ticketsClosedService.loadChart();
    }

}