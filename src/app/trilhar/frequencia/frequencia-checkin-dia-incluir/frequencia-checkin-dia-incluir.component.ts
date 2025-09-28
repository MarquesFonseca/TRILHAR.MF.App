import { CommonModule, Location } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { CustomizerSettingsService } from '../../../customizer-settings/customizer-settings.service';
import { MaterialModule } from '../../../material.module';
import { MensagemService } from '../../../services/mensagem.service';
import { CalendarioComponent, DataOutPut } from '../../../shared/calendario/calendario.component';
import { BaseListComponent } from '../../../shared/formulario/baseList';
import * as validar from '../../../shared/funcoes-comuns/validators/validator';

@Component({
  selector: 'app-frequencia-checkin-dia-incluir',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MaterialModule,
    CalendarioComponent
  ],
  templateUrl: './frequencia-checkin-dia-incluir.component.html',
  styleUrl: './frequencia-checkin-dia-incluir.component.scss'
})
export class FrequenciaCheckinDiaIncluirComponent extends BaseListComponent implements OnInit, OnDestroy {
  @ViewChild(CalendarioComponent) childCalendarioComponent!: CalendarioComponent;

  formularioCheckin!: FormGroup;

  // alternado
  isToggled = false;

  dataSelecionada: Date = new Date();
  maxData: Date = new Date();

  private subscriptions: Subscription = new Subscription();

  constructor(
    public themeService: CustomizerSettingsService,
    private fb: FormBuilder,
    private mensagemService: MensagemService,
    private location: Location,
    public override router: Router,
    public override activatedRoute: ActivatedRoute,
  ) {
    super(router, activatedRoute);
    this.themeService.isToggled$.subscribe((isToggled) => {
      this.isToggled = isToggled;
      if (!this.isProducao) console.clear();
    });
    this.maxData = new Date();
  }

  override ngOnInit() {
    this.carregaFormGroup();
    this.dataSelecionada = new Date();
    this.formularioCheckin.get('data')?.setValue(new Date());
  }

  override preencheFiltro(): void {
    throw new Error('Method not implemented.');
  }

  carregaFormGroup() {
    this.formularioCheckin = this.fb.group({
      data: [null, [Validators.required, validar.dataValidaValidator(), validar.dataNaoFuturaValidator()]],
    });
  }

  onDataSelecionada(dataSelecionada: DataOutPut): void {
    this.dataSelecionada = dataSelecionada.data;
    this.formularioCheckin.get('data')?.setValue(this.dataSelecionada);
    this.formularioCheckin.get('data')?.markAsDirty();
  }

  formatDate(date: Date): string {
    const d = new Date(date);
    const dia = String(d.getDate()).padStart(2, '0');
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const ano = d.getFullYear();
    return `${dia}-${mes}-${ano}`;
  }

  ngOnDestroy(): void {
    this.formularioCheckin.reset();
    this.subscriptions.unsubscribe();
  }

}
