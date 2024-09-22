import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { CustomizerSettingsService } from '../../../customizer-settings/customizer-settings.service';
import { TicketsResolvedService } from './tickets-resolved.service';

@Component({
    selector: 'app-tickets-resolved',
    standalone: true,
    imports: [MatCardModule, RouterLink],
    templateUrl: './tickets-resolved.component.html',
    styleUrl: './tickets-resolved.component.scss'
})
export class TicketsResolvedComponent {

    // isToggled
    isToggled = false;

    constructor(
        public themeService: CustomizerSettingsService,
        private ticketsResolvedService: TicketsResolvedService
    ) {
        this.themeService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });
    }

    ngOnInit(): void {
        this.ticketsResolvedService.loadChart();
    }

}