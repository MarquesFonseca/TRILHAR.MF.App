import { AutocompleteComponent } from './../../ui-elements/autocomplete/autocomplete.component';
// auto-complete-turma-ano-letivo.component.ts
import { AsyncPipe, CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit, SimpleChanges, OnChanges, AfterViewInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Observable, startWith, map, of } from 'rxjs';
import { MaterialModule } from '../../material.module';
import { AutoCompleteComponent } from '../auto-complete/auto-complete.component';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';

interface Ano {
  descricao: string;
}

interface Semestre {
  descricao: string;
  ano: string;
}

interface Turma {
  id: number;
  descricao: string;
  ano: string;
  semestre: string;
}

@Component({
  selector: 'app-auto-complete-turma-ano-letivo',
  standalone: true,
  imports: [
    MaterialModule,
    CommonModule,
    AutoCompleteComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './auto-complete-turma-ano-letivo.component.html',
  styleUrl: './auto-complete-turma-ano-letivo.component.scss',
})
export class AutoCompleteTurmaAnoLetivoComponent implements OnInit {
  // @ViewChild(MatAutocompleteTrigger)
  // private trigger: MatAutocompleteTrigger;

  @Input() valorInicial: Turma | null = null;

  @Output() itemSelecionado = new EventEmitter<any>();

  formulario!: FormGroup;
  anos: Ano[] = [];
  semestres: Semestre[] = [];
  turmas: Turma[] = [];

  // Usuario e produto pré-selecionados
  anoSelecionado: Ano | null = null;
  semestreSelecionado: Semestre | null = null;
  turmaSelecionado: Turma | null = null;

  controleAno = new FormControl('');
  controleSemestre = new FormControl('');
  controleTurma = new FormControl('');

  constructor(private fb: FormBuilder) {
    console.clear();
    this.inicializarFormulario();
  }

  private inicializarFormulario() {
    this.formulario = this.fb.group({
      turma: [null],
    });
  }

  ngOnInit() {
    // Primeiro carregamos os dados necessários
    this.carregarDadosAnos();

    // Se tiver um valor inicial, configura a cascata
    if (this.valorInicial) {
      setTimeout(() => {
        this.configurarValorInicial();
      }, 100);
    }
  }

  private configurarValorInicial() {
    // Se tiver um valor inicial, precisamos configurar toda a cascata
    if (this.valorInicial) {
      // Encontrar o ano correspondente
      this.anoSelecionado = this.anos.find(
        ano => ano.descricao === this.valorInicial?.ano
      ) || null;

      // Carregar semestres baseado no ano
      if (this.anoSelecionado) {
        this.carregarDadosSemestre(this.anoSelecionado);

        // Encontrar o semestre correspondente
        this.semestreSelecionado = this.semestres.find(
          sem => sem.descricao === this.valorInicial?.semestre &&
                sem.ano === this.valorInicial?.ano
        ) || null;

        // Carregar turmas baseado no semestre e ano
        if (this.semestreSelecionado) {
          this.carregarDadosTurma(
            this.semestreSelecionado.ano,
            this.semestreSelecionado.descricao
          );

          // Encontrar a turma correspondente
          this.turmaSelecionado = this.turmas.find(
            turma => turma.id === this.valorInicial?.id
          ) || null;

          // Atualizar o formulário
          if (this.turmaSelecionado) {
            this.formulario.patchValue({
              turma: this.turmaSelecionado
            });
          }
        }
      }
    }
  }

  private carregarDadosAnos() {
    // Simulando carregamento de dados de um serviço
    this.anos = [
      { descricao: '2023' },
      { descricao: '2024' },
      { descricao: '2025' },
    ];
  }

  onAnoSelecionado(ano: Ano): void {
    // Quando muda o ano, limpa semestres e turmas
    this.semestres = [];
    this.turmas = [];

    // Limpa as seleções
    this.semestreSelecionado = null;
    this.turmaSelecionado = null;

    // Limpa o formulário
    this.formulario.patchValue({
      turma: null
    });

    // Emite null pois não há mais turma selecionada
    this.itemSelecionado.emit(null as any);

    // Carrega os novos semestres
    if (ano) {
      this.anoSelecionado = ano;
      this.carregarDadosSemestre(ano);
    }
  }

  private carregarDadosSemestre(anoSelecionado: Ano) {
    // Simulando carregamento de dados de um serviço
    //traga todos os semestres no ano selecionado
    var listaSemetreMock = [
      { descricao: null, ano: 'Selecione' },
      //{ descricao: '1', ano: '2023' },
      { descricao: '2', ano: '2023' },
      { descricao: '1', ano: '2024' },
      { descricao: '2', ano: '2024' },
      { descricao: '1', ano: '2025' },
      { descricao: '2', ano: '2025' },
    ] as any[];

    setTimeout(() => {
      this.semestres = listaSemetreMock.filter((u) => u.ano === anoSelecionado.descricao) || [];
    }, 100);
  }

  onSemestreSelecionado(semestre: Semestre): void {
    // Quando muda o semestre, limpa as turmas
    this.turmas = [];
    this.turmaSelecionado = null;

    // Limpa o formulário
    this.formulario.patchValue({
      turma: null
    });

    // Emite null pois não há mais turma selecionada
    this.itemSelecionado.emit(null as any);

    // Carrega as novas turmas
    if (semestre) {
      this.semestreSelecionado = semestre;
      this.carregarDadosTurma(semestre.ano, semestre.descricao);
    }
  }

  private carregarDadosTurma(anoSelecionado: string, semestreSelecionado: string) {
    // Simulando carregamento de dados de um serviço
    //traga todos as turmas no ano selecionado, semestre selecionado
    var listaTurmasMock = [
      { id: 1, descricao: 'Turma 1', ano: '2023', semestre: '1' },
      { id: 2, descricao: 'Turma 2', ano: '2023', semestre: '2' },
      { id: 3, descricao: 'Turma 3', ano: '2024', semestre: '1' },
      { id: 4, descricao: 'Turma 4', ano: '2024', semestre: '2' },
      { id: 5, descricao: 'Turma 5', ano: '2025', semestre: '1' },
      { id: 6, descricao: 'Turma 6', ano: '2025', semestre: '2' },
    ] as any[];

    this.turmas =
      listaTurmasMock.filter(
        (t) => t.ano === anoSelecionado && t.semestre === semestreSelecionado
      ) || [];
  }

  onTurmaSelecionado(turma: Turma): void {
    if (turma) {
      this.turmaSelecionado = turma;

      // Atualiza o formulário
      this.formulario.patchValue({
        turma: turma
      });

      this.turmaSelecionado = turma;
      // Emite o evento para o componente pai
      this.itemSelecionado.emit(turma);
    } else {
      // Limpa o formulário
      this.formulario.patchValue({
        turma: null
      });

      // Emite null
      this.itemSelecionado.emit(null as any);
    }
  }
}
