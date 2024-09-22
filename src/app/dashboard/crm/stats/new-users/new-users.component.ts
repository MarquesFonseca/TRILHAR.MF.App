import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NewUsersService } from './new-users.service';
import { CustomizerSettingsService } from '../../../../customizer-settings/customizer-settings.service';

@Component({
    selector: 'app-new-users',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './new-users.component.html',
    styleUrl: './new-users.component.scss'
})
export class NewUsersComponent {

    // isToggled
    isToggled = false;

    constructor(
        public themeService: CustomizerSettingsService,
        private newUsersService: NewUsersService
    ) {
        this.themeService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });
    }

    ngOnInit(): void {
        this.newUsersService.loadChart();
    }

}