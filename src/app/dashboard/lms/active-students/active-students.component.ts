import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink } from '@angular/router';
import { CustomizerSettingsService } from '../../../customizer-settings/customizer-settings.service';
import { ActiveStudentsService } from './active-students.service';

@Component({
    selector: 'app-active-students',
    standalone: true,
    imports: [MatCardModule, MatMenuModule, MatButtonModule, RouterLink],
    templateUrl: './active-students.component.html',
    styleUrl: './active-students.component.scss'
})
export class ActiveStudentsComponent {

    // isToggled
    isToggled = false;

    constructor(
        public themeService: CustomizerSettingsService,
        private activeStudentsService: ActiveStudentsService
    ) {
        this.themeService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });
    }

    ngOnInit(): void {
        this.activeStudentsService.loadChart();
    }

}