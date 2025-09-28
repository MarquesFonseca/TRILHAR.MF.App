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
import { ehAniversarioNaData, isDate, retornaIdadeFormatadaAnoMesDia } from '../../../shared/funcoes-comuns/utils';
import * as validar from '../../../shared/funcoes-comuns/validators/validator';
import { FrequenciaService } from '../frequencia.service';
import { AutoCompleteComponent } from '../../../shared/auto-complete/auto-complete.component';
import * as types from '../../crianca/crianca.types';
import { CriancaService } from '../../crianca/crianca.service';
import { isNullOrEmpty } from '../../../shared/funcoes-comuns/utils';

@Component({
  selector: 'app-frequencia-checkin-dia-incluir-data',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MaterialModule,
    CalendarioComponent,
    AutoCompleteComponent
  ],
  templateUrl: './frequencia-checkin-dia-incluir-data.component.html',
  styleUrl: './frequencia-checkin-dia-incluir-data.component.scss'
})
export class FrequenciaCheckinDiaIncluirDataComponent extends BaseListComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(CalendarioComponent) childCalendarioComponent!: CalendarioComponent;
  @ViewChild(AutoCompleteComponent) childAutoCompleteComponent!: AutoCompleteComponent;

  formularioCheckin!: FormGroup;

  listaAlunosAutoComplete: any[] = [];

  alunoAtual: any;

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
    private criancaService: CriancaService,
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

    this.setDataFromParam(this.activatedRoute.snapshot.params['data']);

    setTimeout(async () => {
      this.carregaListaAlunosAutoComplete();
    }, 100);
  }

  override preencheFiltro(): void {
    throw new Error('Method not implemented.');
  }

  carregaFormGroup() {
    this.formularioCheckin = this.fb.group({
      data: [null],
      codigo: [0],
      codigoCadastro: [''],
      alunoSelecionado: [null]
    });
  }

  setDataFromParam(dataStr?: string) {
    if (dataStr && dataStr.length === 10) {
      const [dia, mes, ano] = dataStr.split('-').map(Number);
      const data = new Date(ano, mes - 1, dia);
      this.dataSelecionada = data;
    } else {
      this.dataSelecionada = new Date();
    }
    this.formularioCheckin.get('data')?.setValue(this.dataSelecionada);
  }

  private carregaListaAlunosAutoComplete() {
    var filtro: types.IAlunoInput = new types.IAlunoInput();
    filtro.isPaginacao = false;
    this.criancaService.listarPorFiltro(filtro, (res: any) => {
      if (!!res?.dados) {
        var alunoOutput: types.IAlunoOutput[] = res.dados.dados;
        this.listaAlunosAutoComplete = alunoOutput.map(item => ({
          id: item.codigo,
          codigoCadastro: item.codigoCadastro,
          descricao: `${item.codigoCadastro} - ${item.nomeCrianca}`,
        })) || [];
      }
    });
  }

  private carregaAlunoSelecionadoAutoComplete() {
    var filtro: types.IAlunoInput = new types.IAlunoInput();
    filtro.isPaginacao = true;
    filtro.codigo = this.formularioCheckin.get('codigo')?.value;
    this.criancaService.listarPorFiltro(filtro, (res: any) => {
      if (!!res?.dados) {
        var alunoOutput: types.IAlunoOutput[] = res.dados.dados;
        this.alunoAtual = alunoOutput[0] || {};
        // this.alunoAtual.dataNascimento = new Date(this.alunoAtual.dataNascimento);
        this.alunoAtual.idadeCrianca = `${new Date(this.alunoAtual.dataNascimento)?.toLocaleDateString('pt-BR')} - ${retornaIdadeFormatadaAnoMesDia(new Date(this.alunoAtual.dataNascimento))}`;
      }
    });
  }

  public onListaAlunosAutoCompleteSelecionado(alunoSelecionada: any): void {
    if (alunoSelecionada) {
      this.formularioCheckin.patchValue({
        codigo: alunoSelecionada.id,
        codigoCadastro: alunoSelecionada.codigoCadastro,
        alunoSelecionado: alunoSelecionada
      });
      this.carregaAlunoSelecionadoAutoComplete.call(this);
    }
  }

  onRegistrarFrequencias() {
    if (this.formularioCheckin.invalid) {
      this.formularioCheckin.markAllAsTouched();
      this.mensagemService.showInfo('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    const data = this.formularioCheckin.get('data')?.value;
    if (!data) {
      this.mensagemService.showInfo('Data inválida. Por favor, selecione uma data válida.');
      return;
    }
    const alunoSelecionado = this.formularioCheckin.get('alunoSelecionado')?.value;
    if (!alunoSelecionado) {
      this.mensagemService.showInfo('Aluno inválido. Por favor, selecione um aluno válido.');
      return;
    }
    const codigoCadastro = this.formularioCheckin.get('codigoCadastro')?.value;
    if (!codigoCadastro) {
      this.mensagemService.showInfo('Código de cadastro inválido. Por favor, selecione um aluno válido.');
      return;
    }
    // this.frequenciaService.registrarFrequenciaDiaParaAluno(codigoCadastro, data.toISOString().split('T')[0], (res: any) => {
    //   if (res.sucesso) {
    //     this.mensagemService.showSuccess('Frequência registrada com sucesso!');
    //     this.formularioCheckin.get('alunoSelecionado')?.setValue(null);
    //     this.formularioCheckin.get('codigoCadastro')?.setValue('');
    //     this.formularioCheckin.get('codigo')?.setValue(0);
    //     this.childAutoCompleteComponent.limparSelecao();
    //     this.carregarTurmasAgrupadasPorData(data.toISOString().split('T')[0]);
    //   } else {
    //     this.mensagemService.showError(res.mensagem || 'Erro ao registrar frequência. Tente novamente.');
    //   }
    // });
  }

  onDataSelecionada(dataSelecionada: DataOutPut): void {
    this.dataSelecionada = dataSelecionada.data;
    this.formularioCheckin.get('data')?.setValue(this.dataSelecionada);
    this.formularioCheckin.get('data')?.markAsDirty();
    // this.carregarTurmasAgrupadasPorData(dataSelecionada.data.toISOString().split('T')[0]);
  }

  onBuscarFrequencias() {
    if (this.formularioCheckin.invalid) {
      this.formularioCheckin.markAllAsTouched();
      this.mensagemService.showInfo('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    const data = this.formularioCheckin.get('data')?.value;
    if (!data) {
      this.mensagemService.showInfo('Data inválida. Por favor, selecione uma data válida.');
      return;
    }

    this.dataSelecionada = data;
    this.formularioCheckin.get('data')?.setValue(this.dataSelecionada);
    this.formularioCheckin.get('data')?.markAsDirty();
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
      this.frequenciasPresentesTurmaEDataPossueAniversario = ret.dados.filter((x: any) => x.presenca == true && x.alunoAtivo == true && ehAniversarioNaData(x.alunoDataNascimento, this.dataSelecionada));

    } catch (err) {
      console.error('Erro:', err);
    }
  }

  ngOnDestroy(): void {
    this.turmasAgrupadas = [];
    this.frequenciasPresentesTurmaEData = [];
    this.frequenciasAusentesTurmaEData = [];
    this.descricaoTuramaSelecionda = '';
    this.formularioCheckin.reset();
    this.subscriptions.unsubscribe();
  }

  getCorSala(nome: string | undefined): string {
    if (!nome) return 'black';

    const mapa: { [key: string]: string } = {
      'BRANCO': '#cccccc',
      'LILÁS': '#c8a2c8',
      'LARANJA': 'orange',
      'VERMELHO': 'red',
      'VERDE': 'green',
      'AZUL CLARO': 'deepskyblue'
    };

    const chave = Object.keys(mapa).find(cor => nome.toUpperCase().includes(cor));
    return chave ? mapa[chave] : 'black';
  }

}
