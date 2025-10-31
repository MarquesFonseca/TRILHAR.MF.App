import { Component } from '@angular/core';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MatExpansionModule } from '@angular/material/expansion';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { ToggleService } from './toggle.service';
import { CommonModule, NgClass } from '@angular/common';
import { CustomizerSettingsService } from '../../customizer-settings/customizer-settings.service';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [CommonModule, NgScrollbarModule, MatExpansionModule, RouterLinkActive, RouterModule, RouterLink, NgClass],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {

    // isSidebarToggled
    isSidebarToggled = false;

    // isToggled
    isToggled = false;

    isProducao = false;

    constructor(
        private toggleService: ToggleService,
        public themeService: CustomizerSettingsService
    ) {
        this.toggleService.isSidebarToggled$.subscribe(isSidebarToggled => {
            this.isSidebarToggled = isSidebarToggled;
        });
        this.themeService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });
        this.isProducao = environment.production;
    }

    // Burger Menu Toggle
    toggle() {
        this.toggleService.toggle();
    }

    // Fechar menu ao clicar em um link
    closeMenu() {
        if (this.isSidebarToggled) {
            this.toggleService.toggle();
        }
    }

    // Mat Expansion
    panelOpenState = false;

}
