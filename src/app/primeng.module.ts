import { NgModule } from '@angular/core';

// Botões e inputs
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { PasswordModule } from 'primeng/password';
import { CalendarModule } from 'primeng/calendar';

// Formulários e seleção
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { MultiSelectModule } from 'primeng/multiselect';
import { AutoCompleteModule } from 'primeng/autocomplete';

// Tabelas e dados
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { DataViewModule } from 'primeng/dataview';

// Layout e navegação
import { CardModule } from 'primeng/card';
import { ToolbarModule } from 'primeng/toolbar';
import { TabViewModule } from 'primeng/tabview';
import { AccordionModule } from 'primeng/accordion';
import { PanelModule } from 'primeng/panel';
import { StepsModule } from 'primeng/steps';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { SplitterModule } from 'primeng/splitter';

// Diálogos e feedback
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { TooltipModule } from 'primeng/tooltip';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@NgModule({
  exports: [
    // Botões e inputs
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    InputTextareaModule,
    PasswordModule,
    CalendarModule,

    // Formulários e seleção
    DropdownModule,
    CheckboxModule,
    RadioButtonModule,
    ToggleButtonModule,
    MultiSelectModule,
    AutoCompleteModule,

    // Tabelas e dados
    TableModule,
    PaginatorModule,
    DataViewModule,

    // Layout e navegação
    CardModule,
    ToolbarModule,
    TabViewModule,
    AccordionModule,
    PanelModule,
    StepsModule,
    MenuModule,
    MenubarModule,
    SplitterModule,

    // Diálogos e feedback
    DialogModule,
    ToastModule,
    ConfirmDialogModule,
    MessagesModule,
    MessageModule,
    TooltipModule,
    ProgressSpinnerModule,
  ],
})
export class PrimengModule {}
