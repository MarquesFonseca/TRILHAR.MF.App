import { CommonModule, NgIf } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { CustomizerSettingsService } from '../../../customizer-settings/customizer-settings.service';
import { BaseListComponent } from '../../../shared/formulario/baseList';
import * as types from '../turma.types';
import { TurmaService } from '../turma.service';

@Component({
  selector: 'app-turma-listar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MaterialModule,
    NgIf,
  ],
  templateUrl: './turma-listar.component.html',
  styleUrl: './turma-listar.component.scss'
})
export class TurmaListarComponent extends BaseListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  pesquisarPorAtivosInativos: boolean = true;

  displayedColumns: string[] = [
    //'select',
    'codigo',
    'descricao',
    'idadeInicialAluno',
    'idadeFinalAluno',
    'anoLetivo',
    'semestreLetivo',
    'limiteMaximo',
    'ativo',
    //'codigoUsuarioLogado',
    'dataAtualizacao',
    'dataCadastro',
    'Action',
  ];
  dataSource = new MatTableDataSource<types.TurmaView>([]);
  selection = new SelectionModel<types.TurmaView>(true, []);

  //dataSource = new MatTableDataSource<any>();
  totalItems = 0;
  pageIndex = 0;
  page = 0;
  pageSize = 10;


  // alternado
  isToggled = false;

  constructor(
    public themeService: CustomizerSettingsService,
    private turmaService: TurmaService,
    public override router: Router,
    public override activatedRoute: ActivatedRoute
  ) {
    super(router, activatedRoute);
    this.themeService.isToggled$.subscribe((isToggled) => {
      this.isToggled = isToggled;
    });
  }

  override ngOnInit() {
    this.pageIndex = 0;
    this.page = 1;
    this.pageSize = 10;
    var filtro = this.montaFiltro(this.page, this.pageSize);
    this.carregarTurmas(filtro);
  }

  override preencheFiltro(): void {
    throw new Error('Method not implemented.');
  }

  onToggleChange(event: any) {
    this.pesquisarPorAtivosInativos = event.checked;
    console.log('Novo valor do toggle:', this.pesquisarPorAtivosInativos);

    this.pageIndex = 0;
    this.page = 1;
    this.pageSize = 10;
    var filtro = this.montaFiltro(this.page, this.pageSize);
    this.carregarTurmas(filtro);
  }

  onPageChange(event: any): void {
    this.pageIndex = event.pageIndex;
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;

    var filtro = this.montaFiltro(this.page, this.pageSize);
    this.carregarTurmas(filtro);
  }

  montaFiltro(page: number, pageSize: number) {
    var filtro = {
      condicao: "Ativo = @Ativo",
      parametros: {
        Ativo: Boolean(this.pesquisarPorAtivosInativos)
      },
      isPaginacao: true,
      page: page == 0 ? 1 : page,
      pageSize: pageSize == 0 ? 10 : pageSize
    }

    return filtro;
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.dataSource = new MatTableDataSource<types.TurmaView>([]);
    this.selection = new SelectionModel<types.TurmaView>(true, []);
  }

  carregarTurmas(filtro: any) {
  this.turmaService.listarPorFiltro(filtro, (res: any) => {
    if (res) {
      //console.log(res);
      this.totalItems = res.totalItens;
      const alunosView: types.TurmaView[] = res.dados.map((turma: any) => ({
        codigo: turma.codigo,
        descricao: turma.descricao,
        idadeInicialAluno: turma.idadeInicialAluno,
        idadeFinalAluno: turma.idadeFinalAluno,
        anoLetivo: turma.anoLetivo,
        semestreLetivo: turma.semestreLetivo,
        limiteMaximo: turma.limiteMaximo,
        ativo: turma.ativo,
        //codigoUsuarioLogado: turma.codigoUsuarioLogado,
        dataAtualizacao: turma.dataAtualizacao,
        dataCadastro: turma.dataCadastro,
        // Adicionando a propriedade 'Action' para que o TurmaView fique completo
        Action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete',
        },
      }));
      this.dataSource = new MatTableDataSource<types.TurmaView>(alunosView);
      }
    });
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
  checkboxLabel(row?: types.TurmaView): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.descricao + 1
    }`;
  }

  // Filtro de pesquisa
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
