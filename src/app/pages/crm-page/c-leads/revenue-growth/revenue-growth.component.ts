import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CustomizerSettingsService } from '../../../../customizer-settings/customizer-settings.service';
import { RevenueGrowthService } from './revenue-growth.service';

@Component({
    selector: 'app-revenue-growth:not(p)',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './revenue-growth.component.html',
    styleUrl: './revenue-growth.component.scss'
})
export class RevenueGrowthComponent {

    // isToggled
    isToggled = false;

    constructor(
        public themeService: CustomizerSettingsService,
        private revenueGrowthService: RevenueGrowthService
    ) {
        this.themeService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });
    }

    ngOnInit(): void {
        this.revenueGrowthService.loadChart();
    }

}