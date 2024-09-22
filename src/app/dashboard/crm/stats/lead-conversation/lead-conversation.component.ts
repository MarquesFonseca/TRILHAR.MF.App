import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LeadConversationService } from './lead-conversation.service';
import { CustomizerSettingsService } from '../../../../customizer-settings/customizer-settings.service';

@Component({
    selector: 'app-lead-conversation',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './lead-conversation.component.html',
    styleUrl: './lead-conversation.component.scss'
})
export class LeadConversationComponent {

    // isToggled
    isToggled = false;

    constructor(
        public themeService: CustomizerSettingsService,
        private leadConversationService: LeadConversationService
    ) {
        this.themeService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });
    }

    ngOnInit(): void {
        this.leadConversationService.loadChart();
    }

}