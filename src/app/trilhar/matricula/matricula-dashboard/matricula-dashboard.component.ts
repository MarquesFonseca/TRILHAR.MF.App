import { Component, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart, registerables } from 'chart.js';
import { CommonModule, NgIf, isPlatformBrowser } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../material.module';
import { MatriculaService } from '../matricula.service';
import * as types from './matricula-dashboard.types';
import { CustomizerSettingsService } from '../../../customizer-settings/customizer-settings.service';
import { BaseFormComponent } from '../../../shared/formulario/baseForms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

// Registrar todos os componentes do Chart.js
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard-matricula',
  standalone: true,
  imports: [
    CommonModule,
    //RouterLink,
    ReactiveFormsModule,
    MaterialModule,
    NgIf,
  ],
  templateUrl: './matricula-dashboard.component.html',
  styleUrl: './matricula-dashboard.component.scss'
})
export class MatriculaDashboardComponent extends BaseFormComponent implements OnInit {

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
  chartCadastroAnual: Chart | null = null;
  chartCadastroMensal: Chart | null = null;

  // Propriedade para controle de carregamento
  carregando = true;
  erro: string | null = null;

  constructor(
      private http: HttpClient,
      public themeService: CustomizerSettingsService,
          private fb: FormBuilder,
          private matriculaService: MatriculaService,
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

  carregarDados(): void {
    this.carregando = true;
    this.erro = null;

    var filtro = this.montaFiltro(0, 0);
    this.matriculaService.listarPorFiltro(filtro, (res: any) => {
      if (res?.dados) {
        var dadosMapeados = res.dados.map((aluno: any) => ({
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

        this.dadosCriancas = dadosMapeados;
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
    });
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
    this.criarGraficoCadastroAnual();
    this.criarGraficoCadastroMensal();
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
}
