import { CommonModule, NgIf } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerIntl } from '@angular/material/datepicker';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { map, Observable, startWith } from 'rxjs';
import { BaseFormComponent } from '../../../shared/formulario/baseForms';
import { MaterialModule } from '../../../material.module';
import { CriancaService } from '../crianca.service';
import { AutoCompleteComponent } from '../../../shared/auto-complete/auto-complete.component';
import { CalendarioComponent, DataOutPut } from '../../../shared/calendario/calendario.component';
import * as utils from '../../../funcoes-comuns/utils';
import * as validar from '../../../funcoes-comuns/validators/validator';
import * as types from '../crianca.types';

interface MatriculaAutoComplete {
  id: number;
  descricao: string;
}
interface Turma {
  id: number;
  descricao: string;
  ano: string;
  semestre: string;
}

@Component({
  selector: 'app-criancas-formulario',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MaterialModule,
    NgIf,
    NgxMaskDirective,
    AutoCompleteComponent,
    CalendarioComponent
],
  providers: [provideNgxMask()],

  templateUrl: './crianca-formulario.component.html',
  styleUrl: './crianca-formulario.component.scss',
})
export class CriancaFormularioComponent extends BaseFormComponent implements OnInit {
  @ViewChild(AutoCompleteComponent) childAutoCompleteComponent!: AutoCompleteComponent;
  @ViewChild(CalendarioComponent) childCalendarioComponent!: CalendarioComponent;

  override formulario!: FormGroup;

  // Filter Autocomplete
  listaMatriculas!: MatriculaAutoComplete[];
  listaMatriculasFiltradas!: Observable<MatriculaAutoComplete[]>;

  turmas: Turma[] = [];
  turmaSelecionado: Turma | null = null;

  constructor(
    private fb: FormBuilder,
    private criancaService: CriancaService,
    private _adapter: DateAdapter<any>,
    private _intl: MatDatepickerIntl,
    public override router: Router,
    public override activatedRoute: ActivatedRoute,
    @Inject(MAT_DATE_LOCALE) private _locale: string
  ) {
    super(router, activatedRoute);
    this._locale = 'pt-br';
    this._adapter.setLocale(this._locale);
    this._intl.closeCalendarLabel = 'Fechar calendário';
    this._intl.changes.next();
  }

  override ngOnInit(): void {
    this.formulario = this.fb.group({
      NomeCrianca: ['', Validators.required],
      DataNascimento: ['', Validators.required],
      IdadeCrianca: [{ value: '', disabled: true }],
      TurmaMatricula: [null, Validators.required],
      NomeMae: [''],
      NomePai: [''],
      OutroResponsavel: [''],
      Telefone: [''], // validar telefone celular
      EnderecoEmail: [''], // Validador de email
      Alergia: [false],
      DescricaoAlergia: [{ value: '', disabled: true }],
      RestricaoAlimentar: [false],
      DescricaoRestricaoAlimentar: [{ value: '', disabled: true }],
      DeficienciaOuSituacaoAtipica: [false],
      DescricaoDeficiencia: [{ value: '', disabled: true }],
      Batizado: [false],
      DataBatizado: [{ value: '', disabled: true }],
      IgrejaBatizado: [{ value: '', disabled: true }],
      Ativo: [true],
    });

    this.handleConditionalFields();

    this.preencheFormulario();
  }

  override preencheFormulario(): void {
    this.carregarDadosTurma('2024', '2');
    this.turmaSelecionado = this.turmas.find(u => u.id === 4) || null;

    //this.formulario.get("DataNascimento")?.setValue('10/09/2025');
  }

  //auto complete
  // Função de filtro
  private filtrarAutoComplete(value: string): MatriculaAutoComplete[] {
    const filterValue = value.toLowerCase();
    var retorno = this.listaMatriculas.filter((option) =>
      option.descricao.toLowerCase().includes(filterValue)
    );
    return retorno;
  }

  opcaoSelecionada($event: MatAutocompleteSelectedEvent) {
    var evento = $event.option.value;
    console.log('Selecionado:');
    console.log(evento);
  }

  // Função para exibir a descrição no campo de texto
  displayFn(value: MatriculaAutoComplete): string {
    var retorno = value && value.descricao ? value.descricao : '';
    return retorno;
  }

  get f() {
    return this.formulario.controls;
  }

  handleConditionalFields(): void {
    this.formulario.get('DataNascimento')?.valueChanges.subscribe((value) => {
      const dataNascimento = this.formulario.get('DataNascimento');
      const idadeCrianca = this.formulario.get('IdadeCrianca');

      if (this.formulario.get('DataNascimento')?.errors) {
        try {
          //const erros = this.formulario.get('DataNascimento')?.errors;
          var erros = dataNascimento?.errors;
          var valorTextoCampoDigitado =
            erros != null || erros != undefined
              ? erros['matDatepickerParse'].text
              : null;
          if (valorTextoCampoDigitado) {
            idadeCrianca?.setValue('');
            if (utils.validarData(valorTextoCampoDigitado)) {
              var data = utils.retornaDataByString(valorTextoCampoDigitado);
              const idadeFormatada = utils.preencheIdadeFormatada(
                data.toISOString()
              );
              idadeCrianca?.setValue(idadeFormatada, {
                emitEvent: true,
              });

              this.formulario
                .get('TurmaMatricula')
                ?.setValue([{ id: 2, descricao: 'Lilas 2' }], {
                  emitEvent: false,
                });

              this.formulario.get('DataNascimento')?.setValue(data);
              //dataNascimento?.setValue(data, { emitEvent: false });
            }
          }
        } catch (error) {
          idadeCrianca?.setValue('');
        }
      }
      if (value) {
        const idadeFormatada = utils.preencheIdadeFormatada(
          value
        );
        idadeCrianca?.setValue(idadeFormatada, { emitEvent: true });
        //idadeCrianca?.setValue(idadeFormatada);
      }
      // else {
      //     idadeCrianca?.setValue('');
      // }
    });

    this.formulario.get('Telefone')?.valueChanges.subscribe((value) => {
      const telefone = this.formulario.get('Telefone');
      if (value) {
        telefone?.setValidators([validar.telefoneValidator()]);
      } else {
        telefone?.clearValidators();
      }
      telefone?.updateValueAndValidity({ emitEvent: false });
    });

    this.formulario.get('EnderecoEmail')?.valueChanges.subscribe((value) => {
      const enderecoEmail = this.formulario.get('EnderecoEmail');
      if (value) {
        enderecoEmail?.setValidators([validar.emailValidator()]);
      } else {
        enderecoEmail?.clearValidators();
      }
      enderecoEmail?.updateValueAndValidity({ emitEvent: false });
    });

    this.formulario.get('Alergia')?.valueChanges.subscribe((value) => {
      const descricaoAlergia = this.formulario.get('DescricaoAlergia');
      if (value) {
        descricaoAlergia?.setValidators([Validators.required]);
        descricaoAlergia?.enable();
      } else {
        descricaoAlergia?.clearValidators();
        descricaoAlergia?.disable();
      }
      descricaoAlergia?.updateValueAndValidity({ emitEvent: false });
    });

    this.formulario
      .get('RestricaoAlimentar')
      ?.valueChanges.subscribe((value) => {
        const descricaoRestricao = this.formulario.get(
          'DescricaoRestricaoAlimentar'
        );
        if (value) {
          descricaoRestricao?.setValidators([Validators.required]);
          descricaoRestricao?.enable();
        } else {
          descricaoRestricao?.clearValidators();
          descricaoRestricao?.disable();
        }
        descricaoRestricao?.updateValueAndValidity({
          emitEvent: false,
        });
      });

    this.formulario
      .get('DeficienciaOuSituacaoAtipica')
      ?.valueChanges.subscribe((value) => {
        const descricaoDeficiencia = this.formulario.get(
          'DescricaoDeficiencia'
        );
        if (value) {
          descricaoDeficiencia?.setValidators([Validators.required]);
          descricaoDeficiencia?.enable();
        } else {
          descricaoDeficiencia?.clearValidators();
          descricaoDeficiencia?.disable();
        }
        descricaoDeficiencia?.updateValueAndValidity({
          emitEvent: false,
        });
      });

    this.formulario.get('Batizado')?.valueChanges.subscribe((value) => {
      const dataBatizado = this.formulario.get('DataBatizado');
      const igrejaBatizado = this.formulario.get('IgrejaBatizado');
      if (value) {
        dataBatizado?.setValidators([Validators.required]);
        dataBatizado?.enable();
        igrejaBatizado?.setValidators([Validators.required]);
        igrejaBatizado?.enable();
      } else {
        dataBatizado?.clearValidators();
        dataBatizado?.disable();
        igrejaBatizado?.clearValidators();
        igrejaBatizado?.disable();
      }
      dataBatizado?.updateValueAndValidity({ emitEvent: false });
      igrejaBatizado?.updateValueAndValidity({ emitEvent: false });
    });
  }

  salvar(): void {
    if (!this.formulario.valid) {
      console.log(this.formulario.value);
      console.log('Formulário inválido');
      return;
    }

    const valoresForm = this.formulario.getRawValue();
    var filtro = {
      codigo: 0,
      codigoCadastro: '',
      nomeCrianca: valoresForm.NomeCrianca,
      dataNascimento: valoresForm.DataNascimento,
      nomeMae: valoresForm.NomeMae,
      nomePai: valoresForm.NomePai,
      outroResponsavel: valoresForm.OutroResponsavel,
      telefone: valoresForm.Telefone,
      enderecoEmail: valoresForm.EnderecoEmail,
      alergia: valoresForm.Alergia,
      descricaoAlergia: valoresForm.DescricaoAlergia,
      restricaoAlimentar: valoresForm.RestricaoAlimentar,
      descricaoRestricaoAlimentar: valoresForm.DescricaoRestricaoAlimentar,
      deficienciaOuSituacaoAtipica: valoresForm.DeficienciaOuSituacaoAtipica,
      descricaoDeficiencia: valoresForm.DescricaoDeficiencia,
      batizado: valoresForm.Batizado,
      dataBatizado: valoresForm.DataBatizado,
      igrejaBatizado: valoresForm.IgrejaBatizado,
      ativo: valoresForm.Ativo,
      codigoUsuarioLogado: 0,
      dataAtualizacao: utils.obterDataHoraBrasileira(),
      dataCadastro: utils.obterDataHoraBrasileira(),
    };

    //if (this.isNovo) {
    this.criancaService.Incluir(filtro, (res: any) => {
      if (res) {
        //this.finalizarAcao();
      }
    });
    //}
  }

  limpar(): void {
    this.formulario.reset();
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
        (t) => t.ano === anoSelecionado
      ) || [];
  }

  onTurmaSelecionado(turmaSelecionada: Turma): void {
    //console.log('Turma selecionado do autocomplete:', turmaSelecionada);
    if (turmaSelecionada) {
      this.formulario.patchValue({
        TurmaMatricula: turmaSelecionada
      });
    }
  }
  // childCalendarioComponent
  onDataNascimentoSelecionada(dataNascimentoSelecionada: DataOutPut): void {
    //console.log('dataNascimentoSelecionada selecionado do autocomplete:', dataNascimentoSelecionada);
    if (dataNascimentoSelecionada) {
      this.formulario.patchValue({
        DataNascimento: dataNascimentoSelecionada.dataFormatada
      });
    }
  }
}


