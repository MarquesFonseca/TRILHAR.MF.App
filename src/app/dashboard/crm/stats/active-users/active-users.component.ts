import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ActiveUsersService } from './active-users.service';
import { CustomizerSettingsService } from '../../../../customizer-settings/customizer-settings.service';

@Component({
    selector: 'app-active-users',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './active-users.component.html',
    styleUrl: './active-users.component.scss'
})
export class ActiveUsersComponent {

    // isToggled
    isToggled = false;

    constructor(
        public themeService: CustomizerSettingsService,
        private activeUsersService: ActiveUsersService
    ) {
        this.themeService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });
    }

    ngOnInit(): void {
        this.activeUsersService.loadChart();
    }

}