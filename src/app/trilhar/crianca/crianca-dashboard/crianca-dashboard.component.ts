import { CustomizerSettingsService } from '../../../customizer-settings/customizer-settings.service';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, NgIf, isPlatformBrowser } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseFormComponent } from '../../../shared/formulario/baseForms';
import { MaterialModule } from '../../../material.module';
import { Chart, registerables } from 'chart.js';
import { CriancaService } from '../crianca.service';
import * as types from './crianca-dashboard.types';

// Registrar todos os componentes do Chart.js
Chart.register(...registerables);

@Component({
  selector: 'app-crianca-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    NgIf,
  ],
  templateUrl: './crianca-dashboard.component.html',
  styleUrl: './crianca-dashboard.component.scss'
})
export class CriancaDashboardComponent extends BaseFormComponent implements OnInit {

  currentDate: string | undefined;
  private isBrowser: boolean;

  // Propriedades para armazenar estatísticas
  dadosCriancas: types.CriancaData[] = [];
  totalCriancas = 0;
  criancasAtivas = 0;
  criancasInativas = 0;
  criancasComAlergia = 0;
  criancasSemAlergia = 0;
  criancasComRestricao = 0;
  criancasSemRestricao = 0;
  criancasComDeficiencia = 0;
  criancasSemDeficiencia = 0;
  criancasBatizadas = 0;
  criancasNaoBatizadas = 0;

  // Propriedades para armazenar referências dos gráficos
  chartStatus: Chart | null = null;
  chartAlergia: Chart | null = null;
  chartRestricao: Chart | null = null;
  chartDeficiencia: Chart | null = null;
  chartBatismo: Chart | null = null;
  chartFaixaEtaria: Chart | null = null;
  chartCadastroHoje: Chart | null = null;
  chartCadastroHojeSintetizado: Chart | null = null;
  chartCadastroMensal: Chart | null = null;
  chartCadastroAnual: Chart | null = null;

  // Propriedade para controle de carregamento
  carregando = true;
  erro: string | null = null;

  constructor(
      public themeService: CustomizerSettingsService,
          private fb: FormBuilder,
          private criancaService: CriancaService,
          public override router: Router,
          public override activatedRoute: ActivatedRoute,
          @Inject(PLATFORM_ID) private platformId: Object
    ) {
      super(router, activatedRoute);
      this.isBrowser = isPlatformBrowser(this.platformId);
      this.currentDate = new Date().toISOString();
    }

  override ngOnInit(): void {
    this.carregarDados();
  }

  override preencheFormulario(): void {
    throw new Error('Method not implemented.');
  }

  async carregarDados() {
    this.carregando = true;
    this.erro = null;

    var filtro = this.montaFiltro(0, 0);
    try {
      const res = await this.criancaService.listarPorFiltroPromise(filtro);
      if (res?.dados) {
        this.dadosCriancas = res.dados.map((aluno: any) => ({
          Codigo: aluno.codigo.toString(),
          CodigoCadastro: aluno.codigoCadastro,
          NomeCrianca: aluno.nomeCrianca,
          DataNascimento: aluno.dataNascimento,
          NomeMae: aluno.nomeMae,
          NomePai: aluno.nomePai,
          OutroResponsavel: aluno.outroResponsavel,
          Telefone: aluno.telefone,
          EnderecoEmail: aluno.enderecoEmail,
          Alergia: aluno.alergia,
          DescricaoAlergia: aluno.descricaoAlergia,
          RestricaoAlimentar: aluno.restricaoAlimentar,
          DescricaoRestricaoAlimentar: aluno.descricaoRestricaoAlimentar,
          DeficienciaOuSituacaoAtipica: aluno.deficienciaOuSituacaoAtipica,
          DescricaoDeficiencia: aluno.descricaoDeficiencia,
          Batizado: aluno.batizado,
          DataBatizado: aluno.dataBatizado,
          IgrejaBatizado: aluno.igrejaBatizado,
          Ativo: aluno.ativo,
          CodigoUsuarioLogado: aluno.codigoUsuarioLogado,
          DataAtualizacao: aluno.dataAtualizacao,
          DataCadastro: aluno.dataCadastro,
        }));

        this.totalCriancas = this.dadosCriancas.length;

        // Calcular estatísticas
        this.calcularEstatisticas();

        // Criar gráficos
        setTimeout(() => {
          this.criarGraficos();
          this.carregando = false;
        }, 500);
      } else {
        console.error('Resposta inválida:', res);
        this.erro = 'Falha ao carregar os dados.';
        this.carregando = false;
      }
    } catch (error) {
      console.error('Erro ao carregar crianças:', error);
      this.erro = 'Falha ao carregar os dados.';
      this.carregando = false;
    }
  }

  montaFiltro(page: number, pageSize: number) {
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

  calcularEstatisticas(): void {
    // Status (Ativo/Inativo)
    this.criancasAtivas = this.dadosCriancas.filter(c => Boolean(c.Ativo) === true).length;
    this.criancasInativas = this.dadosCriancas.filter(c => Boolean(c.Ativo) === false).length;

    // Alergia
    this.criancasComAlergia = this.dadosCriancas.filter(c => Boolean(c.Alergia) === true).length;
    this.criancasSemAlergia = this.dadosCriancas.filter(c => Boolean(c.Alergia) === false).length;

    // Restrição Alimentar
    this.criancasComRestricao = this.dadosCriancas.filter(c => Boolean(c.RestricaoAlimentar) === true).length;
    this.criancasSemRestricao = this.dadosCriancas.filter(c => Boolean(c.RestricaoAlimentar) === false).length;

    // Deficiência ou Situação Atípica
    this.criancasComDeficiencia = this.dadosCriancas.filter(c => Boolean(c.DeficienciaOuSituacaoAtipica) === true).length;
    this.criancasSemDeficiencia = this.dadosCriancas.filter(c => Boolean(c.DeficienciaOuSituacaoAtipica) === false).length;

    // Batismo
    this.criancasBatizadas = this.dadosCriancas.filter(c => Boolean(c.Batizado) === true).length;
    this.criancasNaoBatizadas = this.dadosCriancas.filter(c => Boolean(c.Batizado) === false).length;
  }

  criarGraficos(): void {
    this.criarGraficoStatus();
    this.criarGraficoAlergia();
    this.criarGraficoRestricao();
    this.criarGraficoDeficiencia();
    this.criarGraficoBatismo();
    this.criarGraficoFaixaEtaria();
    this.criarGraficoCadastroHoje();
    this.criarGraficoCadastroHojeSintetizado();
    this.criarGraficoCadastroMensal();
    this.criarGraficoCadastroAnual();
  }

  criarGraficoStatus(): void {
    // Verifica se está no navegador
    if (this.isBrowser) {
      const ctx = document.getElementById('chartStatus') as HTMLCanvasElement;
      if (!ctx) return;

      this.chartStatus = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['Ativas', 'Inativas'],
          datasets: [{
            data: [this.criancasAtivas, this.criancasInativas],
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
              text: 'Status das Crianças'
            }
          }
        }
      });
    }
  }

  criarGraficoAlergia(): void {
    // Verifica se está no navegador
    if (this.isBrowser) {
      const ctx = document.getElementById('chartAlergia') as HTMLCanvasElement;
      if (!ctx) return;

      this.chartAlergia = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['Com Alergia', 'Sem Alergia'],
          datasets: [{
            data: [this.criancasComAlergia, this.criancasSemAlergia],
            backgroundColor: ['#FF9800', '#2196F3'],
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
              text: 'Crianças com Alergia'
            }
          }
        }
      });
    }
  }

  criarGraficoRestricao(): void {
    // Verifica se está no navegador
    if (this.isBrowser) {
      const ctx = document.getElementById('chartRestricao') as HTMLCanvasElement;
      if (!ctx) return;

      this.chartRestricao = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['Com Restrição Alimentar', 'Sem Restrição Alimentar'],
          datasets: [{
            data: [this.criancasComRestricao, this.criancasSemRestricao],
            backgroundColor: ['#E91E63', '#3F51B5'],
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
              text: 'Crianças com Restrição Alimentar'
            }
          }
        }
      });
    }
  }

  criarGraficoDeficiencia(): void {
    // Verifica se está no navegador
    if (this.isBrowser) {
      const ctx = document.getElementById('chartDeficiencia') as HTMLCanvasElement;
      if (!ctx) return;

      this.chartDeficiencia = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['Com Necessidades Especiais', 'Sem Necessidades Especiais'],
          datasets: [{
            data: [this.criancasComDeficiencia, this.criancasSemDeficiencia],
            backgroundColor: ['#9C27B0', '#03A9F4'],
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
              text: 'Crianças com Necessidades Especiais'
            }
          }
        }
      });
    }
  }

  criarGraficoBatismo(): void {
    // Verifica se está no navegador
    if (this.isBrowser) {
      const ctx = document.getElementById('chartBatismo') as HTMLCanvasElement;
      if (!ctx) return;

      this.chartBatismo = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['Batizadas', 'Não Batizadas'],
          datasets: [{
            data: [this.criancasBatizadas, this.criancasNaoBatizadas],
            backgroundColor: ['#8BC34A', '#607D8B'],
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
              text: 'Crianças Batizadas'
            }
          }
        }
      });
    }
  }

  criarGraficoFaixaEtaria(): void {
    // Verifica se está no navegador
    if (this.isBrowser) {
      const ctx = document.getElementById('chartFaixaEtaria') as HTMLCanvasElement;
      if (!ctx) return;

      // Calcular faixas etárias
      const hoje = new Date();
      const faixasEtarias: types.FaixaEtaria[] = [
        { faixa: '0-3 anos', quantidade: 0 },
        { faixa: '4-6 anos', quantidade: 0 },
        { faixa: '7-10 anos', quantidade: 0 },
        { faixa: '11-14 anos', quantidade: 0 },
        { faixa: '15+ anos', quantidade: 0 }
      ];

      this.dadosCriancas.forEach(crianca => {
        if (crianca.DataNascimento) {
          const dataNascimento = new Date(crianca.DataNascimento);
          if (!isNaN(dataNascimento.getTime())) {
            // Calcular idade precisa
            let idade = hoje.getFullYear() - dataNascimento.getFullYear();
            const mDiff = hoje.getMonth() - dataNascimento.getMonth();

            if (mDiff < 0 || (mDiff === 0 && hoje.getDate() < dataNascimento.getDate())) {
              idade--;
            }

            // Incrementar contador da faixa etária correspondente
            if (idade <= 3) faixasEtarias[0].quantidade++;
            else if (idade <= 6) faixasEtarias[1].quantidade++;
            else if (idade <= 10) faixasEtarias[2].quantidade++;
            else if (idade <= 14) faixasEtarias[3].quantidade++;
            else faixasEtarias[4].quantidade++;
          }
        }
      });

      this.chartFaixaEtaria = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: faixasEtarias.map(f => f.faixa),
          datasets: [{
            label: 'Número de Crianças',
            data: faixasEtarias.map(f => f.quantidade),
            backgroundColor: [
              '#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#ffc658'
            ],
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
              text: 'Distribuição por Faixa Etária'
            }
          },
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  }

  criarGraficoCadastroHoje(): void {
    if (this.isBrowser) {
      const ctx = document.getElementById('chartCadastroHoje') as HTMLCanvasElement;
      if (!ctx) return;

      // Obter a data de hoje
      const hoje = new Date();
      const hojeString = hoje.toISOString().split('T')[0]; // Formato YYYY-MM-DD

      // Inicializar contadores por hora (0-23)
      const cadastrosPorHora: number[] = new Array(24).fill(0);

      // Contar cadastros por hora
      this.dadosCriancas.forEach(crianca => {
        if (crianca.DataCadastro) {
          try {
            const dataCadastro = new Date(crianca.DataCadastro);
            if (!isNaN(dataCadastro.getTime())) {
              const cadastroString = dataCadastro.toISOString().split('T')[0];

              // Verificar se é hoje
              if (cadastroString === hojeString) {
                const hora = dataCadastro.getHours();
                cadastrosPorHora[hora]++;
              }
            }
          } catch (error) {
            console.error("Erro ao processar data de cadastro:", error);
          }
        }
      });

      // Preparar labels para as horas (formato 24h)
      const labelsHoras = Array.from({length: 24}, (_, i) => {
        return `${i.toString().padStart(2, '0')}h`;
      });

      this.chartCadastroHoje = new Chart(ctx, {
        type: 'line', // Gráfico de linha para mostrar a variação ao longo do dia
        data: {
          labels: labelsHoras,
          datasets: [{
            label: 'Cadastros por Hora (Hoje)',
            data: cadastrosPorHora,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 2,
            tension: 0.4, // Suaviza a linha
            fill: true
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
              text: `Cadastros Hoje (${hoje.toLocaleDateString('pt-BR')})`
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return `${context.parsed.y} cadastro(s)`;
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Número de Cadastros'
              }
            },
            x: {
              title: {
                display: true,
                text: 'Horário do Dia'
              }
            }
          }
        }
      });
    }
  }

  criarGraficoCadastroHojeSintetizado(): void {
    if (this.isBrowser) {
      const ctx = document.getElementById('chartCadastroHojeSintetizado') as HTMLCanvasElement;
      if (!ctx) return;

      // 1. Obter a data de hoje no formato YYYY-MM-DD
      const hoje = new Date();
      const hojeString = hoje.toISOString().split('T')[0];

      // 2. Inicializar contadores por hora (0-23)
      const cadastrosPorHora: number[] = new Array(24).fill(0);

      // 3. Contar cadastros por hora
      this.dadosCriancas.forEach(crianca => {
        if (crianca.DataCadastro) {
          try {
            const dataCadastro = new Date(crianca.DataCadastro);
            if (!isNaN(dataCadastro.getTime())) {
              const cadastroString = dataCadastro.toISOString().split('T')[0];

              // Verificar se é hoje
              if (cadastroString === hojeString) {
                const hora = dataCadastro.getHours();
                cadastrosPorHora[hora]++;
              }
            }
          } catch (error) {
            console.error("Erro ao processar data de cadastro:", error);
          }
        }
      });

      // 4. MELHORIA: Filtrar apenas horas com cadastros
      const horasComCadastros = cadastrosPorHora
      .map((count, hora) => ({ hora, count })) // Cria objetos {hora, count}
      .filter(item => item.count > 0); // Filtra apenas horas com count > 0

      // 5. Preparar labels e dados para o gráfico
      const labelsHoras = horasComCadastros.map(item =>
        `${item.hora.toString().padStart(2, '0')}h`
      );
      const dadosHoras = horasComCadastros.map(item => item.count);

      // 6. Criar o gráfico
      this.chartCadastroHojeSintetizado = new Chart(ctx, {
        type: 'bar', // Alterado para gráfico de barras (fica melhor com poucos dados)
        data: {
          labels: labelsHoras,
          datasets: [{
            label: 'Cadastros por Hora (Hoje)',
            data: dadosHoras,
            backgroundColor: '#4CAF50', // Verde
            borderColor: '#388E3C',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: false // Oculta a legenda (redundante)
            },
            title: {
              display: true,
              text: `Cadastros Hoje (${hoje.toLocaleDateString('pt-BR')})`,
              font: {
                size: 16
              }
            },
            tooltip: {
              callbacks: {
                label: (context) => `${context.parsed.y} cadastro(s) às ${context.label}`
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1 // Garante números inteiros
              },
              title: {
                display: true,
                text: 'Número de Cadastros'
              }
            },
            x: {
              title: {
                display: true,
                text: 'Horário'
              }
            }
          }
        }
      });
    }
  }

  criarGraficoCadastroMensal(): void {
    // Verifica se está no navegador
    if (this.isBrowser) {
      const ctx = document.getElementById('chartCadastroMensal') as HTMLCanvasElement;
      if (!ctx) return;

      // Calcular cadastros por mês/ano (últimos 12 meses)
      const hoje = new Date();
      const cadastrosPorMes: Record<string, number> = {};

      // Inicializar últimos 12 meses com zeros
      for (let i = 0; i < 12; i++) {
        const data = new Date(hoje.getFullYear(), hoje.getMonth() - 11 + i, 1);
        const mesAno = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}`;
        cadastrosPorMes[mesAno] = 0;
      }

      // Preencher com dados reais
      this.dadosCriancas.forEach(crianca => {
        if (crianca.DataCadastro) {
          try {
            const dataCadastro = new Date(crianca.DataCadastro);
            if (!isNaN(dataCadastro.getTime())) {
              const mesAno = `${dataCadastro.getFullYear()}-${String(dataCadastro.getMonth() + 1).padStart(2, '0')}`;
              // Verificar se está nos últimos 12 meses
              if (mesAno in cadastrosPorMes) {
                cadastrosPorMes[mesAno]++;
              }
            }
          } catch (error) {
            console.error("Erro ao processar data de cadastro:", error);
          }
        }
      });

      // Preparar dados para o gráfico
      const meses = Object.keys(cadastrosPorMes).sort();
      const nomesMeses = meses.map(mesAno => {
        const [ano, mes] = mesAno.split('-');
        const nomesMesesPt = [
          'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
          'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
        ];
        return `${nomesMesesPt[parseInt(mes) - 1]}/${ano.slice(2)}`;
      });

      this.chartCadastroMensal = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: nomesMeses,
          datasets: [{
            label: 'Número de Cadastros',
            data: meses.map(mesAno => cadastrosPorMes[mesAno]),
            backgroundColor: '#009688',
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
              text: 'Cadastros por Mês (Últimos 12 meses)'
            }
          },
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  }

  criarGraficoCadastroAnual(): void {
    // Verifica se está no navegador
    if (this.isBrowser) {
      const ctx = document.getElementById('chartCadastroAnual') as HTMLCanvasElement;
      if (!ctx) return;

      // Calcular cadastros por ano
      const cadastrosPorAno: Record<string, number> = {};

      this.dadosCriancas.forEach(crianca => {
        if (crianca.DataCadastro) {
          try {
            const dataCadastro = new Date(crianca.DataCadastro);
            if (!isNaN(dataCadastro.getTime())) {
              const ano = dataCadastro.getFullYear().toString();
              cadastrosPorAno[ano] = (cadastrosPorAno[ano] || 0) + 1;
            }
          } catch (error) {
            console.error("Erro ao processar data de cadastro:", error);
          }
        }
      });

      // Ordenar anos
      const anos = Object.keys(cadastrosPorAno).sort();

      this.chartCadastroAnual = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: anos,
          datasets: [{
            label: 'Número de Cadastros',
            data: anos.map(ano => cadastrosPorAno[ano]),
            backgroundColor: '#3F51B5',
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
              text: 'Cadastros por Ano'
            }
          },
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  }
}
