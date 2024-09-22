import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CustomizerSettingsService } from '../../../../customizer-settings/customizer-settings.service';
import { NewLeadsService } from './new-leads.service';

@Component({
    selector: 'app-new-leads',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './new-leads.component.html',
    styleUrl: './new-leads.component.scss'
})
export class NewLeadsComponent {

    // isToggled
    isToggled = false;

    constructor(
        public themeService: CustomizerSettingsService,
        private newLeadsService: NewLeadsService
    ) {
        this.themeService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });
    }

    ngOnInit(): void {
        this.newLeadsService.loadChart();
    }

}