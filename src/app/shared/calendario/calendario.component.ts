import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, Inject, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MaterialModule } from '../../material.module';
import { MatDatepickerIntl } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { Subject, takeUntil } from 'rxjs';
import { DateMaskDirective } from './date-mask.directive';

// Formato de data brasileiro
export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  }
};

export interface DataOutPut {
  dia: string;
  mes: string;
  ano: string;
  data: Date;
  dataFormatada: string;
}

@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    DateMaskDirective
  ],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ],
  templateUrl: './calendario.component.html',
  styleUrl: './calendario.component.scss'
})
export class CalendarioComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() formGroup!: FormGroup;
  @Input() field: string = '';
  @Input() label: string = 'Selecione uma data';
  @Input() readonly: boolean = false;

  @Input() set disabled(value: boolean) {
    this._disabled = value;
    if (this.controle) {
      this.updateDisabledState();
    }
  }
  get disabled(): boolean {
    return this._disabled;
  }
  private _disabled: boolean = false;

  @Input('maxDate') maxDate = new Date('9999-12-31');
  @Input('minDate') minDate = new Date('1900-01-01');
  @Input() selectOtherMonths: boolean = false;

  @Output() itemSelecionado = new EventEmitter<DataOutPut>();

  get controle(): FormControl {
    return this.formGroup?.get(this.field) as FormControl;
  }

  private destroy$ = new Subject<void>();
  private isInitialized = false;

  constructor(
    private _adapter: DateAdapter<any>,
    private _intl: MatDatepickerIntl,
    @Inject(MAT_DATE_LOCALE) private _locale: string,
    private cdr: ChangeDetectorRef
  ) {
    this._locale = 'pt-BR';
    this._adapter.setLocale(this._locale);
    this._intl.closeCalendarLabel = 'Fechar calendário';
    this._intl.calendarLabel = 'Abrir calendário';
    this._intl.openCalendarLabel = 'Abrir calendário';
    this._intl.prevMonthLabel = 'Mês anterior';
    this._intl.nextMonthLabel = 'Próximo mês';
    this._intl.prevYearLabel = 'Ano anterior';
    this._intl.nextYearLabel = 'Próximo ano';
    this._intl.prevMultiYearLabel = 'Anos anteriores';
    this._intl.nextMultiYearLabel = 'Próximos anos';
    this._intl.switchToMonthViewLabel = 'Escolher mês';
    this._intl.switchToMultiYearViewLabel = 'Escolher ano';
    this._intl.changes.next();
  }

  ngOnInit() {
    if (!this.formGroup || !this.field) {
      throw new Error('formGroup e field são obrigatórios');
    }

    const field = this.formGroup.get(this.field);

    if (!field) {
      throw new Error(`Campo '${this.field}' não existe no formulário`);
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.initializeComponent();
      this.isInitialized = true;
      this.cdr.detectChanges();
    }, 0);
  }

  private initializeComponent() {
    const field = this.formGroup.get(this.field);

    if (!field) return;

    // Configura estado inicial
    this.updateDisabledState();

    // Sincroniza valor inicial
    const initialValue = field.value;
    if (initialValue) {
      const dateValue = this.converterDataStringParaDate(initialValue);
      if (dateValue) {
        field.setValue(dateValue, { emitEvent: false });
      }
    }

    // Escuta mudanças no controle do formulário
    field.valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe(value => {
      if (value && !(value instanceof Date)) {
        const dateValue = this.converterDataStringParaDate(value);
        if (dateValue) {
          field.setValue(dateValue, { emitEvent: false });
        }
      }
    });
  }

  private updateDisabledState(): void {
    if (this.controle) {
      if (this.disabled) {
        this.controle.disable({ emitEvent: false });
      }
    }
  }

  onSelecionar(event: any) {
    if (!this.isInitialized || this.readonly || this.disabled) return;

    if (event?.value) {
      this.processarEEmitirData(event.value);
    }
  }

  onBlur(event: any) {
    if (!this.isInitialized || this.readonly || this.disabled) return;

    const inputValue = event.target.value;
    if (inputValue) {
      const data = this.converterDataStringParaDate(inputValue);
      if (data) {
        this.controle.setValue(data);
        this.processarEEmitirData(data);
      } else {
        this.controle.setValue(inputValue);
      }
    }
  }

  onInput(event: any) {
    if (!this.isInitialized || this.readonly || this.disabled) return;

    const inputValue = event.target.value;
    if (inputValue.length === 10) {
      const data = this.converterDataStringParaDate(inputValue);
      if (data) {
        this.controle.setValue(data);
      }
    }
  }

  private processarEEmitirData(data: Date): void {
    const dataSelecionada = new Date(data);

    const dataSeparada: DataOutPut = {
      dia: dataSelecionada.getDate().toString().padStart(2, '0'),
      mes: (dataSelecionada.getMonth() + 1).toString().padStart(2, '0'),
      ano: dataSelecionada.getFullYear().toString().padStart(4, '0'),
      data: dataSelecionada,
      dataFormatada: dataSelecionada.toLocaleDateString('pt-BR')
    };

    if (this.formGroup && this.field) {
      const field = this.formGroup.get(this.field);
      if (field) {
        field.setValue(dataSelecionada, { emitEvent: false });
        field.markAsTouched();
      }
    }

    this.itemSelecionado.emit(dataSeparada);
  }

  converterDataStringParaDate(dataStr: string | Date): Date | null {
    if (dataStr instanceof Date) {
      return isNaN(dataStr.getTime()) ? null : dataStr;
    }

    if (!dataStr) return null;

    dataStr = dataStr.trim();

    const partesBr = dataStr.split('/');
    if (partesBr.length === 3) {
      const dia = parseInt(partesBr[0], 10);
      const mes = parseInt(partesBr[1], 10);
      const ano = parseInt(partesBr[2], 10);

      if (!isNaN(dia) && !isNaN(mes) && !isNaN(ano)) {
        if (dia >= 1 && dia <= 31 && mes >= 1 && mes <= 12 && ano >= 100) {
          const date = new Date(ano, mes - 1, dia);

          if (!isNaN(date.getTime()) &&
            date.getDate() === dia &&
            date.getMonth() === mes - 1 &&
            date.getFullYear() === ano) {
            return date;
          }
        }
      }
    }

    return null;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
