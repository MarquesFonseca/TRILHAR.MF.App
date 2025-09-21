import { SelectionModel } from '@angular/cdk/collections';
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CustomizerSettingsService } from '../../../customizer-settings/customizer-settings.service';
import { MaterialModule } from '../../../material.module';
import { MensagemService } from '../../../services/mensagem.service';
import { AutoCompleteComponent } from '../../../shared/auto-complete/auto-complete.component';
import { BaseListComponent } from '../../../shared/formulario/baseList';
import { CriancaService } from '../crianca.service';
import * as types from '../crianca.types';
import { isNullOrEmpty } from '../../../shared/funcoes-comuns/utils';

@Component({
  selector: 'app-criancas-listar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MaterialModule,
    FormsModule,
    AutoCompleteComponent
  ],
  templateUrl: './crianca-listar.component.html',
  styleUrl: './crianca-listar.component.scss',
})
export class CriancaListarComponent extends BaseListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(AutoCompleteComponent) childAutoCompleteComponent!: AutoCompleteComponent;

  formularioPesquisar!: FormGroup;
  listaAlunosAutoComplete: any[] = [];
  listaTurmasAutoComplete: any[] = [];

  searchText: string = ''; // Variável para armazenar o texto da pesquisa
  displayedColumns: string[] = [
    //'select',
    //'codigo',
    'acoes',
    'codigoCadastro',
    'ativo',
    'nomeCrianca',
    'turmaDescricao',
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
  ];
  dataSource = new MatTableDataSource<types.IAlunoOutput>([]);
  selection = new SelectionModel<types.IAlunoOutput>(true, []);

  //dataSource = new MatTableDataSource<any>();
  totalItems = 0;
  pageIndex = 0;
  page = 1;
  pageSize = 5;


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
      if (!this.isProducao) console.clear();
    });
  }

  override ngOnInit() {
    this.carregaFormGroupPesquisar();
    setTimeout(async () => {
      //var filtro = this.montaFiltro(1, 5);
      this.carregaListaAlunosAutoComplete();
      //this.carregaListaTurmasAutoComplete('2025', '2');
    }, 100);
  }

  carregaFormGroupPesquisar() {
    this.formularioPesquisar = this.fb.group({
      codigo: [0],
      codigoCadastro: [''],
      alunoSelecionado: [null],
      nomeCrianca: [''],
      //dataNascimento: [null, [Validators.required, validar.dataValidaValidator(), validar.dataNaoFuturaValidator()]],
      //idadeCrianca: [''],
      //turmaMatricula: [null],
      nomeMae: [''],
      nomePai: [''],
      outroResponsavel: [''],
      //telefone: ['', validar.telefoneValidator()],
      // enderecoEmail: ['', validar.emailValidator()],
      alergia: [null],
      // descricaoAlergia: [''],
      restricaoAlimentar: [null],
      // descricaoRestricaoAlimentar: [''],
      deficienciaOuSituacaoAtipica: [null],
      // descricaoDeficiencia: [''],
      batizado: [null],
      // dataBatizado: [null],
      // igrejaBatizado: [''],
      ativo: [null],
      // codigoUsuarioLogado: [null],
      // dataAtualizacao: [null],
      // dataCadastro: [null],
    });
  }

  private carregaListaAlunosAutoComplete() {
    var filtro: types.IAlunoInput = new types.IAlunoInput();
    filtro.isPaginacao = false;
    //filtro.codigoCadastro = '1484';

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

  public onListaAlunosAutoCompleteSelecionado(alunoSelecionada: any): void {
    if (alunoSelecionada) {
      this.formularioPesquisar.patchValue({
        codigo: alunoSelecionada.id,
        codigoCadastro: alunoSelecionada.codigoCadastro,
        alunoSelecionado: alunoSelecionada
      });
    }
  }

  private carregaListaTurmasAutoComplete(anoSelecionado: string, semestreSelecionado: string) {
    // Simulando carregamento de dados de um serviço
    //traga todos as turmas no ano selecionado, semestre selecionado
    var listaTurmasMock = [
      { id: 1, descricao: '1 - Turma 1', ano: '2023', semestre: '1' },
      { id: 2, descricao: '2 - Turma 2', ano: '2023', semestre: '2' },
      { id: 3, descricao: '3 - Turma 3', ano: '2024', semestre: '1' },
      { id: 4, descricao: '4 - Turma 4', ano: '2024', semestre: '2' },
      { id: 5, descricao: '5 - Turma 5', ano: '2025', semestre: '1' },
      { id: 6, descricao: '6 - Turma 6', ano: '2025', semestre: '2' },
      { id: 7, descricao: '7 - Turma 7', ano: '2025', semestre: '2' },
      { id: 8, descricao: '8 - Turma 8', ano: '2025', semestre: '2' },
      { id: 1484, descricao: '1484 - Maitê Marques Ferreira Fonseca', ano: '2025', semestre: '2' },
      { id: 2484, descricao: '2484 - Maite Marques Ferreira Fonseca', ano: '2025', semestre: '2' },
    ] as any[];

    this.listaTurmasAutoComplete =
      listaTurmasMock.filter(
        (t) => t.ano === anoSelecionado
      ) || [];
  }

  public onlistaTurmasAutoCompleteSelecionado(turmaSelecionada: any): void {
    //console.log('Turma selecionado do autocomplete:', turmaSelecionada);
    if (turmaSelecionada) {
      this.formularioPesquisar.patchValue({
        TurmaMatricula: turmaSelecionada
      });
    }
  }

  override preencheFiltro(): void {
    throw new Error('Method not implemented.');
  }

  async onPageChange(event: any): Promise<void> {
    this.pageIndex = event.pageIndex;
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;

    var filtro = this.montaFiltro(this.page, this.pageSize);
    if (this.searchText) {
      this.applyFilter();
    }
    else {
      await this.carregarAlunos(filtro);
    }
  }

  montaFiltro(page: number, pageSize: number) {
    if(isNullOrEmpty(this.formularioPesquisar.value.alunoSelecionado)){
      this.formularioPesquisar.patchValue({
        codigo: 0,
        codigoCadastro: '',
        alunoSelecionado: null
      });
    }

    const formValues = this.formularioPesquisar.value;

    this.page = page;
    this.pageSize = pageSize;
    this.pageIndex = page - 1;

    var filtro: types.IAlunoInput = new types.IAlunoInput();
    filtro.isPaginacao = true;
    filtro.page = page;
    filtro.pageSize = pageSize;

    filtro.codigo = formValues.codigo || 0;
    filtro.codigoCadastro = formValues.codigoCadastro || '';
    filtro.nomeCrianca = formValues.nomeCrianca || '';
    // filtro.dataNascimento = null;
    filtro.nomeMae = formValues.nomeMae || '';
    filtro.nomePai = formValues.nomePai || '';
    filtro.outroResponsavel = formValues.outroResponsavel || '';
    // filtro.telefone = '';
    // filtro.enderecoEmail = null;
    filtro.alergia = formValues.alergia == null ? null : Boolean(formValues.alergia);
    // filtro.descricaoAlergia = '';
    filtro.restricaoAlimentar = formValues.restricaoAlimentar == null ? null : Boolean(formValues.restricaoAlimentar);
    // filtro.descricaoRestricaoAlimentar = '';
    filtro.deficienciaOuSituacaoAtipica = formValues.deficienciaOuSituacaoAtipica == null ? null : Boolean(formValues.deficienciaOuSituacaoAtipica);
    // filtro.descricaoDeficiencia = '';
    filtro.batizado = formValues.batizado == null ? null : Boolean(formValues.batizado);
    // filtro.dataBatizado = null;
    // filtro.igrejaBatizado = '';
    filtro.ativo = formValues.ativo == null ? null : Boolean(formValues.ativo);
    // filtro.codigoUsuarioLogado = 0; // Pode ser nulo
    // filtro.dataAtualizacao = null; // Pode ser nulo
    // filtro.dataCadastro = null; // Data atual por padrão

    // filtro.dataNascimentoInicial = null;
    // filtro.dataNascimentoFinal = null;
    // filtro.dataBatizadoInicial = null;
    // filtro.dataBatizadoFinal = null;
    // filtro.dataAtualizacaoInicial = null;
    // filtro.dataAtualizacaoFinal = null;
    // filtro.dataCadastroInicial = null;
    // filtro.dataCadastroFinal = null;

    return filtro;
  }

  ngOnDestroy(): void {
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

  pesquisar(): void {
    this.totalItems = 0;
    this.dataSource = new MatTableDataSource<types.IAlunoOutput>([]);

    var filtro = this.montaFiltro(1, this.pageSize);
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

  limpar(): void {
    this.formularioPesquisar.reset();
  }

  exportar(tipo: string): void {

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
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.nomeCrianca + 1
      }`;
  }

  // Filtro de pesquisa
  async applyFilter() {
    //this.dataSource.filter = this.searchText.trim().toLowerCase();

    if (this.searchText) {
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
