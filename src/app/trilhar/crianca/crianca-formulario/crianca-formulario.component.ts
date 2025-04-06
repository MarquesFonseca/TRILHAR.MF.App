import { CommonModule, NgIf, ViewportScroller } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { Observable, map } from 'rxjs';
import { BaseFormComponent } from '../../../shared/formulario/baseForms';
import { MaterialModule } from '../../../material.module';
import { CriancaService } from '../crianca.service';
import { AutoCompleteComponent } from '../../../shared/auto-complete/auto-complete.component';
import { CalendarioComponent, DataOutPut } from '../../../shared/calendario/calendario.component';
import { MensagemErroComponent } from '../../../shared/funcoes-comuns/validators/mensagem-erro/mensagem-erro.component';
import { MatriculaService } from '../../matricula/matricula.service';
import { TurmaService } from '../../turma/turma.service';
import * as utils from '../../../shared/funcoes-comuns/utils';
import * as validar from '../../../shared/funcoes-comuns/validators/validator';
import * as criancasTypes from '../crianca.types';
import * as turmaTypes from '../../turma/turma.types';

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
    CalendarioComponent,
    MensagemErroComponent
  ],
  providers: [provideNgxMask()],

  templateUrl: './crianca-formulario.component.html',
  styleUrl: './crianca-formulario.component.scss',
})
export class CriancaFormularioComponent extends BaseFormComponent implements OnInit {
  @ViewChild(AutoCompleteComponent) childAutoCompleteComponent!: AutoCompleteComponent;
  @ViewChild(CalendarioComponent) childCalendarioComponent!: CalendarioComponent;

  override formulario!: FormGroup;

  turmas: any[] = [];
  turmaSelecionado: any | null = null;
  maxData: Date = new Date();
  turmaSugeridaDescricao: string = '';

  constructor(
    //private fb: FormBuilder,
    private criancaService: CriancaService,
    private turmaService: TurmaService,
    private matriculaService: MatriculaService,
    private viewportScroller: ViewportScroller,
    private cdr: ChangeDetectorRef,
    public override router: Router,
    public override activatedRoute: ActivatedRoute,
  ) {
    super(router, activatedRoute);
  }

  override ngOnInit(): void {
    this.maxData = utils.obterDataHoraBrasileira();
    this.carregaFormGroup();
    this.preencheFormulario();
    this.handleConditionalFields();
  }

  override carregaFormGroup() {
    this.formulario = new FormGroup({
      codigo: new FormControl({ value: 0, disabled: this.operacao.disabled }),
      codigoCadastro: new FormControl({ value: '', disabled: this.operacao.disabled }),
      nomeCrianca: new FormControl({ value: '', disabled: this.operacao.disabled }, Validators.required),
      dataNascimento: new FormControl({ value: null, disabled: this.operacao.disabled }, [Validators.required, validar.dataValidaValidator(), validar.dataNaoFuturaValidator()]),
      idadeCrianca: new FormControl({ value: '', disabled: this.operacao.disabled }),
      turmaMatricula: new FormControl({ value: null, disabled: this.operacao.disabled }),
      nomeMae: new FormControl({ value: '', disabled: this.operacao.disabled }),
      nomePai: new FormControl({ value: '', disabled: this.operacao.disabled }),
      outroResponsavel: new FormControl({ value: '', disabled: this.operacao.disabled }),
      telefone: new FormControl({ value: '', disabled: this.operacao.disabled }, validar.telefoneValidator()),
      enderecoEmail: new FormControl({ value: '', disabled: this.operacao.disabled }, validar.emailValidator()),
      alergia: new FormControl(false),
      descricaoAlergia: new FormControl({ value: '', disabled: this.operacao.disabled }),
      restricaoAlimentar: new FormControl(false),
      descricaoRestricaoAlimentar: new FormControl({ value: '', disabled: this.operacao.disabled }),
      deficienciaOuSituacaoAtipica: new FormControl(false),
      descricaoDeficiencia: new FormControl({ value: '', disabled: this.operacao.disabled }),
      batizado: new FormControl(false),
      dataBatizado: new FormControl({ value: null, disabled: this.operacao.disabled }),
      igrejaBatizado: new FormControl({ value: '', disabled: this.operacao.disabled }),
      ativo: new FormControl(true),
      codigoUsuarioLogado: new FormControl({ value: null, disabled: this.operacao.disabled }),
      dataAtualizacao: new FormControl({ value: null, disabled: this.operacao.disabled }),
      dataCadastro: new FormControl({ value: null, disabled: this.operacao.disabled }),
    });
  }

  private handleConditionalFields(): void {
    // this.formulario.get('dataNascimento')?.valueChanges.subscribe((value) => {
    // const dataNascimento = this.formulario.get('dataNascimento');
    // const idadeCrianca = this.formulario.get('idadeCrianca');

    // // if (this.formulario.get('dataNascimento')?.errors) {
    // //   try {
    // //     //const erros = this.formulario.get('DataNascimento')?.errors;
    // //     var erros = dataNascimento?.errors;
    // //     var valorTextoCampoDigitado =
    // //       erros != null || erros != undefined
    // //         ? erros['matDatepickerParse'].text
    // //         : null;
    // //     if (valorTextoCampoDigitado) {
    // //       idadeCrianca?.setValue('');
    // //       if (utils.validarData(valorTextoCampoDigitado)) {
    // //         var data = utils.retornaDataByString(valorTextoCampoDigitado);
    // //         const idadeFormatada = utils.preencheIdadeFormatada(data.toISOString());
    // //         idadeCrianca?.setValue(idadeFormatada, { emitEvent: true, });

    // //         this.formulario.get('turmaMatricula')?.setValue([{ id: 2, descricao: 'Lilas 2' }], { emitEvent: false, });

    // //         this.formulario.get('dataNascimento')?.setValue(data);
    // //         //dataNascimento?.setValue(data, { emitEvent: false });
    // //       }
    // //     }
    // //   } catch (error) {
    // //     idadeCrianca?.setValue('');
    // //   }
    // // }
    // if (value) {
    //   const idadeFormatada = utils.retornaIdadeFormatadaAnoMesDia(value);
    //   idadeCrianca?.setValue(idadeFormatada, { emitEvent: false });

    //   const turmaSugerida = this.retornaTurmaSugerida(value, this.turmas);
    //   this.turmaSelecionado = this.turmas.find(u => Number(u.codigo) === Number(turmaSugerida.codigo)) || null;
    //   this.turmaSugeridaDescricao = `${this.turmaSelecionado.descricaoAnoSemestreLetivo} - ${utils.formatarDataBrasileira(turmaSugerida.idadeInicialAluno)} até ${utils.formatarDataBrasileira(turmaSugerida.idadeFinalAluno)}`
    // }
    // else {
    //   idadeCrianca?.setValue('', { emitEvent: false });
    // }
    // });

    this.formulario.get('telefone')?.valueChanges.subscribe((value) => {
      const telefone = this.formulario.get('telefone');
      if (value) {
        telefone?.setValidators([validar.telefoneValidator()]);
      } else {
        telefone?.clearValidators();
      }
      telefone?.updateValueAndValidity({ emitEvent: false });
    });

    this.formulario.get('enderecoEmail')?.valueChanges.subscribe((value) => {
      const enderecoEmail = this.formulario.get('enderecoEmail');
      if (value) {
        enderecoEmail?.setValidators([validar.emailValidator()]);
      } else {
        enderecoEmail?.clearValidators();
      }
      enderecoEmail?.updateValueAndValidity({ emitEvent: false });
    });

    this.formulario.get('alergia')?.valueChanges.subscribe((value) => {
      const descricaoAlergia = this.formulario.get('descricaoAlergia');
      if (value) {
        descricaoAlergia?.setValidators([Validators.required]);
        descricaoAlergia?.enable();
      } else {
        descricaoAlergia?.clearValidators();
        descricaoAlergia?.disable();
      }
      descricaoAlergia?.updateValueAndValidity({ emitEvent: false });
    });

    this.formulario.get('restricaoAlimentar')?.valueChanges.subscribe((value) => {
      const descricaoRestricao = this.formulario.get('descricaoRestricaoAlimentar');
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

    this.formulario.get('deficienciaOuSituacaoAtipica')?.valueChanges.subscribe((value) => {
      const descricaoDeficiencia = this.formulario.get('descricaoDeficiencia');
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

    this.formulario.get('batizado')?.valueChanges.subscribe((value) => {
      const dataBatizado = this.formulario.get('dataBatizado');
      const igrejaBatizado = this.formulario.get('igrejaBatizado');
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

  override preencheFormulario(): void {

    if (this.operacao.isNovo) {
      //this.carregarDadosTurma('2024', '2');
      //this.turmaSelecionado = this.turmas.find(u => u.id === 4) || null;
      // //this.formulario.get("DataNascimento")?.setValue('10/09/2025');


      this.getTurmasByMatriculasAtiva();
    }

    if (this.operacao.isEditar) {

    }

    if (this.operacao.isDetalhar) {

    }

  }

  override salvar(): void {
    if (!this.verificaFormulario()) {
      return;
    }

    const valoresForm = this.formulario.getRawValue();
    // valoresForm.codigo = 0;
    // valoresForm.codigoCadastro = '';
    // valoresForm.codigoUsuarioLogado = 0;
    // valoresForm.dataAtualizacao = utils.obterDataHoraBrasileira();
    // valoresForm.dataCadastro = utils.obterDataHoraBrasileira();
    // valoresForm.dataBatizado = null;

    var filtro: criancasTypes.CriancaModel = valoresForm;

    //   "codigo": 0,
    // "codigoCadastro": "string",
    // "nomeCrianca": "string",
    // "dataNascimento": "2025-04-06T05:33:15.378Z",
    // "nomeMae": "string",
    // "nomePai": "string",
    // "outroResponsavel": "string",
    // "telefone": "string",
    // "enderecoEmail": "string",
    // "alergia": true,
    // "descricaoAlergia": "string",
    // "restricaoAlimentar": true,
    // "descricaoRestricaoAlimentar": "string",
    // "deficienciaOuSituacaoAtipica": true,
    // "descricaoDeficiencia": "string",
    // "batizado": true,
    // "dataBatizado": "2025-04-06T05:33:15.378Z",
    // "igrejaBatizado": "string",
    // "ativo": true,
    // "codigoUsuarioLogado": 0,
    // "dataAtualizacao": "2025-04-06T05:33:15.378Z",
    // "dataCadastro": "2025-04-06T05:33:15.378Z"

    if (this.operacao.isNovo) {
      this.criancaService.Incluir(filtro, (res: any) => {
        if (res) {
          var url = `crianca/detalhar/${res.dados}`;
          this.finalizarAcao(url);
        }
      });
    }

    if (this.operacao.isEditar) {
      this.criancaService.Alterar(filtro, (res: any) => {
        if (res) {
          this.finalizarAcao();
        }
      });
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
        (t) => t.ano === anoSelecionado
      ) || [];
  }

  public onTurmaSelecionado(turmaSelecionada: any): void {
    //console.log('Turma selecionado do autocomplete:', turmaSelecionada);
    if (turmaSelecionada) {
      this.formulario.patchValue({
        TurmaMatricula: turmaSelecionada
      });
    }
  }

  public onDataNascimentoSelecionada(dataNascimentoSelecionada: DataOutPut): void {
    //console.log('dataNascimentoSelecionada selecionado do autocomplete:', dataNascimentoSelecionada);
    const dataNascimento = this.formulario.get('dataNascimento');
    const idadeCrianca = this.formulario.get('idadeCrianca');
    const turmaMatricula = this.formulario.get('turmaMatricula');

    if (dataNascimentoSelecionada) {
      dataNascimento?.setValue(dataNascimentoSelecionada.data, { emitEvent: false });

      const idadeFormatada = utils.retornaIdadeFormatadaAnoMesDia(dataNascimentoSelecionada.data);
      idadeCrianca?.setValue(idadeFormatada, { emitEvent: false });

      const turmaSugerida = this.retornaTurmaSugerida(dataNascimentoSelecionada.data, this.turmas);

      if (turmaSugerida != null) {
        this.turmaSugeridaDescricao =
          `${turmaSugerida.descricaoAnoSemestreLetivo} -
          ${utils.formatarDataBrasileira(turmaSugerida.idadeInicialAluno)} até
          ${utils.formatarDataBrasileira(turmaSugerida.idadeFinalAluno)}`;

        this.turmaSelecionado = this.turmas.find(u => Number(u.codigo) === Number(turmaSugerida.codigo)) || null;
        turmaMatricula?.setValue(this.turmaSelecionado, { emitEvent: false });
        this.childAutoCompleteComponent.limpar();
        this.childAutoCompleteComponent.ngAfterViewInit();
        this.cdr.detectChanges();
      }
      else {
        this.turmaSelecionado = null;//inicia null - resetando o valor
        turmaMatricula?.setValue(null, { emitEvent: false });//inicia null - resetando o valor
        this.childAutoCompleteComponent.limpar();
        this.cdr.detectChanges();
        this.turmaSugeridaDescricao = 'Nenhuma Turma encontrada!';
      }
    }
    else {
      idadeCrianca?.setValue('', { emitEvent: false });
    }
  }

  private getTurmasByMatriculasAtiva() {
    this.turmaService.ListarTurmasAtivas().subscribe(resp => {
      if (resp && resp?.dados) {
        this.turmas = resp?.dados;
      }
    });
  }

  public retornaTurmaSugerida(dataNascimento: Date, listaTurmas: any[]): any | null {
    if (!listaTurmas || listaTurmas.length === 0) return null;


    for (const item of listaTurmas) {
      const inicioIntervalo = item.idadeInicialAluno ? new Date(item.idadeInicialAluno) : new Date();
      const fimIntervalo = item.idadeFinalAluno ? new Date(item.idadeFinalAluno) : new Date();
      const dataNascimentoAluno = dataNascimento;

      // Remove horas para comparar só a data
      inicioIntervalo.setHours(0, 0, 0, 0);
      fimIntervalo.setHours(0, 0, 0, 0);
      dataNascimentoAluno.setHours(0, 0, 0, 0);

      const estaDentroDoIntervalo =
        dataNascimentoAluno >= inicioIntervalo && dataNascimentoAluno <= fimIntervalo;

      if (estaDentroDoIntervalo) {
        return item;
      }
    }
    return null;
  }
}
