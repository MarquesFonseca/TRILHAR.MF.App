import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { MatPaginator } from '@angular/material/paginator';
import { CustomizerSettingsService } from '../../../customizer-settings/customizer-settings.service';
import { BaseListComponent } from '../../../shared/formulario/baseList';
import { FrequenciaService } from '../frequencia.service';
import { MensagemService } from '../../../services/mensagem.service';
import { Subscription } from 'rxjs';
import { CalendarioComponent, DataOutPut } from '../../../shared/calendario/calendario.component';
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

  dataSelecionada: Date = new Date();
  descricaoTuramaSelecionda: string = '';
  maxData: Date = new Date();
  turmasAgrupadas: any[] = [];
  frequenciasPresentesTurmaEData: any[] = [];
  frequenciasAusentesTurmaEData: any[] = [];
  frequenciasPresentesTurmaEDataPossueAlergia: any[] = [];
  frequenciasPresentesTurmaEDataPossueRestricaoAlimentar: any[] = [];
  frequenciasPresentesTurmaEDataPossueNecessidadesEspeciais: any[] = [];
  frequenciasPresentesTurmaEDataPossueAniversario: any[] = [];
  //frequencias: any[] = [];
  //frequenciaDetalhe: any;

  private subscriptions: Subscription = new Subscription();

  constructor(
    public themeService: CustomizerSettingsService,
    private fb: FormBuilder,
    private frequenciaService: FrequenciaService,
    private mensagemService: MensagemService,
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

    this.dataSelecionada = new Date();
    this.formulario.get('data')?.setValue(new Date());
    //this.carregarTurmasAgrupadasPorData(this.retornaDataHoje());
  }

  carregaFormGroup() {
    this.formulario = this.fb.group({
      data: [null, [Validators.required, validar.dataValidaValidator(), validar.dataNaoFuturaValidator()]],
    });
  }

  onDataSelecionada(dataSelecionada: DataOutPut): void {
    this.dataSelecionada = dataSelecionada.data;
    this.formulario.get('data')?.setValue(this.dataSelecionada);
    this.formulario.get('data')?.markAsDirty();
    // this.carregarTurmasAgrupadasPorData(dataSelecionada.data.toISOString().split('T')[0]);
  }

  onBuscarFrequencias() {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      this.mensagemService.showInfo('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    const data = this.formulario.get('data')?.value;
    if (!data) {
      this.mensagemService.showInfo('Data inválida. Por favor, selecione uma data válida.');
      return;
    }

    this.dataSelecionada = data;
    this.formulario.get('data')?.setValue(this.dataSelecionada);
    this.formulario.get('data')?.markAsDirty();
    this.carregarTurmasAgrupadasPorData(data.toISOString().split('T')[0]);
  }

  carregarTurmasAgrupadasPorData(data: string): void {
    this.turmasAgrupadas = [];
    this.frequenciasPresentesTurmaEData = [];
    this.frequenciasAusentesTurmaEData = [];
    this.descricaoTuramaSelecionda = '';

    this.frequenciasPresentesTurmaEDataPossueAlergia = [];
    this.frequenciasPresentesTurmaEDataPossueRestricaoAlimentar = [];
    this.frequenciasPresentesTurmaEDataPossueNecessidadesEspeciais = [];
    this.frequenciasPresentesTurmaEDataPossueAniversario = [];

    const sub = this.frequenciaService.listarTurmasAgrupadasPorData(data)
      .subscribe({
        next: (ret: any) => {
          if (ret.dados == null) {
            return;
          }
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

            qtdAlergia: turma.qtdAlergia,
            qtdRestricaoAlimentar: turma.qtdRestricaoAlimentar,
            qtdNecessidadesEspeciais: turma.qtdNecessidadesEspeciais,
            qtdAniversariantes: turma.qtdAniversariantes,
          }));
          var somaTotalQtd = this.turmasAgrupadas.reduce((acc, turma) => acc + turma.qtd, 0);
          var somaTotalLimiteMaximo = this.turmasAgrupadas.reduce((acc, turma) => acc + turma.turmaLimiteMaximo, 0);
          var somaTotalRestante = this.turmasAgrupadas.reduce((acc, turma) => acc + turma.qtdRestante, 0);

          var somaTotalAlergia = this.turmasAgrupadas.reduce((acc, turma) => acc + turma.qtdAlergia, 0);
          var somaTotalRestricaoAlimentar = this.turmasAgrupadas.reduce((acc, turma) => acc + turma.qtdRestricaoAlimentar, 0);
          var somaTotalNecessidadesEspeciais = this.turmasAgrupadas.reduce((acc, turma) => acc + turma.qtdNecessidadesEspeciais, 0);
          var somaTotalAniversariantes = this.turmasAgrupadas.reduce((acc, turma) => acc + turma.qtdAniversariantes, 0);

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
            qtd: somaTotalQtd,

            qtdAlergia: somaTotalAlergia,
            qtdRestricaoAlimentar: somaTotalRestricaoAlimentar,
            qtdNecessidadesEspeciais: somaTotalNecessidadesEspeciais,
            qtdAniversariantes: somaTotalAniversariantes,
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
      var ret: any = await this.frequenciaService.listarPorTurmaEDataPromise(codigoTurma, data.split('T')[0]);
      this.frequenciasPresentesTurmaEData = ret.dados.filter((x: any) => x.presenca == true && x.alunoAtivo == true);
      this.frequenciasAusentesTurmaEData = ret.dados
        .filter((x: any) => x.presenca == false && x.alunoAtivo == true)
        .sort((a: any, b: any) => {
          // Ordenação por nome de forma ascendente (A-Z)
          return a.alunoNomeCrianca.localeCompare(b.alunoNomeCrianca);
        });

      this.frequenciasPresentesTurmaEDataPossueAlergia = ret.dados.filter((x: any) => x.presenca == true && x.alunoAtivo == true && x.alunoAlergia == true);
      this.frequenciasPresentesTurmaEDataPossueRestricaoAlimentar = ret.dados.filter((x: any) => x.presenca == true && x.alunoAtivo == true && x.alunoRestricaoAlimentar == true);
      this.frequenciasPresentesTurmaEDataPossueNecessidadesEspeciais = ret.dados.filter((x: any) => x.presenca == true && x.alunoAtivo == true && x.alunoDeficienciaOuSituacaoAtipica == true);
      this.frequenciasPresentesTurmaEDataPossueAniversario = ret.dados.filter((x: any) => x.presenca == true && x.alunoAtivo == true && this.ehAniversarioNaData(x.alunoDataNascimento, this.dataSelecionada));

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

  /**
   * Verifica se a pessoa faz aniversário em uma data específica
   * @param dataNascimento - Data de nascimento
   * @param dataReferencia - Data para verificar (opcional, padrão é hoje)
   * @returns true se for aniversário na data de referência, false caso contrário
   */
  ehAniversarioNaData(
    dataNascimento: string | Date,
    dataReferencia: string | Date = new Date()
  ): boolean {
    try {
      const nascimento = typeof dataNascimento === 'string' ? new Date(dataNascimento) : dataNascimento;
      const referencia = typeof dataReferencia === 'string' ? new Date(dataReferencia) : dataReferencia;

      // Validações
      if (isNaN(nascimento.getTime()) || isNaN(referencia.getTime())) {
        return false;
      }

      return nascimento.getMonth() === referencia.getMonth() &&
            nascimento.getDate() === referencia.getDate();
    } catch (error) {
      console.error('Erro ao verificar aniversário:', error);
      return false;
    }
  }
}
