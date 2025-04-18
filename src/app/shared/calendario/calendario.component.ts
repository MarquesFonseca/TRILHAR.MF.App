import { Component, Input, Output, EventEmitter, OnInit, Inject } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormGroup, FormsModule, ReactiveFormsModule, FormBuilder, FormControl } from '@angular/forms';
import { MaterialModule } from '../../material.module';
import { MatDatepickerIntl } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { Subject, takeUntil } from 'rxjs';

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
    ReactiveFormsModule
  ],
  templateUrl: './calendario.component.html',
  styleUrl: './calendario.component.scss'
})
export class CalendarioComponent implements OnInit {

  @Input() formGroup = new FormGroup('');
  @Input() field: string = '';
  @Input() label: string = 'Selecione uma data';
  @Input() readonly: boolean = false;
  @Input() disabled: boolean = false;
  @Input('maxDate') maxDate = new Date('9999-12-31');
  @Input('minDate') minDate = new Date('1900-01-01');
  @Input() selectOtherMonths: boolean = false;

  @Output() itemSelecionado = new EventEmitter<DataOutPut>();

  get controle(): FormControl {
    return this.formGroup.get(this.field) as FormControl;
  }

  // FormControl interno para o componente
  //dateControl = new FormControl();

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private _adapter: DateAdapter<any>,
    private _intl: MatDatepickerIntl,
    @Inject(MAT_DATE_LOCALE) private _locale: string
  ) {
    this._locale = 'pt-br';
    this._adapter.setLocale(this._locale);
    this._intl.closeCalendarLabel = 'Fechar calendário';
    this._intl.changes.next();
  }

  ngOnInit() {
    // Se o formGroup e o field existirem, sincroniza o valor com o dateControl
    if (this.formGroup && this.field && this.formGroup.get(this.field)) {
      const fieldValue = this.formGroup.get(this.field)?.value;
      if (fieldValue) {
        this.controle.setValue(this.converterDataStringParaDate(fieldValue));
      }

      // Ouvir mudanças no controle do formulário pai
      this.formGroup.get(this.field)?.valueChanges.pipe(
        takeUntil(this.destroy$)
      ).subscribe(value => {
        if (value && value !== this.controle.value) {
          this.controle.setValue(this.converterDataStringParaDate(value));
        }
      });
    }

    // Se o formulário estiver desabilitado, desabilita o dateControl
    if (this.disabled) {
      this.controle.disable();
    }
  }

  onSelecionar(event: any) {
    if (event && event.value) {
      const dataSelecionada = event.value;

      const dataSeparada = {
        dia: dataSelecionada.getDate().toString().padStart(2, '0'),
        mes: (dataSelecionada.getMonth() + 1).toString().padStart(2, '0'),
        ano: dataSelecionada.getFullYear().toString().padStart(4, '0'),
        data: dataSelecionada,
        dataFormatada: dataSelecionada.toLocaleDateString('pt-BR')
      } as DataOutPut;

      // Atualiza o formGroup se ele existir
      if (this.formGroup && this.field) {
        this.formGroup.get(this.field)?.setValue(dataSelecionada);
      }

      // Emite o evento com os dados formatados
      this.itemSelecionado.emit(dataSeparada);
    }
  }

  converterDataStringParaDate(dataStr: string | Date): Date | null {
    // Se já for uma data, retorna ela mesma
    if (dataStr instanceof Date) {
        return dataStr;
    }

    // Se não for data, tenta converter de string
    if (!dataStr) return null;

    const partes = dataStr.split('/');
    if (partes.length !== 3) return null;

    const [dia, mes, ano] = partes.map(Number);
    if (isNaN(dia) || isNaN(mes) || isNaN(ano)) return null;

    // JavaScript usa mês de 0 a 11
    return new Date(ano, mes - 1, dia);
}

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
