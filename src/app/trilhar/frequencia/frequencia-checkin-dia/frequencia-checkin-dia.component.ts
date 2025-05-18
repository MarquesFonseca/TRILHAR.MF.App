import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
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

@Component({
  selector: 'app-frequencia-checkin-dia',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MaterialModule
  ],
  templateUrl: './frequencia-checkin-dia.component.html',
  styleUrl: './frequencia-checkin-dia.component.scss'
})
export class FrequenciaCheckinDiaComponent extends BaseListComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // alternado
  isToggled = false;

  displayedColumns: string[] = [
    'turmaDescricaoFormatada',
    'qtd',
    'turmaLimiteMaximo',
    'qtdRestanteFormatada'
  ];
  dataSourceTurmasAgrupadas = new MatTableDataSource<any>([]);

  descricaoTuramaSelecionda: string = '';
  turmasAgrupadas: any[] = [];
  frequenciasPresentesTurmaEData: any[] = [];
  frequenciasAusentesTurmaEData: any[] = [];
  //frequencias: any[] = [];
  //frequenciaDetalhe: any;

  private subscriptions: Subscription = new Subscription();

  constructor(
      public themeService: CustomizerSettingsService,
      private fb: FormBuilder,
      private criancaService: CriancaService,
      private frequenciaService: FrequenciaService,
      private mensagemService: MensagemService,
      private loadingService: LoadingService,
      public override router: Router,
      public override activatedRoute: ActivatedRoute,
    ) {
      super(router, activatedRoute);
      this.themeService.isToggled$.subscribe((isToggled) => {
        this.isToggled = isToggled;
        if(!this.isProducao) console.clear();
      });
      this.descricaoTuramaSelecionda = '';
    }

  override ngOnInit() {
    this.onDataSelecionada('2025-05-11');
  }

  retornaDataHoje(): string {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, '0'); // +1 porque janeiro é 0
    const dia = String(hoje.getDate()).padStart(2, '0');

    const dataFormatada = `${ano}-${mes}-${dia}`;
    return dataFormatada;
  }


  onDataSelecionada(data: string): void {
    this.carregarTurmasAgrupadasPorData(data);
  }

  carregarTurmasAgrupadasPorData(data: string): void {
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
          this.dataSourceTurmasAgrupadas = new MatTableDataSource<any>(this.turmasAgrupadas);
        },
        error: (err) => {
          console.error('Erro ao carregar turmas agrupadas:', err);
        }
      });

    this.subscriptions.add(sub);
  }

  async carregarFrequenciasTurma(codigoTurma: number, descricaoTurma:string, data: string) {
    if(codigoTurma == 0) {
      return;
    }
    this.descricaoTuramaSelecionda = descricaoTurma;
    try {
      var ret: any = await this.frequenciaService.listarPorTurmaEDataPromise(codigoTurma, data);
      this.frequenciasPresentesTurmaEData = ret.dados.filter((x:any) => x.presenca == true && x.alunoAtivo == true);
      this.frequenciasAusentesTurmaEData = ret.dados.filter((x:any) => x.presenca == false && x.alunoAtivo == true);
    } catch (err) {
      console.error('Erro:', err);
    }
  }

  override preencheFiltro(): void {
    throw new Error('Method not implemented.');
  }

  ngOnDestroy(): void {
      this.dataSourceTurmasAgrupadas = new MatTableDataSource<any>([]);
      this.subscriptions.unsubscribe();
    }
}
