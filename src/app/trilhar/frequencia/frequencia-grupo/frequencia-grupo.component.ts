import { SelectionModel } from '@angular/cdk/collections';
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CustomizerSettingsService } from '../../../customizer-settings/customizer-settings.service';
import { MaterialModule } from '../../../material.module';
import { MensagemService } from '../../../services/mensagem.service';
import { BaseListComponent } from '../../../shared/formulario/baseList';
import { CriancaService } from '../../crianca/crianca.service';
import { MatriculaService } from '../../matricula/matricula.service';
import * as types from '../../crianca/crianca.types';
import { MatDialog } from '@angular/material/dialog';
import { EtiquetaDialogComponent } from '../../Imprimir/etiqueta-dialog/etiqueta-dialog.component';

@Component({
  selector: 'app-frequencia-grupo',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MaterialModule,
    FormsModule
  ],
  templateUrl: './frequencia-grupo.component.html',
  styleUrl: './frequencia-grupo.component.scss'
})
export class FrequenciaGrupoComponent extends BaseListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

    displayedColumns: string[] = [
      'select',
      // 'codigoAluno',
      'alunoCodigoCadastro',
      'alunoNomeCrianca',
      'turmaDescricao',
    ];
    dataSource = new MatTableDataSource<any>([]);
    selection = new SelectionModel<any>(true, []);

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
      private matriculaService: MatriculaService,
      private mensagemService: MensagemService,
      private dialog: MatDialog,
      public override router: Router,
      public override activatedRoute: ActivatedRoute,
    ) {
      super(router, activatedRoute);
      this.themeService.isToggled$.subscribe((isToggled) => {
        this.isToggled = isToggled;
        if(!this.isProducao) console.clear();
      });
    }

    // override async ngOnInit() {
    //   // Depois, com um pequeno delay, definimos os valores iniciais
    //   setTimeout(async () => {
    //     var filtro = this.montaFiltro(1, 10);
    //     await this.carregarAlunosPromise(filtro);
    //   }, 100);
    // }

    override ngOnInit() {
      //var filtro = this.montaFiltro();
      this.carregarMatriculas(this.montaFiltro());
    }

    override preencheFiltro(): void {
      throw new Error('Method not implemented.');
    }

    async onPageChange(event: any): Promise<void> {
      this.page = event.pageIndex + 1;
      this.pageSize = event.pageSize;

      //var filtro = this.montaFiltro();
      await this.carregarMatriculas(this.montaFiltro());
    }

    montaFiltro() {
      var filtro = {
        ativo: true,
        alunoOutroResponsavel: 'lar batista',
        alunoAtivo: true,
        turmaAnoLetivo: 2025,
        turmaSemestreLetivo: 2,
        turmaAtivo: true,
        isPaginacao: false,
      }
      return filtro;
    }

    // async ngOnInit() {
    //   await this.carregarAlunosPromise();
    // }

    ngOnDestroy(): void {
      //Called once, before the instance is destroyed.
      //Add 'implements OnDestroy' to the class.
      this.dataSource = new MatTableDataSource<any>([]);
      this.selection = new SelectionModel<any>(true, []);
    }

    carregarMatriculas(filtro: any): void {
      this.matriculaService.listarPorFiltro(filtro, (res: any) => {
        if (res?.dados) {
          this.totalItems = res.dados.totalItens;
          var matriculaOutput = res.dados.dados;
          matriculaOutput = matriculaOutput.sort((a: any, b: any) =>
            a.alunoNomeCrianca.localeCompare(b.alunoNomeCrianca)
          );
          this.dataSource = new MatTableDataSource<any>(matriculaOutput);
        }
      });
    }

    async carregarAlunosPromise(filtro: types.IAlunoInput): Promise<void> {
      var res = await this.criancaService.listarPorFiltroPromise(filtro);
      if (res?.dados) {
        this.totalItems = res.dados.totalItens;
        var alunoOutput: any[] = res.dados.dados;
        var temp = alunoOutput.map(aluno => ({
          ...aluno,
          Action: {
              view: 'visibility',
              edit: 'edit',
              delete: 'delete',
          },
        }));
        alunoOutput = temp;
        this.dataSource = new MatTableDataSource<any>(alunoOutput);
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
    checkboxLabel(row?: any): string {
      if (!row) {
        return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
      }
      return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
        row.nomeCrianca + 1
      }`;
    }

  abrirEtiquetas() {
    var selecionados = this.selection.selected;
    var listaSelecionados = selecionados.map(s => ({
      codigo: s.alunoCodigoCadastro || '',
      nome: s.alunoNomeCrianca || '',
      turma: s.turmaDescricao || ''
    }));

    this.dialog.open(EtiquetaDialogComponent, {
      width: '80%',
      height: '80%',
      data: {
        etiquetas: listaSelecionados
      }
    });
  }

  }
