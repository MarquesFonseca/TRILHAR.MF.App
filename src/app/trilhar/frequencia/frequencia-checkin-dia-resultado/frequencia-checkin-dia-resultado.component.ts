import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { CustomizerSettingsService } from '../../../customizer-settings/customizer-settings.service';
import { MaterialModule } from '../../../material.module';
import { MensagemService } from '../../../services/mensagem.service';
import { CalendarioComponent, DataOutPut } from '../../../shared/calendario/calendario.component';
import { BaseListComponent } from '../../../shared/formulario/baseList';
import { formatDataToFormatoAnoMesDia } from '../../../shared/funcoes-comuns/utils';
import * as validar from '../../../shared/funcoes-comuns/validators/validator';
import { FrequenciaService } from '../frequencia.service';
import { MatDialog } from '@angular/material/dialog';
import { FrequenciaCheckinDiaResultadoDetalhesModalComponent } from '../frequencia-checkin-dia-resultado-detalhes-modal/frequencia-checkin-dia-resultado-detalhes-modal.component';

@Component({
  selector: 'app-frequencia-checkin-dia-resultado',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MaterialModule,
    CalendarioComponent,
  ],
  templateUrl: './frequencia-checkin-dia-resultado.component.html',
  styleUrl: './frequencia-checkin-dia-resultado.component.scss'
})
export class FrequenciaCheckinDiaResultadoComponent extends BaseListComponent implements OnInit, OnDestroy {
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
    private dialog: MatDialog,
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
    var dataFormatada = formatDataToFormatoAnoMesDia(data);
    this.carregarTurmasAgrupadasPorData(dataFormatada);
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
            turmaDescricaoFormatada: 'GERAL',
            turmaIdadeInicialAlunoFormatada: '',
            turmaIdadeFinalAlunoFormatada: '',
            qtdRestante: somaTotalRestante,
            qtdRestanteFormatada: somaTotalRestante,
            dataFrequencia: this.turmasAgrupadas[0].dataFrequencia,
            dataFrequenciaFormatada: this.turmasAgrupadas[0].dataFrequenciaFormatada,
            turmaDescricao: 'GERAL',
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
    this.descricaoTuramaSelecionda = descricaoTurma;
    this.frequenciasPresentesTurmaEData = [];
    this.frequenciasAusentesTurmaEData = [];
    this.frequenciasPresentesTurmaEDataPossueAlergia = [];
    this.frequenciasPresentesTurmaEDataPossueRestricaoAlimentar = [];
    this.frequenciasPresentesTurmaEDataPossueNecessidadesEspeciais = [];
    this.frequenciasPresentesTurmaEDataPossueAniversario = [];
    if (codigoTurma == 0) {
      try {
        const ret: any = await this.frequenciaService.listarPorDataPromise(data.split('T')[0]);
        this.frequenciasPresentesTurmaEData = ret.dados
          .filter((x: any) => x.presenca == true && x.alunoAtivo == true)
          .sort((a: any, b: any) => {
            return a.dataFrequencia.localeCompare(b.dataFrequencia);
          });
        this.frequenciasAusentesTurmaEData = ret.dados
          .filter((x: any) => x.presenca == false && x.alunoAtivo == true)
          .sort((a: any, b: any) => {
            return a.alunoNomeCrianca.localeCompare(b.alunoNomeCrianca);
          });
        this.frequenciasPresentesTurmaEDataPossueAlergia = ret.dados
          .filter((x: any) => x.presenca == true && x.alunoAtivo == true && x.alunoAlergia == true)
          .sort((a: any, b: any) => {
            return a.alunoNomeCrianca.localeCompare(b.alunoNomeCrianca);
          });
        this.frequenciasPresentesTurmaEDataPossueRestricaoAlimentar = ret.dados
          .filter((x: any) => x.presenca == true && x.alunoAtivo == true && x.alunoRestricaoAlimentar == true)
          .sort((a: any, b: any) => {
            return a.alunoNomeCrianca.localeCompare(b.alunoNomeCrianca);
          });
        this.frequenciasPresentesTurmaEDataPossueNecessidadesEspeciais = ret.dados
          .filter((x: any) => x.presenca == true && x.alunoAtivo == true && x.alunoDeficienciaOuSituacaoAtipica == true)
          .sort((a: any, b: any) => {
            return a.alunoNomeCrianca.localeCompare(b.alunoNomeCrianca);
          });
        this.frequenciasPresentesTurmaEDataPossueAniversario = ret.dados
          .filter((x: any) => x.presenca == true && x.alunoAtivo == true && this.ehAniversarioNaData(x.alunoDataNascimento, this.dataSelecionada))
          .sort((a: any, b: any) => {
            return a.alunoNomeCrianca.localeCompare(b.alunoNomeCrianca);
          });
      } catch (err) {
        console.error('Erro:', err);
      }
    }
    if (codigoTurma > 0) {
      try {
        const ret: any = await this.frequenciaService.listarPorTurmaEDataPromise(codigoTurma, data.split('T')[0]);
        this.frequenciasPresentesTurmaEData = ret.dados
          .filter((x: any) => x.presenca == true && x.alunoAtivo == true)
          .sort((a: any, b: any) => {
            return a.dataFrequencia.localeCompare(b.dataFrequencia);
          });
        this.frequenciasAusentesTurmaEData = ret.dados
          .filter((x: any) => x.presenca == false && x.alunoAtivo == true)
          .sort((a: any, b: any) => {
            return a.alunoNomeCrianca.localeCompare(b.alunoNomeCrianca);
          });

        this.frequenciasPresentesTurmaEDataPossueAlergia = ret.dados
          .filter((x: any) => x.presenca == true && x.alunoAtivo == true && x.alunoAlergia == true)
          .sort((a: any, b: any) => {
            return a.alunoNomeCrianca.localeCompare(b.alunoNomeCrianca);
          });
        this.frequenciasPresentesTurmaEDataPossueRestricaoAlimentar = ret.dados
          .filter((x: any) => x.presenca == true && x.alunoAtivo == true && x.alunoRestricaoAlimentar == true)
          .sort((a: any, b: any) => {
            return a.alunoNomeCrianca.localeCompare(b.alunoNomeCrianca);
          });
        this.frequenciasPresentesTurmaEDataPossueNecessidadesEspeciais = ret.dados
          .filter((x: any) => x.presenca == true && x.alunoAtivo == true && x.alunoDeficienciaOuSituacaoAtipica == true)
          .sort((a: any, b: any) => {
            return a.alunoNomeCrianca.localeCompare(b.alunoNomeCrianca);
          });
        this.frequenciasPresentesTurmaEDataPossueAniversario = ret.dados
          .filter((x: any) => x.presenca == true && x.alunoAtivo == true && this.ehAniversarioNaData(x.alunoDataNascimento, this.dataSelecionada))
          .sort((a: any, b: any) => {
            return a.alunoNomeCrianca.localeCompare(b.alunoNomeCrianca);
          });
      } catch (err) {
        console.error('Erro:', err);
      }
    }
    this.abrirModalFrequencias(codigoTurma);
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

  abrirModalFrequencias(codigoTurmaSelecionada: number) {
    // Detecta se está em mobile ou desktop
    const isMobile = window.innerWidth <= 768;

    this.dialog.open(FrequenciaCheckinDiaResultadoDetalhesModalComponent, {
      width: isMobile ? '98vw' : '90vw',       // mais largo no desktop
      maxWidth: '100vw',
      maxHeight: '90vh',
      panelClass: isMobile ? 'dialog-mobile' : 'dialog-desktop',
      data: {
        dataSelecionada: this.dataSelecionada,
        codigoTurmaSelecionada: codigoTurmaSelecionada,
        descricaoTuramaSelecionda: this.descricaoTuramaSelecionda,
        frequenciasPresentesTurmaEData: this.frequenciasPresentesTurmaEData,
        frequenciasAusentesTurmaEData: this.frequenciasAusentesTurmaEData,
        frequenciasPresentesTurmaEDataPossueAlergia: this.frequenciasPresentesTurmaEDataPossueAlergia,
        frequenciasPresentesTurmaEDataPossueRestricaoAlimentar: this.frequenciasPresentesTurmaEDataPossueRestricaoAlimentar,
        frequenciasPresentesTurmaEDataPossueNecessidadesEspeciais: this.frequenciasPresentesTurmaEDataPossueNecessidadesEspeciais,
        frequenciasPresentesTurmaEDataPossueAniversario: this.frequenciasPresentesTurmaEDataPossueAniversario,
      }
    });
  }

}
