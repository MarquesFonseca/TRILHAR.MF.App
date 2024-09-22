import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { CustomizerSettingsService } from '../../../customizer-settings/customizer-settings.service';
import { TicketsOpenService } from './tickets-open.service';

@Component({
    selector: 'app-tickets-open',
    standalone: true,
    imports: [MatCardModule, RouterLink],
    templateUrl: './tickets-open.component.html',
    styleUrl: './tickets-open.component.scss'
})
export class TicketsOpenComponent {

    // isToggled
    isToggled = false;

    constructor(
        public themeService: CustomizerSettingsService,
        private ticketsOpenService: TicketsOpenService
    ) {
        this.themeService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });
    }

    ngOnInit(): void {
        this.ticketsOpenService.loadChart();
    }

}