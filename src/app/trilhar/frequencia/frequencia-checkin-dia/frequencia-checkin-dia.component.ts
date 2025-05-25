import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CustomizerSettingsService } from '../../../customizer-settings/customizer-settings.service';
import { BaseListComponent } from '../../../shared/formulario/baseList';
import { FrequenciaService } from '../frequencia.service';
import { CriancaService } from '../../crianca/crianca.service';
import { MensagemService } from '../../../services/mensagem.service';
import { Subscription, map } from 'rxjs';
import { LoadingService } from '../../../services/loading.service';
import { CalendarioComponent, DataOutPut } from '../../../shared/calendario/calendario.component';
import * as utils from '../../../shared/funcoes-comuns/utils';
import * as validar from '../../../shared/funcoes-comuns/validators/validator';

@Component({
  selector: 'app-frequencia-checkin-dia',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MaterialModule,
    CalendarioComponent,
  ],
  templateUrl: './frequencia-checkin-dia.component.html',
  styleUrl: './frequencia-checkin-dia.component.scss'
})
export class FrequenciaCheckinDiaComponent extends BaseListComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(CalendarioComponent) childCalendarioComponent!: CalendarioComponent;

  formulario!: FormGroup;

  // alternado
  isToggled = false;

  descricaoTuramaSelecionda: string = '';
  maxData: Date = new Date();
  turmasAgrupadas: any[] = [];
  frequenciasPresentesTurmaEData: any[] = [];
  frequenciasAusentesTurmaEData: any[] = [];
  frequenciasPresentesTurmaEDataPossueAlergia: any[] = [];
  frequenciasPresentesTurmaEDataPossueRestricaoAlimentar: any[] = [];
  frequenciasPresentesTurmaEDataPossueNecessidadesEspeciais: any[] = [];
  //frequencias: any[] = [];
  //frequenciaDetalhe: any;

  private subscriptions: Subscription = new Subscription();

  constructor(
    public themeService: CustomizerSettingsService,
    private fb: FormBuilder,
    private frequenciaService: FrequenciaService,
    public override router: Router,
    public override activatedRoute: ActivatedRoute,
  ) {
    super(router, activatedRoute);
    this.themeService.isToggled$.subscribe((isToggled) => {
      this.isToggled = isToggled;
      if (!this.isProducao) console.clear();
    });
    this.descricaoTuramaSelecionda = '';
    this.maxData = new Date();
  }

  override ngOnInit() {
    this.carregaFormGroup();

    this.formulario.get('data')?.setValue(new Date());
    this.carregarTurmasAgrupadasPorData(this.retornaDataHoje());
  }

  carregaFormGroup() {
    this.formulario = this.fb.group({
      data: [null, [Validators.required, validar.dataValidaValidator(), validar.dataNaoFuturaValidator()]],
    });
  }

  onDataSelecionada(dataSelecionada: DataOutPut): void {
    this.carregarTurmasAgrupadasPorData(dataSelecionada.data.toISOString().split('T')[0]);
  }

  carregarTurmasAgrupadasPorData(data: string): void {
    this.turmasAgrupadas = [];
    this.frequenciasPresentesTurmaEData = [];
    this.frequenciasAusentesTurmaEData = [];
    this.descricaoTuramaSelecionda = '';

    this.frequenciasPresentesTurmaEDataPossueAlergia = [];
    this.frequenciasPresentesTurmaEDataPossueRestricaoAlimentar = [];
    this.frequenciasPresentesTurmaEDataPossueNecessidadesEspeciais = [];

    const sub = this.frequenciaService.listarTurmasAgrupadasPorData(data)
      .subscribe({
        next: (ret: any) => {
          this.turmasAgrupadas = ret.dados.map((turma: any) => ({
            codigoTurma: turma.codigoTurma, //31
            turmaDescricaoFormatada: turma.turmaDescricaoFormatada, //"BRANCO (0 A 11 M 29 D) - 2025/1",
            turmaIdadeInicialAlunoFormatada: turma.turmaIdadeInicialAlunoFormatada, //"01/03/2024",
            turmaIdadeFinalAlunoFormatada: turma.turmaIdadeFinalAlunoFormatada, //"30/07/2025",
            qtdRestante: turma.qtdRestante, //3,
            qtdRestanteFormatada: turma.qtdRestanteFormatada, //"+3",
            dataFrequencia: turma.dataFrequencia, //"2025-05-11T00:00:00",
            dataFrequenciaFormatada: turma.dataFrequenciaFormatada, //"11/05/2025",
            turmaDescricao: turma.turmaDescricao, //"BRANCO (0 A 11 M 29 D)",
            turmaAnoLetivo: turma.turmaAnoLetivo, //2025,
            turmaSemestreLetivo: turma.turmaSemestreLetivo, //1,
            turmaIdadeInicialAluno: turma.turmaIdadeInicialAluno, //"2024-03-01T00:00:00",
            turmaIdadeFinalAluno: turma.turmaIdadeFinalAluno, //"2025-07-30T00:00:00",
            turmaAtivo: turma.turmaAtivo, //true,
            turmaLimiteMaximo: turma.turmaLimiteMaximo, //8,
            qtd: turma.qtd, //11
          }));
          var somaTotalQtd = this.turmasAgrupadas.reduce((acc, turma) => acc + turma.qtd, 0);
          var somaTotalLimiteMaximo = this.turmasAgrupadas.reduce((acc, turma) => acc + turma.turmaLimiteMaximo, 0);
          var somaTotalRestante = this.turmasAgrupadas.reduce((acc, turma) => acc + turma.qtdRestante, 0);
          this.turmasAgrupadas.push({
            codigoTurma: 0,
            turmaDescricaoFormatada: 'TOTAL',
            turmaIdadeInicialAlunoFormatada: '',
            turmaIdadeFinalAlunoFormatada: '',
            qtdRestante: somaTotalRestante,
            qtdRestanteFormatada: somaTotalRestante,
            dataFrequencia: '',
            dataFrequenciaFormatada: '',
            turmaDescricao: 'TOTAL',
            turmaAnoLetivo: 0,
            turmaSemestreLetivo: 0,
            turmaIdadeInicialAluno: '',
            turmaIdadeFinalAluno: '',
            turmaAtivo: true,
            turmaLimiteMaximo: somaTotalLimiteMaximo,
            qtd: somaTotalQtd
          });
        },
        error: (err) => {
          console.error('Erro ao carregar turmas agrupadas:', err);
        }
      });

    this.subscriptions.add(sub);
  }

  async carregarFrequenciasTurma(codigoTurma: number, descricaoTurma: string, data: string) {
    if (codigoTurma == 0) {
      return;
    }
    this.descricaoTuramaSelecionda = descricaoTurma;
    try {
      var ret: any = await this.frequenciaService.listarPorTurmaEDataPromise(codigoTurma, data);
      this.frequenciasPresentesTurmaEData = ret.dados.filter((x: any) => x.presenca == true && x.alunoAtivo == true);
      this.frequenciasAusentesTurmaEData = ret.dados
        .filter((x: any) => x.presenca == false && x.alunoAtivo == true)
        .sort((a: any, b: any) => {
          // Ordenação por nome de forma ascendente (A-Z)
          return a.alunoNomeCrianca.localeCompare(b.alunoNomeCrianca);
        });

      this.frequenciasPresentesTurmaEDataPossueAlergia = ret.dados.filter((x: any) => x.presenca == true && x.alunoAlergia == true);
      this.frequenciasPresentesTurmaEDataPossueRestricaoAlimentar = ret.dados.filter((x: any) => x.presenca == true && x.alunoRestricaoAlimentar == true);
      this.frequenciasPresentesTurmaEDataPossueNecessidadesEspeciais = ret.dados.filter((x: any) => x.presenca == true && x.alunoDeficienciaOuSituacaoAtipica == true);

    } catch (err) {
      console.error('Erro:', err);
    }
  }

  override preencheFiltro(): void {
    throw new Error('Method not implemented.');
  }

  ngOnDestroy(): void {
    this.turmasAgrupadas = [];
    this.frequenciasPresentesTurmaEData = [];
    this.frequenciasAusentesTurmaEData = [];
    this.descricaoTuramaSelecionda = '';
    this.formulario.reset();
    this.subscriptions.unsubscribe();
  }

  retornaDataHoje(): string {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, '0'); // +1 porque janeiro é 0
    const dia = String(hoje.getDate()).padStart(2, '0');

    const dataFormatada = `${ano}-${mes}-${dia}`;
    return dataFormatada;
  }
}
