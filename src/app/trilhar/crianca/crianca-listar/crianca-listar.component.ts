import { CommonModule, NgIf } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { CustomizerSettingsService } from '../../../customizer-settings/customizer-settings.service';
import { BaseListComponent } from '../../../shared/formulario/baseList';
import { MensagemService } from '../../../services/mensagem.service';
import { CriancaService } from '../crianca.service';
import * as types from '../crianca.types';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-criancas-listar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MaterialModule,
    NgIf,
    FormsModule,
  ],
  templateUrl: './crianca-listar.component.html',
  styleUrl: './crianca-listar.component.scss',
})
export class CriancaListarComponent extends BaseListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  searchText: string = ''; // Variável para armazenar o texto da pesquisa
  displayedColumns: string[] = [
    //'select',
    //'codigo',
    'codigoCadastro',
    'ativo',
    'nomeCrianca',
    'dataNascimento',
    'nomeMae',
    'nomePai',
    'outroResponsavel',
    'telefone',
    //'enderecoEmail',
    'alergia',
    //'descricaoAlergia',
    'restricaoAlimentar',
    //'descricaoRestricaoAlimentar',
    'deficienciaOuSituacaoAtipica',
    //'descricaoDeficiencia',
    //'batizado',
    //'dataBatizado',
    //'igrejaBatizado',
    //'codigoUsuarioLogado',
    'dataAtualizacao',
    'dataCadastro',
    'acoes',
  ];
  dataSource = new MatTableDataSource<types.IAlunoOutput>([]);
  selection = new SelectionModel<types.IAlunoOutput>(true, []);

  //dataSource = new MatTableDataSource<any>();
  totalItems = 0;
  page = 0;
  pageSize = 10;


  // alternado
  isToggled = false;

  constructor(
    public themeService: CustomizerSettingsService,
    private fb: FormBuilder,
    private criancaService: CriancaService,
    private mensagemService: MensagemService,
    public override router: Router,
    public override activatedRoute: ActivatedRoute,
  ) {
    super(router, activatedRoute);
    this.themeService.isToggled$.subscribe((isToggled) => {
      this.isToggled = isToggled;
    });
    var ljlj = this.getOperacao();
    var lkjlll = this.getTitle();
  }

  // override async ngOnInit() {
  //   // Depois, com um pequeno delay, definimos os valores iniciais
  //   setTimeout(async () => {
  //     var filtro = this.montaFiltro(1, 10);
  //     await this.carregarAlunosPromise(filtro);
  //   }, 100);
  // }

  override ngOnInit() {
    //var filtro = this.montaFiltro(1, 10);
    //this.carregarAlunos(filtro);
  }

  override preencheFiltro(): void {
    throw new Error('Method not implemented.');
  }

  async onPageChange(event: any): Promise<void> {
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;

    var filtro = this.montaFiltro(this.page, this.pageSize);
    if(this.searchText) {
      this.applyFilter();
    }
    else {
      await this.carregarAlunos(filtro);
    }
  }

  montaFiltro(page: number, pageSize: number) {
    var filtro: types.IAlunoInput = new types.IAlunoInput();
    filtro.isPaginacao = true;
    filtro.page = page;
    filtro.pageSize = pageSize;

    return filtro;
  }

  // async ngOnInit() {
  //   await this.carregarAlunosPromise();
  // }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.dataSource = new MatTableDataSource<types.IAlunoOutput>([]);
    this.selection = new SelectionModel<types.IAlunoOutput>(true, []);
  }

  carregarAlunos(filtro: types.IAlunoInput): void {
    this.criancaService.listarPorFiltro(filtro, (res: any) => {
      if (res?.dados) {
        this.totalItems = res.dados.totalItens;
        var alunoOutput: types.IAlunoOutput[] = res.dados.dados;
        var temp = alunoOutput.map(aluno => ({
          ...aluno,
          Action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete',
          },
        }));
        alunoOutput = temp;
        this.dataSource = new MatTableDataSource<types.IAlunoOutput>(alunoOutput);
      }
    });
  }

  async carregarAlunosPromise(filtro: types.IAlunoInput): Promise<void> {
    var res = await this.criancaService.listarPorFiltroPromise(filtro);
    if (res?.dados) {
      this.totalItems = res.dados.totalItens;
      var alunoOutput: types.IAlunoOutput[] = res.dados.dados;
      var temp = alunoOutput.map(aluno => ({
        ...aluno,
        Action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete',
        },
      }));
      alunoOutput = temp;
      this.dataSource = new MatTableDataSource<types.IAlunoOutput>(alunoOutput);
      }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  /** Se o número de elementos selecionados corresponde ao número total de linhas. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Seleciona todas as linhas se não estiverem todas selecionadas; caso contrário, limpa a seleção. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataSource.data);
  }

  /** O rótulo da caixa de seleção na linha passada */
  checkboxLabel(row?: types.IAlunoOutput): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.nomeCrianca + 1
    }`;
  }


  // Filtro de pesquisa
  async applyFilter() {
    //this.dataSource.filter = this.searchText.trim().toLowerCase();

    if(this.searchText) {
      var filtro: types.IAlunoInput = new types.IAlunoInput();
      filtro.codigoCadastro = this.searchText.trim();
      filtro.isPaginacao = true;
      filtro.page = this.page = 1;
      filtro.pageSize = this.pageSize = 10;
      await this.carregarAlunos(filtro);
    }
    else {
      var filtros = this.montaFiltro(this.page, this.pageSize);
      await this.carregarAlunos(filtros);
    }

  }
}
