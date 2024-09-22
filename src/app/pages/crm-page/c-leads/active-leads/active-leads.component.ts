import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CustomizerSettingsService } from '../../../../customizer-settings/customizer-settings.service';
import { ActiveLeadsService } from './active-leads.service';

@Component({
    selector: 'app-active-leads',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './active-leads.component.html',
    styleUrl: './active-leads.component.scss'
})
export class ActiveLeadsComponent {

    // isToggled
    isToggled = false;

    constructor(
        public themeService: CustomizerSettingsService,
        private activeLeadsService: ActiveLeadsService
    ) {
        this.themeService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });
    }

    ngOnInit(): void {
        this.activeLeadsService.loadChart();
    }

}