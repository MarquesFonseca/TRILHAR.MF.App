import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RevenueGrowthService } from './revenue-growth.service';
import { CustomizerSettingsService } from '../../../../customizer-settings/customizer-settings.service';

@Component({
    selector: 'app-revenue-growth',
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