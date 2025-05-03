import { CustomizerSettingsService } from '../../../customizer-settings/customizer-settings.service';
import { Component, Inject, OnInit, PLATFORM_ID, OnDestroy, Pipe } from '@angular/core';
import { CommonModule, NgIf, isPlatformBrowser, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseFormComponent } from '../../../shared/formulario/baseForms';
import { MaterialModule } from '../../../material.module';
import { Chart, registerables } from 'chart.js';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as types from './frequencia-dashboard.types';
import { FrequenciaService } from '../frequencia.service';
import { AbsPipe } from './abs.pipe';

// Registrar todos os componentes do Chart.js
Chart.register(...registerables);

@Component({
  selector: 'app-frequencia-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    NgIf,
    DatePipe,
    AbsPipe
  ],
  templateUrl: './frequencia-dashboard.component.html',
  styleUrl: './frequencia-dashboard.component.scss'
})
export class FrequenciaDashboardComponent extends BaseFormComponent implements OnInit, OnDestroy {

  dataInicial: Date = new Date();
  dataFinal: Date = new Date();
  private isBrowser: boolean;
  private destroy$ = new Subject<void>();
  filtroForm!: FormGroup;

  // Propriedades para armazenar dados
  dadosFrequencia: types.FrequenciaData[] = [];
  todasTurmas: string[] = [];
  turmasAtivas: string[] = [];

  // Estatísticas gerais
  totalFrequencias = 0;
  totalPresentes = 0;
  totalAusentes = 0;
  taxaPresencaGeral = 0;

  // Estatísticas da data atual
  frequenciaHoje: types.FrequenciaStats = { presentes: 0, ausentes: 0, total: 0, taxaPresenca: 0 };
  frequenciaTurmasHoje: types.FrequenciaTurma[] = [];

  // Estatísticas por período
  frequenciaPorDia: types.FrequenciaPeriodo[] = [];
  frequenciaPorMes: types.FrequenciaPeriodo[] = [];
  frequenciaPorAno: types.FrequenciaPeriodo[] = [];

  // Frequência por turma no período
  frequenciaPorTurma: types.FrequenciaTurma[] = [];
  frequenciaTurmaPorDia: Record<string, types.FrequenciaPeriodo[]> = {};
  frequenciaTurmaPorMes: Record<string, types.FrequenciaPeriodo[]> = {};

  // Tendências e estatísticas adicionais
  diasMaiorPresenca: types.FrequenciaDiaria[] = [];
  diasMenorPresenca: types.FrequenciaDiaria[] = [];
  turmaMaiorPresenca: types.FrequenciaTurma | null = null;
  turmaMenorPresenca: types.FrequenciaTurma | null = null;

  // Propriedades para armazenar referências dos gráficos
  chartFrequenciaGeral: Chart | null = null;
  chartFrequenciaHoje: Chart | null = null;
  chartTurmasHoje: Chart | null = null;
  chartFrequenciaPorDia: Chart | null = null;
  chartFrequenciaPorMes: Chart | null = null;
  chartFrequenciaPorAno: Chart | null = null;
  chartFrequenciaPorTurma: Chart | null = null;
  chartTendenciaTurmas: Chart | null = null;
  chartComparativoTurmas: Chart | null = null;

  // Propriedade para controle de carregamento
  carregando = true;
  erro: string | null = null;
  filtroAplicado = false;
  tipoVisualizacao: 'dia' | 'mes' | 'ano' = 'mes';

  constructor(
    public themeService: CustomizerSettingsService,
    private fb: FormBuilder,
    private frequenciaService: FrequenciaService,
    public override router: Router,
    public override activatedRoute: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    super(router, activatedRoute);
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.currentDate = new Date().toISOString();

    // Inicializar datas para o último mês
    this.dataFinal = new Date();
    this.dataInicial = new Date();
    this.dataInicial.setMonth(this.dataInicial.getMonth() - 1);
  }

  override salvar(): void {
    throw new Error('Method not implemented.');
  }
  override preencheFormulario(): void {
    throw new Error('Method not implemented.');
  }
  override carregaFormGroup(): void {
    throw new Error('Method not implemented.');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

    // Limpar referências de gráficos para evitar memory leaks
    this.destruirGraficos();
  }

  override ngOnInit(): void {
    this.inicializarFormulario();
    this.carregarDados();
  }

  private inicializarFormulario(): void {
    this.filtroForm = this.fb.group({
      dataInicio: [this.formatarData(this.dataInicial), Validators.required],
      dataFim: [this.formatarData(this.dataFinal), Validators.required],
      turma: [''],
      apenasAtivas: [true]
    });
  }

  private formatarData(data: Date): string {
    return data.toISOString().split('T')[0];
  }

  // Aplicar filtros quando o formulário for submetido
  async aplicarFiltro() {
    if (this.filtroForm.valid) {
      this.filtroAplicado = true;
      await this.carregarDados();
    }
  }

  // Alternar entre visualização diária, mensal e anual
  alternarVisualizacao(tipo: 'dia' | 'mes' | 'ano'): void {
    this.tipoVisualizacao = tipo;
    this.atualizarGraficosPorPeriodo();
  }

  async carregarDados() {
    this.carregando = true;
    this.erro = null;



    // Para este exemplo, vamos simular o carregamento e depois chamar o método de processamento
    setTimeout(async () => {
      await this.simularCarregamentoDados();
      //this.processarDados(dadosMapeados);
    }, 1000);
  }

  private montaFiltro(page: number, pageSize: number) {
    var filtro = {
      //condicao: "Ativo = @Ativo",
      // parametros: {
      //   Ativo: true,
      //   CodigoCadastro: "1484"
      // },
      isPaginacao: false,
      page: page,
      pageSize: pageSize
    }

    return filtro;
  }

  private getFiltro(): types.FiltroFrequencia {
    const formValues = this.filtroForm.value;
    return {
      dataInicio: formValues.dataInicio,
      dataFim: formValues.dataFim,
      turma: formValues.turma || undefined,
      apenasAtivas: formValues.apenasAtivas
    };
  }

  // Método para simular dados para o dashboard
  async simularCarregamentoDados(): Promise<void> {
    // Simular datas para o período de um mês
    const dataFinal = new Date();
    const dataInicial = new Date();
    dataInicial.setMonth(dataInicial.getMonth() - 1);

    // Simular turmas
    const turmas = [
      "BRANCO (0 A 11 M 29 D)",
      "LILÁS 1 (1 ANO)",
      "LILÁS (2 ANOS)",
      "LARANJA 1 (3 ANOS)",
      "LARANJA 2 (4 ANOS)",
      "VERMELHO 1 (5 ANOS)",
      "VERMELHO 2 (6 ANOS)",
      "VERDE 1 (7 ANOS)",
      "VERDE 2 (8 ANOS)",
      "AZUL CLARO 1 (9 ANOS)",
      "AZUL CLARO 2 (10 ANOS)",
      "AZUL ESCURO (11 ANOS)",
      "CINZA (12 ANOS)"
    ];

    // Simular dados aleatórios para cada dia e turma
    var dadosSimulados: types.FrequenciaData[] = [];
    var filtro = this.montaFiltro(0, 0);
    try {
      // const res = await this.frequenciaService.listarPorFiltroPromise(filtro);
      // if (res?.dados) {
      //     var dadosMapeados = res.dados.map((freq: any) => ({
      //       Codigo: freq.codigo.toString(),
      //       DataFrequencia: freq.dataFrequencia,
      //       Presenca: freq.presenca,
      //       CodigoUsuarioLogado: freq.codigoUsuarioLogado,
      //       DataAtualizacao: freq.dataAtualizacao,
      //       DataCadastro: freq.dataCadastro,
      //       CodigoAluno: freq.codigoAluno,
      //       AlunoCodigoCadastro: freq.alunoAlunoCadastro,
      //       AlunoNomeCrianca: freq.alunoNomeCrianca,
      //       AlunoDataNascimento: freq.alunoDataNascimento,
      //       AlunoNomeMae: freq.alunoNomeMae,
      //       AlunoNomePai: freq.alunoNomePai,
      //       AlunoOutroResponsavel: freq.alunoOutroResponsavel,
      //       AlunoTelefone: freq.alunoTelefone,
      //       AlunoEnderecoEmail: freq.alunoEnderecoEmail,
      //       AlunoAlergia: freq.alunoAlergia,
      //       AlunoDescricaoAlergia: freq.alunoDescricaoAlergia,
      //       AlunoRestricaoAlimentar: freq.alunoRestricaoAlimentar,
      //       AlunoDescricaoRestricaoAlimentar:
      //         freq.alunoDescricaoRestricaoAlimentar,
      //       AlunoDeficienciaOuSituacaoAtipica:
      //         freq.alunoDeficienciaOuSituacaoAtipica,
      //       AlunoDescricaoDeficiencia: freq.alunoDescricaoDeficiencia,
      //       AlunoBatizado: freq.alunoBatizado,
      //       AlunoDataBatizado: freq.alunoDataBatizado,
      //       AlunoIgrejaBatizado: freq.alunoIgrejaBatizado,
      //       AlunoAtivo: freq.alunoAtivo,
      //       CodigoTurma: freq.codigoTurma,
      //       TurmaDescricao: freq.turmaDescricao,
      //       TurmaIdadeInicialAluno: freq.turmaIdadeInicialAluno,
      //       TurmaIdadeFinalAluno: freq.turmaIdadeFinalAluno,
      //       TurmaAnoLetivo: freq.turmaAnoLetivo,
      //       TurmaSemestreLetivo: freq.turmaSemestreLetivo,
      //       TurmaLimiteMaximo: freq.turmaLimiteMaximo,
      //       TurmaAtivo: freq.turmaAtivo,
      //     }));

      //     //this.processarDados(dadosMapeados);
      //     dadosSimulados = dadosMapeados;
      //   } else {
      //     this.erro = 'Falha ao carregar os dados.';
      //   }
      //   this.carregando = false;
      //   this.processarDados(dadosSimulados);
      } catch (error) {
        console.error('Erro ao carregar crianças:', error);
        this.erro = 'Falha ao carregar os dados.';
        this.carregando = false;
      }

  }

  // Criar um registro de frequência simulado
  private criarFrequenciaSimulada(id: number, data: string, presente: boolean, turma: string): types.FrequenciaData {
    return {
      Codigo: id,
      DataFrequencia: data,
      Presenca: presente ? 1 : 0,
      CodigoUsuarioLogado: null,
      DataAtualizacao: data,
      DataCadastro: data,
      CodigoAluno: id * 10,
      AlunoCodigoCadastro: id * 100,
      AlunoNomeCrianca: `Aluno Simulado ${id}`,
      AlunoDataNascimento: '2015-01-01 00:00:00.000',
      AlunoNomeMae: 'Mãe Simulada',
      AlunoNomePai: 'Pai Simulado',
      AlunoOutroResponsavel: null,
      AlunoTelefone: '(00) 00000-0000',
      AlunoEnderecoEmail: null,
      AlunoAlergia: 0,
      AlunoDescricaoAlergia: null,
      AlunoRestricaoAlimentar: 0,
      AlunoDescricaoRestricaoAlimentar: null,
      AlunoDeficienciaOuSituacaoAtipica: 0,
      AlunoDescricaoDeficiencia: null,
      AlunoBatizado: 0,
      AlunoDataBatizado: null,
      AlunoIgrejaBatizado: null,
      AlunoAtivo: 1,
      CodigoTurma: id % 13 + 1,
      TurmaDescricao: turma,
      TurmaIdadeInicialAluno: '2020-01-01 00:00:00.000',
      TurmaIdadeFinalAluno: '2025-12-31 00:00:00.000',
      TurmaAnoLetivo: 2025,
      TurmaSemestreLetivo: 1,
      TurmaLimiteMaximo: 30,
      TurmaAtivo: 1
    };
  }

  processarDados(dados: types.FrequenciaData[]): void {
    this.dadosFrequencia = dados;
    this.totalFrequencias = dados.length;

    // Processar lista de turmas
    this.processarTurmas();

    // Calcular estatísticas gerais
    this.calcularEstatisticasGerais();

    // Calcular estatísticas da data atual
    this.calcularEstatisticasHoje();

    // Calcular estatísticas por período
    this.calcularEstatisticasPorPeriodo();

    // Calcular estatísticas por turma
    this.calcularEstatisticasPorTurma();

    // Calcular tendências e estatísticas adicionais
    this.calcularTendencias();

    // Criar gráficos
    setTimeout(() => {
      this.criarGraficos();
      this.carregando = false;
    }, 500);
  }

  private processarTurmas(): void {
    // Extrair todas as turmas dos dados
    const turmasSet = new Set<string>();
    const turmasAtivasSet = new Set<string>();

    this.dadosFrequencia.forEach(registro => {
      if (registro.TurmaDescricao) {
        turmasSet.add(registro.TurmaDescricao);

        if (Boolean(registro.TurmaAtivo) === true) {
          turmasAtivasSet.add(registro.TurmaDescricao);
        }
      }
    });

    this.todasTurmas = Array.from(turmasSet).sort();
    this.turmasAtivas = Array.from(turmasAtivasSet).sort();
  }

  private calcularEstatisticasGerais(): void {
    // Calcular totais gerais
    this.totalPresentes = this.dadosFrequencia.filter(r => r.Presenca === 1 || Boolean(r.Presenca) === true).length;
    this.totalAusentes = this.dadosFrequencia.filter(r => r.Presenca === 0 || Boolean(r.Presenca) === false).length;

    if (this.totalFrequencias > 0) {
      this.taxaPresencaGeral = (this.totalPresentes / this.totalFrequencias) * 100;
    } else {
      this.taxaPresencaGeral = 0;
    }
  }

  private calcularEstatisticasHoje(): void {
    // Obter data atual no formato YYYY-MM-DD
    const hoje = new Date().toISOString().split('T')[0];

    // Filtrar registros de hoje
    const registrosHoje = this.dadosFrequencia.filter(r =>
      r.DataFrequencia && r.DataFrequencia.startsWith(hoje)
    );

    const presentesHoje = registrosHoje.filter(r => r.Presenca === 1 || Boolean(r.Presenca) === true).length;
    const ausentesHoje = registrosHoje.filter(r => r.Presenca === 0 || Boolean(r.Presenca) === false).length;
    const totalHoje = registrosHoje.length;

    this.frequenciaHoje = {
      presentes: presentesHoje,
      ausentes: ausentesHoje,
      total: totalHoje,
      taxaPresenca: totalHoje > 0 ? (presentesHoje / totalHoje) * 100 : 0
    };

    // Calcular frequência por turma hoje
    this.frequenciaTurmasHoje = [];

    // Agrupar por turma
    const turmasHoje = new Set<string>();
    registrosHoje.forEach(r => {
      if (r.TurmaDescricao) {
        turmasHoje.add(r.TurmaDescricao);
      }
    });

    // Para cada turma, calcular estatísticas
    turmasHoje.forEach(turma => {
      const registrosTurma = registrosHoje.filter(r => r.TurmaDescricao === turma);
      const presentesTurma = registrosTurma.filter(r => r.Presenca === 1 || Boolean(r.Presenca) === true).length;
      const ausentesTurma = registrosTurma.filter(r => r.Presenca === 0 || Boolean(r.Presenca) === false).length;
      const totalTurma = registrosTurma.length;

      this.frequenciaTurmasHoje.push({
        turma: turma,
        presentes: presentesTurma,
        ausentes: ausentesTurma,
        total: totalTurma,
        taxaPresenca: totalTurma > 0 ? (presentesTurma / totalTurma) * 100 : 0
      });
    });

    // Ordenar por taxa de presença (decrescente)
    this.frequenciaTurmasHoje.sort((a, b) => b.taxaPresenca - a.taxaPresenca);
  }

  private calcularEstatisticasPorPeriodo(): void {
    // Estatísticas por dia
    const frequenciaPorDiaMap = new Map<string, { presentes: number, ausentes: number, total: number }>();

    // Estatísticas por mês
    const frequenciaPorMesMap = new Map<string, { presentes: number, ausentes: number, total: number }>();

    // Estatísticas por ano
    const frequenciaPorAnoMap = new Map<string, { presentes: number, ausentes: number, total: number }>();

    // Processar todos os registros
    this.dadosFrequencia.forEach(registro => {
      if (registro.DataFrequencia) {
        try {
          const dataObj = new Date(registro.DataFrequencia);
          if (!isNaN(dataObj.getTime())) {
            // Formar chaves para os diferentes períodos
            const ano = dataObj.getFullYear().toString();
            const mes = `${ano}-${(dataObj.getMonth() + 1).toString().padStart(2, '0')}`;
            const dia = `${ano}-${(dataObj.getMonth() + 1).toString().padStart(2, '0')}-${dataObj.getDate().toString().padStart(2, '0')}`;

            // Incrementar contadores para dia
            if (!frequenciaPorDiaMap.has(dia)) {
              frequenciaPorDiaMap.set(dia, { presentes: 0, ausentes: 0, total: 0 });
            }
            frequenciaPorDiaMap.get(dia)!.total++;
            if (registro.Presenca === 1 || Boolean(registro.Presenca) === true) {
              frequenciaPorDiaMap.get(dia)!.presentes++;
            } else {
              frequenciaPorDiaMap.get(dia)!.ausentes++;
            }

            // Incrementar contadores para mês
            if (!frequenciaPorMesMap.has(mes)) {
              frequenciaPorMesMap.set(mes, { presentes: 0, ausentes: 0, total: 0 });
            }
            frequenciaPorMesMap.get(mes)!.total++;
            if (registro.Presenca === 1 || Boolean(registro.Presenca) === true) {
              frequenciaPorMesMap.get(mes)!.presentes++;
            } else {
              frequenciaPorMesMap.get(mes)!.ausentes++;
            }

            // Incrementar contadores para ano
            if (!frequenciaPorAnoMap.has(ano)) {
              frequenciaPorAnoMap.set(ano, { presentes: 0, ausentes: 0, total: 0 });
            }
            frequenciaPorAnoMap.get(ano)!.total++;
            if (registro.Presenca === 1 || Boolean(registro.Presenca) === true) {
              frequenciaPorAnoMap.get(ano)!.presentes++;
            } else {
              frequenciaPorAnoMap.get(ano)!.ausentes++;
            }
          }
        } catch (error) {
          console.error('Erro ao processar data:', error);
        }
      }
    });

    // Converter para arrays e calcular taxas
    this.frequenciaPorDia = Array.from(frequenciaPorDiaMap.entries()).map(([periodo, dados]) => ({
      periodo,
      presentes: dados.presentes,
      ausentes: dados.ausentes,
      total: dados.total,
      taxaPresenca: dados.total > 0 ? (dados.presentes / dados.total) * 100 : 0
    })).sort((a, b) => a.periodo.localeCompare(b.periodo));

    this.frequenciaPorMes = Array.from(frequenciaPorMesMap.entries()).map(([periodo, dados]) => ({
      periodo,
      presentes: dados.presentes,
      ausentes: dados.ausentes,
      total: dados.total,
      taxaPresenca: dados.total > 0 ? (dados.presentes / dados.total) * 100 : 0
    })).sort((a, b) => a.periodo.localeCompare(b.periodo));

    this.frequenciaPorAno = Array.from(frequenciaPorAnoMap.entries()).map(([periodo, dados]) => ({
      periodo,
      presentes: dados.presentes,
      ausentes: dados.ausentes,
      total: dados.total,
      taxaPresenca: dados.total > 0 ? (dados.presentes / dados.total) * 100 : 0
    })).sort((a, b) => a.periodo.localeCompare(b.periodo));
  }

  private calcularEstatisticasPorTurma(): void {
    // Estatísticas por turma no período
    const frequenciaPorTurmaMap = new Map<string, { presentes: number, ausentes: number, total: number }>();

    // Frequência por turma por dia
    const frequenciaTurmaPorDiaMap: Record<string, Map<string, { presentes: number, ausentes: number, total: number }>> = {};

    // Frequência por turma por mês
    const frequenciaTurmaPorMesMap: Record<string, Map<string, { presentes: number, ausentes: number, total: number }>> = {};

    // Inicializar mapas para todas as turmas
    this.todasTurmas.forEach(turma => {
      frequenciaPorTurmaMap.set(turma, { presentes: 0, ausentes: 0, total: 0 });
      frequenciaTurmaPorDiaMap[turma] = new Map();
      frequenciaTurmaPorMesMap[turma] = new Map();
    });

    // Processar todos os registros
    this.dadosFrequencia.forEach(registro => {
      if (registro.DataFrequencia && registro.TurmaDescricao) {
        try {
          const dataObj = new Date(registro.DataFrequencia);
          if (!isNaN(dataObj.getTime())) {
            const turma = registro.TurmaDescricao;

            // Formar chaves para os diferentes períodos
            const ano = dataObj.getFullYear().toString();
            const mes = `${ano}-${(dataObj.getMonth() + 1).toString().padStart(2, '0')}`;
            const dia = `${ano}-${(dataObj.getMonth() + 1).toString().padStart(2, '0')}-${dataObj.getDate().toString().padStart(2, '0')}`;

            // Incrementar contadores para turma geral
            if (!frequenciaPorTurmaMap.has(turma)) {
              frequenciaPorTurmaMap.set(turma, { presentes: 0, ausentes: 0, total: 0 });
            }
            frequenciaPorTurmaMap.get(turma)!.total++;
            if (registro.Presenca === 1 || Boolean(registro.Presenca) === true) {
              frequenciaPorTurmaMap.get(turma)!.presentes++;
            } else {
              frequenciaPorTurmaMap.get(turma)!.ausentes++;
            }

            // Incrementar contadores para turma por dia
            if (!frequenciaTurmaPorDiaMap[turma]) {
              frequenciaTurmaPorDiaMap[turma] = new Map();
            }
            if (!frequenciaTurmaPorDiaMap[turma].has(dia)) {
              frequenciaTurmaPorDiaMap[turma].set(dia, { presentes: 0, ausentes: 0, total: 0 });
            }
            frequenciaTurmaPorDiaMap[turma].get(dia)!.total++;
            if (registro.Presenca === 1 || Boolean(registro.Presenca) === true) {
              frequenciaTurmaPorDiaMap[turma].get(dia)!.presentes++;
            } else {
              frequenciaTurmaPorDiaMap[turma].get(dia)!.ausentes++;
            }

            // Incrementar contadores para turma por mês
            if (!frequenciaTurmaPorMesMap[turma]) {
              frequenciaTurmaPorMesMap[turma] = new Map();
            }
            if (!frequenciaTurmaPorMesMap[turma].has(mes)) {
              frequenciaTurmaPorMesMap[turma].set(mes, { presentes: 0, ausentes: 0, total: 0 });
            }
            frequenciaTurmaPorMesMap[turma].get(mes)!.total++;
            if (registro.Presenca === 1 || Boolean(registro.Presenca) === true) {
              frequenciaTurmaPorMesMap[turma].get(mes)!.presentes++;
            } else {
              frequenciaTurmaPorMesMap[turma].get(mes)!.ausentes++;
            }
          }
        } catch (error) {
          console.error('Erro ao processar data:', error);
        }
      }
    });

    // Converter para arrays e calcular taxas
    this.frequenciaPorTurma = Array.from(frequenciaPorTurmaMap.entries())
      .map(([turma, dados]) => ({
        turma,
        presentes: dados.presentes,
        ausentes: dados.ausentes,
        total: dados.total,
        taxaPresenca: dados.total > 0 ? (dados.presentes / dados.total) * 100 : 0
      }))
      .filter(item => item.total > 0) // Filtrar apenas turmas com registros
      .sort((a, b) => b.taxaPresenca - a.taxaPresenca); // Ordenar por taxa de presença

    // Processar frequência por turma por dia
    this.frequenciaTurmaPorDia = {};
    for (const turma of this.todasTurmas) {
      if (frequenciaTurmaPorDiaMap[turma]) {
        this.frequenciaTurmaPorDia[turma] = Array.from(frequenciaTurmaPorDiaMap[turma].entries())
          .map(([periodo, dados]) => ({
            periodo,
            presentes: dados.presentes,
            ausentes: dados.ausentes,
            total: dados.total,
            taxaPresenca: dados.total > 0 ? (dados.presentes / dados.total) * 100 : 0
          }))
          .sort((a, b) => a.periodo.localeCompare(b.periodo));
      } else {
        this.frequenciaTurmaPorDia[turma] = [];
      }
    }

    // Processar frequência por turma por mês
    this.frequenciaTurmaPorMes = {};
    for (const turma of this.todasTurmas) {
      if (frequenciaTurmaPorMesMap[turma]) {
        this.frequenciaTurmaPorMes[turma] = Array.from(frequenciaTurmaPorMesMap[turma].entries())
          .map(([periodo, dados]) => ({
            periodo,
            presentes: dados.presentes,
            ausentes: dados.ausentes,
            total: dados.total,
            taxaPresenca: dados.total > 0 ? (dados.presentes / dados.total) * 100 : 0
          }))
          .sort((a, b) => a.periodo.localeCompare(b.periodo));
      } else {
        this.frequenciaTurmaPorMes[turma] = [];
      }
    }
  }

  private calcularTendencias(): void {
    // Calcular dias com maior e menor presença
    const diasComFrequencia = new Map<string, types.FrequenciaDiaria>();

    this.dadosFrequencia.forEach(registro => {
      if (registro.DataFrequencia && registro.TurmaDescricao) {
        try {
          const dataObj = new Date(registro.DataFrequencia);
          if (!isNaN(dataObj.getTime())) {
            const data = dataObj.toISOString().split('T')[0];
            const turma = registro.TurmaDescricao;
            const chave = `${data}|${turma}`;

            if (!diasComFrequencia.has(chave)) {
              diasComFrequencia.set(chave, {
                data,
                turma,
                totalAlunos: 0,
                presentes: 0,
                ausentes: 0,
                taxaPresenca: 0
              });
            }

            const diaTurma = diasComFrequencia.get(chave)!;
            diaTurma.totalAlunos++;

            if (registro.Presenca === 1 || Boolean(registro.Presenca) === true) {
              diaTurma.presentes++;
            } else {
              diaTurma.ausentes++;
            }

            diaTurma.taxaPresenca = (diaTurma.presentes / diaTurma.totalAlunos) * 100;
          }
        } catch (error) {
          console.error('Erro ao processar data:', error);
        }
      }
    });

    // Converter para array e ordenar
    const todasFrequenciasDiarias = Array.from(diasComFrequencia.values())
      .filter(item => item.totalAlunos >= 5); // Filtrar apenas dias com pelo menos 5 alunos

    // Ordenar por taxa de presença
    this.diasMaiorPresenca = [...todasFrequenciasDiarias]
      .sort((a, b) => b.taxaPresenca - a.taxaPresenca)
      .slice(0, 5); // Top 5 dias com maior presença

    this.diasMenorPresenca = [...todasFrequenciasDiarias]
      .sort((a, b) => a.taxaPresenca - b.taxaPresenca)
      .slice(0, 5); // Top 5 dias com menor presença

    // Identificar turmas com maior e menor presença
    if (this.frequenciaPorTurma.length > 0) {
      this.turmaMaiorPresenca = { ...this.frequenciaPorTurma[0] };
      this.turmaMenorPresenca = { ...this.frequenciaPorTurma[this.frequenciaPorTurma.length - 1] };
    }
  }

  // Método para criar todos os gráficos
  private criarGraficos(): void {
    // Verifica se está no navegador
    if (!this.isBrowser) return;

    // Limpar gráficos existentes
    this.destruirGraficos();

    // Criar gráficos
    this.criarGraficoFrequenciaGeral();
    this.criarGraficoFrequenciaHoje();
    this.criarGraficoTurmasHoje();
    this.criarGraficoFrequenciaPorPeriodo();
    this.criarGraficoFrequenciaPorTurma();
    this.criarGraficoComparativoTurmas();
    this.criarGraficoTendenciaTurmas();
  }

  // Método para destruir todos os gráficos (evitar memory leaks)
  private destruirGraficos(): void {
    if (this.chartFrequenciaGeral) {
      this.chartFrequenciaGeral.destroy();
      this.chartFrequenciaGeral = null;
    }

    if (this.chartFrequenciaHoje) {
      this.chartFrequenciaHoje.destroy();
      this.chartFrequenciaHoje = null;
    }

    if (this.chartTurmasHoje) {
      this.chartTurmasHoje.destroy();
      this.chartTurmasHoje = null;
    }

    if (this.chartFrequenciaPorDia) {
      this.chartFrequenciaPorDia.destroy();
      this.chartFrequenciaPorDia = null;
    }

    if (this.chartFrequenciaPorMes) {
      this.chartFrequenciaPorMes.destroy();
      this.chartFrequenciaPorMes = null;
    }

    if (this.chartFrequenciaPorAno) {
      this.chartFrequenciaPorAno.destroy();
      this.chartFrequenciaPorAno = null;
    }

    if (this.chartFrequenciaPorTurma) {
      this.chartFrequenciaPorTurma.destroy();
      this.chartFrequenciaPorTurma = null;
    }

    if (this.chartTendenciaTurmas) {
      this.chartTendenciaTurmas.destroy();
      this.chartTendenciaTurmas = null;
    }

    if (this.chartComparativoTurmas) {
      this.chartComparativoTurmas.destroy();
      this.chartComparativoTurmas = null;
    }
  }

  // Método para atualizar os gráficos de período quando o tipo de visualização muda
  private atualizarGraficosPorPeriodo(): void {
    this.criarGraficoFrequenciaPorPeriodo();
  }

  // Gráfico de frequência geral (pizza)
  private criarGraficoFrequenciaGeral(): void {
    const ctx = document.getElementById('chartFrequenciaGeral') as HTMLCanvasElement;
    if (!ctx) return;

    this.chartFrequenciaGeral = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Presentes', 'Ausentes'],
        datasets: [{
          data: [this.totalPresentes, this.totalAusentes],
          backgroundColor: ['#4CAF50', '#F44336'],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Frequência Geral'
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.raw as number;
                const total = this.totalPresentes + this.totalAusentes;
                const percentage = ((value / total) * 100).toFixed(1);
                return `${value} (${percentage}%)`;
              }
            }
          }
        }
      }
    });
  }

  // Gráfico de frequência de hoje (pizza)
  private criarGraficoFrequenciaHoje(): void {
    const ctx = document.getElementById('chartFrequenciaHoje') as HTMLCanvasElement;
    if (!ctx) return;

    this.chartFrequenciaHoje = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Presentes', 'Ausentes'],
        datasets: [{
          data: [this.frequenciaHoje.presentes, this.frequenciaHoje.ausentes],
          backgroundColor: ['#4CAF50', '#F44336'],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Frequência de Hoje'
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.raw as number;
                const total = this.frequenciaHoje.total;
                const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0.0';
                return `${value} (${percentage}%)`;
              }
            }
          }
        }
      }
    });
  }

  // Gráfico de frequência por turma hoje (barras)
  private criarGraficoTurmasHoje(): void {
    const ctx = document.getElementById('chartTurmasHoje') as HTMLCanvasElement;
    if (!ctx) return;

    // Limitar para as top 10 turmas
    const turmasParaMostrar = this.frequenciaTurmasHoje.slice(0, 10);

    this.chartTurmasHoje = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: turmasParaMostrar.map(t => this.abreviarNomeTurma(t.turma)),
        datasets: [
          {
            label: 'Presentes',
            data: turmasParaMostrar.map(t => t.presentes),
            backgroundColor: '#4CAF50',
            borderWidth: 1
          },
          {
            label: 'Ausentes',
            data: turmasParaMostrar.map(t => t.ausentes),
            backgroundColor: '#F44336',
            borderWidth: 1
          }
        ]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Frequência por Turma Hoje'
          },
          tooltip: {
            callbacks: {
              afterTitle: (context) => {
                const index = context[0].dataIndex;
                return turmasParaMostrar[index].turma;
              },
              footer: (context) => {
                const index = context[0].dataIndex;
                const taxa = turmasParaMostrar[index].taxaPresenca.toFixed(1);
                return `Taxa de presença: ${taxa}%`;
              }
            }
          }
        },
        scales: {
          x: {
            stacked: true,
            beginAtZero: true
          },
          y: {
            stacked: true
          }
        }
      }
    });
  }

  // Gráfico de frequência por período (dia, mês ou ano)
  private criarGraficoFrequenciaPorPeriodo(): void {
    let dados: types.FrequenciaPeriodo[];
    let ctx: HTMLCanvasElement | null = null;
    let titulo: string;

    // Selecionar dados e canvas baseado no tipo de visualização
    switch (this.tipoVisualizacao) {
      case 'dia':
        dados = this.frequenciaPorDia;
        ctx = document.getElementById('chartFrequenciaPorPeriodo') as HTMLCanvasElement;
        titulo = 'Frequência Diária';
        break;
      case 'mes':
        dados = this.frequenciaPorMes;
        ctx = document.getElementById('chartFrequenciaPorPeriodo') as HTMLCanvasElement;
        titulo = 'Frequência Mensal';
        break;
      case 'ano':
        dados = this.frequenciaPorAno;
        ctx = document.getElementById('chartFrequenciaPorPeriodo') as HTMLCanvasElement;
        titulo = 'Frequência Anual';
        break;
    }

    if (!ctx || !dados || dados.length === 0) return;

    // Destruir gráfico existente
    if (this.chartFrequenciaPorDia) {
      this.chartFrequenciaPorDia.destroy();
      this.chartFrequenciaPorDia = null;
    }
    if (this.chartFrequenciaPorMes) {
      this.chartFrequenciaPorMes.destroy();
      this.chartFrequenciaPorMes = null;
    }
    if (this.chartFrequenciaPorAno) {
      this.chartFrequenciaPorAno.destroy();
      this.chartFrequenciaPorAno = null;
    }

    // Limitar para os últimos 12 períodos (ou menos se não houver 12)
    const dadosParaMostrar = dados.slice(-12);

    // Formatar labels
    const labels = dadosParaMostrar.map(d => this.formatarPeriodo(d.periodo, this.tipoVisualizacao));

    // Criar gráfico
    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Presentes',
            data: dadosParaMostrar.map(d => d.presentes),
            backgroundColor: 'rgba(76, 175, 80, 0.2)',
            borderColor: '#4CAF50',
            borderWidth: 2,
            tension: 0.4,
            fill: true
          },
          {
            label: 'Ausentes',
            data: dadosParaMostrar.map(d => d.ausentes),
            backgroundColor: 'rgba(244, 67, 54, 0.2)',
            borderColor: '#F44336',
            borderWidth: 2,
            tension: 0.4,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: titulo
          },
          tooltip: {
            callbacks: {
              afterTitle: (context) => {
                const index = context[0].dataIndex;
                return `Total: ${dadosParaMostrar[index].total}`;
              },
              footer: (context) => {
                const index = context[0].dataIndex;
                const taxa = dadosParaMostrar[index].taxaPresenca.toFixed(1);
                return `Taxa de presença: ${taxa}%`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

    // Armazenar referência
    switch (this.tipoVisualizacao) {
      case 'dia':
        this.chartFrequenciaPorDia = chart;
        break;
      case 'mes':
        this.chartFrequenciaPorMes = chart;
        break;
      case 'ano':
        this.chartFrequenciaPorAno = chart;
        break;
    }
  }

  // Gráfico de frequência por turma (barras)
  private criarGraficoFrequenciaPorTurma(): void {
    const ctx = document.getElementById('chartFrequenciaPorTurma') as HTMLCanvasElement;
    if (!ctx) return;

    // Limitar para as top 10 turmas por taxa de presença
    const turmasParaMostrar = this.frequenciaPorTurma.slice(0, 10);

    this.chartFrequenciaPorTurma = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: turmasParaMostrar.map(t => this.abreviarNomeTurma(t.turma)),
        datasets: [
          {
            label: 'Taxa de Presença (%)',
            data: turmasParaMostrar.map(t => parseFloat(t.taxaPresenca.toFixed(1))),
            backgroundColor: turmasParaMostrar.map(t =>
              t.taxaPresenca > 90 ? '#4CAF50' :
              t.taxaPresenca > 80 ? '#8BC34A' :
              t.taxaPresenca > 70 ? '#CDDC39' :
              t.taxaPresenca > 60 ? '#FFC107' :
              t.taxaPresenca > 50 ? '#FF9800' : '#F44336'
            ),
            borderWidth: 1
          }
        ]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: 'Taxa de Presença por Turma'
          },
          tooltip: {
            callbacks: {
              afterTitle: (context) => {
                const index = context[0].dataIndex;
                return turmasParaMostrar[index].turma;
              },
              label: (context) => {
                const value = context.raw as number;
                return `Taxa de presença: ${value}%`;
              },
              afterLabel: (context) => {
                const index = context.dataIndex;;
                const turma = turmasParaMostrar[index];
                return `Presentes: ${turma.presentes} | Ausentes: ${turma.ausentes}`;
              }
            }
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            max: 100,
            title: {
              display: true,
              text: 'Taxa de Presença (%)'
            }
          }
        }
      }
    });
  }

  // Gráfico de comparativo entre turmas (radar)
  private criarGraficoComparativoTurmas(): void {
    const ctx = document.getElementById('chartComparativoTurmas') as HTMLCanvasElement;
    if (!ctx) return;

    // Pegar apenas turmas ativas com pelo menos 5 registros
    const turmasAtivas = this.frequenciaPorTurma
      .filter(t => this.turmasAtivas.includes(t.turma) && t.total >= 5)
      .slice(0, 8); // Limitar a 8 turmas para não sobrecarregar o gráfico

    if (turmasAtivas.length < 2) return; // Precisamos de pelo menos 2 turmas

    this.chartComparativoTurmas = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: ['Taxa de Presença', 'Total de Alunos', 'Regularidade', 'Crescimento'],
        datasets: turmasAtivas.map((turma, index) => {
          // Calcular métricas
          const taxaPresenca = turma.taxaPresenca / 100; // Normalizar para 0-1
          const totalAlunos = turma.total / Math.max(...turmasAtivas.map(t => t.total)); // Normalizar para 0-1

          // Métricas fictícias para demonstração (em um cenário real, calcular com base nos dados)
          const regularidade = Math.random() * 0.3 + 0.7; // 0.7-1.0 para demonstração
          const crescimento = Math.random() * 0.5 + 0.5; // 0.5-1.0 para demonstração

          // Gerar cor com base no índice
          const hue = (index * 30) % 360;
          const color = `hsl(${hue}, 70%, 60%)`;

          return {
            label: this.abreviarNomeTurma(turma.turma),
            data: [taxaPresenca, totalAlunos, regularidade, crescimento].map(v => v * 100),
            backgroundColor: `${color}33`,
            borderColor: color,
            borderWidth: 2,
            pointBackgroundColor: color
          };
        })
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Comparativo de Desempenho das Turmas'
          },
          tooltip: {
            callbacks: {
              title: (context) => {
                return context[0].dataset.label || '';
              },
              label: (context) => {
                const metric = context.chart.data.labels?.[context.dataIndex] || '';
                const value = context.raw as number;

                switch (metric) {
                  case 'Taxa de Presença':
                    return `Taxa de Presença: ${value.toFixed(1)}%`;
                  case 'Total de Alunos':
                    return `Volume Relativo: ${value.toFixed(1)}%`;
                  case 'Regularidade':
                    return `Regularidade: ${value.toFixed(1)}%`;
                  case 'Crescimento':
                    return `Tendência: ${value.toFixed(1)}%`;
                  default:
                    return `${metric}: ${value.toFixed(1)}%`;
                }
              }
            }
          }
        },
        scales: {
          r: {
            min: 0,
            max: 100,
            ticks: {
              display: false
            }
          }
        }
      }
    });
  }

  // Gráfico de tendência de frequência das turmas (linha)
  private criarGraficoTendenciaTurmas(): void {
    const ctx = document.getElementById('chartTendenciaTurmas') as HTMLCanvasElement;
    if (!ctx) return;

    // Selecionar top 5 turmas ativas
    const turmasParaAnalise = this.frequenciaPorTurma
      .filter(t => this.turmasAtivas.includes(t.turma))
      .slice(0, 5);

    if (turmasParaAnalise.length === 0) return;

    // Obter os últimos 6 meses para análise de tendência
    const mesesRecentes = this.frequenciaPorMes
      .slice(-6)
      .map(m => m.periodo);

    if (mesesRecentes.length === 0) return;

    // Preparar datasets para cada turma
    const datasets = turmasParaAnalise.map((turma, index) => {
      const dadosTurma = this.frequenciaTurmaPorMes[turma.turma] || [];

      // Gerar cor com base no índice
      const hue = (index * 60) % 360;
      const color = `hsl(${hue}, 70%, 50%)`;

      // Encontrar dados para cada mês
      const dadosPorMes = mesesRecentes.map(mes => {
        const dadosMes = dadosTurma.find(d => d.periodo === mes);
        return dadosMes ? dadosMes.taxaPresenca : null;
      });

      return {
        label: this.abreviarNomeTurma(turma.turma),
        data: dadosPorMes,
        borderColor: color,
        backgroundColor: `${color}33`,
        borderWidth: 2,
        tension: 0.4,
        fill: false,
        pointRadius: 4
      };
    });

    // Formatar labels de meses
    const labels = mesesRecentes.map(mes => this.formatarPeriodo(mes, 'mes'));

    this.chartTendenciaTurmas = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: datasets
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Tendência de Presença por Turma'
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.raw as number;
                if (value === null) return 'Sem dados';
                return `${context.dataset.label}: ${value.toFixed(1)}%`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            title: {
              display: true,
              text: 'Taxa de Presença (%)'
            }
          }
        }
      }
    });
  }

  // Utilitário para abreviar nomes de turma
  private abreviarNomeTurma(turma: string): string {
    if (!turma) return '';

    // Extrair parte principal (dentro de parênteses)
    const match = turma.match(/\(([^)]+)\)/);
    if (match) {
      return match[1].trim();
    }

    // Caso não tenha parênteses, retornar os primeiros 10 caracteres
    return turma.length > 10 ? turma.substring(0, 10) + '...' : turma;
  }

  // Utilitário para formatar período
  private formatarPeriodo(periodo: string, tipo: 'dia' | 'mes' | 'ano'): string {
    if (!periodo) return '';

    try {
      switch (tipo) {
        case 'dia':
          const parts = periodo.split('-');
          return `${parts[2]}/${parts[1]}`;
        case 'mes':
          const [ano, mes] = periodo.split('-');
          const nomesMeses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
          return `${nomesMeses[parseInt(mes) - 1]}/${ano.slice(-2)}`;
        case 'ano':
          return periodo;
        default:
          return periodo;
      }
    } catch (error) {
      console.error('Erro ao formatar período:', error);
      return periodo;
    }
  }
}
