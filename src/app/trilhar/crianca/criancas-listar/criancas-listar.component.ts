import { CommonModule, NgIf } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { CustomizerSettingsService } from '../../../customizer-settings/customizer-settings.service';
import { BaseListComponent } from '../../../shared/baseList';
import { CriancasService } from '../criancas.service';
import * as types from '../criancas.types';

@Component({
  selector: 'app-criancas-listar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MaterialModule,
    NgIf,
  ],
  templateUrl: './criancas-listar.component.html',
  styleUrl: './criancas-listar.component.scss',
})
export class CriancasListarComponent extends BaseListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = [
    //'select',
    //'Codigo',
    'CodigoCadastro',
    'NomeCrianca',
    'DataNascimento',
    'NomeMae',
    'NomePai',
    'OutroResponsavel',
    'Telefone',
    //'EnderecoEmail',
    'Alergia',
    //'DescricaoAlergia',
    'RestricaoAlimentar',
    //'DescricaoRestricaoAlimentar',
    'DeficienciaOuSituacaoAtipica',
    //'DescricaoDeficiencia',
    //'Batizado',
    //'DataBatizado',
    //'IgrejaBatizado',
    'Ativo',
    //'CodigoUsuarioLogado',
    'DataAtualizacao',
    'DataCadastro',
    'Action',
  ];
  dataSource = new MatTableDataSource<types.CriancaView>([]);
  selection = new SelectionModel<types.CriancaView>(true, []);

  //dataSource = new MatTableDataSource<any>();
  totalItems = 0;
  page = 0;
  pageSize = 10;


  // alternado
  isToggled = false;

  constructor(
    public themeService: CustomizerSettingsService,
    private fb: FormBuilder,
    private criancaService: CriancasService,
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

  override ngOnInit() {
    var filtro = this.montaFiltro(1, 10);
    this.carregarAlunos(filtro);
  }

  override preencheFiltro(): void {
    throw new Error('Method not implemented.');
  }

  onPageChange(event: any): void {
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;

    var filtro = this.montaFiltro(this.page, this.pageSize);
    this.carregarAlunos(filtro);
  }

  montaFiltro(page: number, pageSize: number) {
    var filtro = {
      //condicao: "Ativo = @Ativo",
      // parametros: {
      //   Ativo: true,
      //   CodigoCadastro: "1484"
      // },
      isPaginacao: true,
      page: page,
      pageSize: pageSize
    }

    return filtro;
  }

  // async ngOnInit() {
  //   await this.carregarAlunosPromise();
  // }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.dataSource = new MatTableDataSource<types.CriancaView>([]);
    this.selection = new SelectionModel<types.CriancaView>(true, []);
  }

  carregarAlunos(filtro: any) {
  this.criancaService.listarPorFiltro(filtro, (res: any) => {
    if (res) {
      //console.log(res);
      this.totalItems = res.totalItens;
      const alunosView: types.CriancaView[] = res.dados.map((aluno: any) => ({
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
        // Adicionando a propriedade 'Action' para que o AlunoView fique completo
        Action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete',
        },
      }));
      this.dataSource = new MatTableDataSource<types.CriancaView>(alunosView);
      }
    });
  }

  async carregarAlunosPromise(): Promise<void> {
    var alunos = await this.criancaService.listarTodosPromise();

    if(alunos.length > 0)  {
      // Mapeando AlunoModel para AlunoView
      const alunosView: types.CriancaView[] = alunos.map((aluno: any) => ({
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
        // Adicionando a propriedade 'Action' para que o AlunoView fique completo
        Action: {
          view: 'visibility',
          edit: 'edit',
          delete: 'delete',
        },
      }));

      var ll = alunosView.filter(x => x.CodigoCadastro.toString() == '2239')

      this.dataSource = new MatTableDataSource<types.CriancaView>(alunosView); // Definindo os dados mapeados
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
  checkboxLabel(row?: types.CriancaView): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.NomeCrianca + 1
    }`;
  }

  // Filtro de pesquisa
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}

const ELEMENT_DATA: types.CriancaView[] = [
  {
    Codigo: '1',
    CodigoCadastro: '11111',
    NomeCrianca: 'ttttt',
    DataNascimento: 'ttttt',
    NomeMae: 'ttttt',
    NomePai: 'ttttt',
    OutroResponsavel: 'ttttt',
    Telefone: 'ttttt',
    EnderecoEmail: 'ttttt',
    Alergia: true,
    DescricaoAlergia: 'ttttt',
    RestricaoAlimentar: true,
    DescricaoRestricaoAlimentar: 'ttttt',
    DeficienciaOuSituacaoAtipica: true,
    DescricaoDeficiencia: 'ttttt',
    Batizado: true,
    DataBatizado: '6',
    IgrejaBatizado: 'ttttt',
    Ativo: true,
    CodigoUsuarioLogado: 'ttttt',
    DataAtualizacao: 'ttttt',
    DataCadastro: 'ttttt',
    Action: {
      view: 'visibility',
      edit: 'edit',
      delete: 'delete',
    },
  },
  {
    Codigo: '2',
    CodigoCadastro: '22222',
    NomeCrianca: 'ttttt',
    DataNascimento: 'ttttt',
    NomeMae: 'ttttt',
    NomePai: 'ttttt',
    OutroResponsavel: 'ttttt',
    Telefone: 'ttttt',
    EnderecoEmail: 'ttttt',
    Alergia: false,
    DescricaoAlergia: 'ttttt',
    RestricaoAlimentar: true,
    DescricaoRestricaoAlimentar: 'ttttt',
    DeficienciaOuSituacaoAtipica: true,
    DescricaoDeficiencia: 'ttttt',
    Batizado: true,
    DataBatizado: 'ttttt',
    IgrejaBatizado: 'ttttt',
    Ativo: true,
    CodigoUsuarioLogado: 'ttttt',
    DataAtualizacao: 'ttttt',
    DataCadastro: 'ttttt',
    Action: {
      view: 'visibility',
      edit: 'edit',
      delete: 'delete',
    },
  },
  {
    Codigo: '3',
    CodigoCadastro: '33333',
    NomeCrianca: 'ttttt',
    DataNascimento: 'ttttt',
    NomeMae: 'ttttt',
    NomePai: 'ttttt',
    OutroResponsavel: 'ttttt',
    Telefone: 'ttttt',
    EnderecoEmail: 'ttttt',
    Alergia: true,
    DescricaoAlergia: 'ttttt',
    RestricaoAlimentar: true,
    DescricaoRestricaoAlimentar: 'ttttt',
    DeficienciaOuSituacaoAtipica: true,
    DescricaoDeficiencia: 'ttttt',
    Batizado: true,
    DataBatizado: 'ttttt',
    IgrejaBatizado: 'ttttt',
    Ativo: true,
    CodigoUsuarioLogado: 'ttttt',
    DataAtualizacao: 'ttttt',
    DataCadastro: 'ttttt',
    Action: {
      view: 'visibility',
      edit: 'edit',
      delete: 'delete',
    },
  },
  {
    Codigo: '4',
    CodigoCadastro: '4444',
    NomeCrianca: 'ttttt',
    DataNascimento: 'ttttt',
    NomeMae: 'ttttt',
    NomePai: 'ttttt',
    OutroResponsavel: 'ttttt',
    Telefone: 'ttttt',
    EnderecoEmail: 'ttttt',
    Alergia: true,
    DescricaoAlergia: 'ttttt',
    RestricaoAlimentar: true,
    DescricaoRestricaoAlimentar: 'ttttt',
    DeficienciaOuSituacaoAtipica: true,
    DescricaoDeficiencia: 'ttttt',
    Batizado: true,
    DataBatizado: 'ttttt',
    IgrejaBatizado: 'ttttt',
    Ativo: true,
    CodigoUsuarioLogado: 'ttttt',
    DataAtualizacao: 'ttttt',
    DataCadastro: 'ttttt',
    Action: {
      view: 'visibility',
      edit: 'edit',
      delete: 'delete',
    },
  },
];
