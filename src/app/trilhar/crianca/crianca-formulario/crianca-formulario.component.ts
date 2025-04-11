import { CommonModule, NgIf, ViewportScroller } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators, } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { Observable, map } from 'rxjs';
import { BaseFormComponent } from '../../../shared/formulario/baseForms';
import { MaterialModule } from '../../../material.module';
import { CriancaService } from '../crianca.service';
import { AutoCompleteComponent } from '../../../shared/auto-complete/auto-complete.component';
import { CalendarioComponent, DataOutPut } from '../../../shared/calendario/calendario.component';
import { MensagemErroComponent } from '../../../shared/funcoes-comuns/validators/mensagem-erro/mensagem-erro.component';
import { MensagemService } from '../../../services/mensagem.service';
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
  id: any;

  constructor(
    private fb: FormBuilder,
    private criancaService: CriancaService,
    private turmaService: TurmaService,
    private matriculaService: MatriculaService,
    private viewportScroller: ViewportScroller,
    private cdr: ChangeDetectorRef,
    private mensagemService: MensagemService,
    public override router: Router,
    public override activatedRoute: ActivatedRoute,
  ) {
    super(router, activatedRoute);
  }

  override async ngOnInit(): Promise<void> {
    this.viewportScroller.scrollToPosition([0, 0]);
    this.maxData = utils.obterDataHoraBrasileira();
    if (this.operacao.isEditar || this.operacao.isDetalhar) {
      this.id = this.activatedRoute.snapshot.params['id'];
    }
    this.carregaFormGroup();
    await this.carregarTurmasAtiva();
    this.preencheFormulario();
    //this.handleConditionalFields();

    if (await this.mensagemService.confirm('Atenção', 'Deseja prosseguir com esta operação?')) {
      this.mensagemService.showSuccess(`apertou: 'Confirmou'`);
      return;
    }
    else {
      this.mensagemService.showInfo(`apertou: 'Cancelou'`);
      return;
    }
    this.mensagemService.showError(`Foi para o retorno final.`);
    return;
  }

  override carregaFormGroup() {
    this.formulario = this.fb.group({
      codigo: [0],
      codigoCadastro: [''],
      nomeCrianca: ['', [Validators.required]],
      dataNascimento: [null, [Validators.required, validar.dataValidaValidator(), validar.dataNaoFuturaValidator()]],
      idadeCrianca: [''],
      turmaMatricula: [null],
      nomeMae: [''],
      nomePai: [''],
      outroResponsavel: [''],
      telefone: ['', validar.telefoneValidator()],
      enderecoEmail: ['', validar.emailValidator()],
      alergia: [false],
      descricaoAlergia: [''],
      restricaoAlimentar: [false],
      descricaoRestricaoAlimentar: [''],
      deficienciaOuSituacaoAtipica: [false],
      descricaoDeficiencia: [''],
      batizado: [false],
      dataBatizado: [null],
      igrejaBatizado: [''],
      ativo: [true],
      codigoUsuarioLogado: [null],
      dataAtualizacao: [null],
      dataCadastro: [null],
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



    }

    if (this.operacao.isEditar || this.operacao.isDetalhar) {
      this.criancaService.listarPorId(this.id).subscribe(resp => {
        this.formulario.get('codigo')?.setValue(resp.dados.codigo);
        this.formulario.get('codigoCadastro')?.setValue(resp.dados.codigoCadastro);
        this.formulario.get('nomeCrianca')?.setValue(resp.dados.nomeCrianca);
        if (this.operacao.disabled) { this.formulario.controls["nomeCrianca"].disable(); }
        this.formulario.get('dataNascimento')?.setValue(resp.dados.dataNascimento);
        if (this.operacao.disabled) { this.formulario.controls["dataNascimento"].disable(); }
        const dataNascimentoRetornada = utils.converterParaDataOutput(resp.dados.dataNascimento);
        this.onDataNascimentoSelecionada(dataNascimentoRetornada);
        if (this.operacao.disabled) { this.formulario.controls["turmaMatricula"].disable(); }
        this.formulario.get('nomeMae')?.setValue(resp.dados.nomeMae);
        if (this.operacao.disabled) { this.formulario.controls["nomeMae"].disable(); }
        this.formulario.get('nomePai')?.setValue(resp.dados.nomePai);
        if (this.operacao.disabled) { this.formulario.controls["nomePai"].disable(); }
        this.formulario.get('outroResponsavel')?.setValue(resp.dados.outroResponsavel);
        if (this.operacao.disabled) { this.formulario.controls["outroResponsavel"].disable(); }
        this.formulario.get('telefone')?.setValue(resp.dados.telefone);
        if (this.operacao.disabled) { this.formulario.controls["telefone"].disable(); }
        this.formulario.get('enderecoEmail')?.setValue(resp.dados.enderecoEmail);
        if (this.operacao.disabled) { this.formulario.controls["enderecoEmail"].disable(); }
        this.formulario.get('alergia')?.setValue(resp.dados.alergia);
        if (this.operacao.disabled) { this.formulario.controls["alergia"].disable(); }
        this.formulario.get('descricaoAlergia')?.setValue(resp.dados.descricaoAlergia);
        if (this.operacao.disabled) { this.formulario.controls["descricaoAlergia"].disable(); }
        this.formulario.get('restricaoAlimentar')?.setValue(resp.dados.restricaoAlimentar);
        if (this.operacao.disabled) { this.formulario.controls["restricaoAlimentar"].disable(); }
        this.formulario.get('descricaoRestricaoAlimentar')?.setValue(resp.dados.descricaoRestricaoAlimentar);
        if (this.operacao.disabled) { this.formulario.controls["descricaoRestricaoAlimentar"].disable(); }
        this.formulario.get('deficienciaOuSituacaoAtipica')?.setValue(resp.dados.deficienciaOuSituacaoAtipica);
        if (this.operacao.disabled) { this.formulario.controls["deficienciaOuSituacaoAtipica"].disable(); }
        this.formulario.get('descricaoDeficiencia')?.setValue(resp.dados.descricaoDeficiencia);
        if (this.operacao.disabled) { this.formulario.controls["descricaoDeficiencia"].disable(); }
        this.formulario.get('batizado')?.setValue(resp.dados.batizado);
        if (this.operacao.disabled) { this.formulario.controls["batizado"].disable(); }
        this.formulario.get('dataBatizado')?.setValue(resp.dados.dataBatizado);
        if (this.operacao.disabled) { this.formulario.controls["dataBatizado"].disable(); }
        this.formulario.get('igrejaBatizado')?.setValue(resp.dados.igrejaBatizado);
        if (this.operacao.disabled) { this.formulario.controls["igrejaBatizado"].disable(); }
        this.formulario.get('ativo')?.setValue(resp.dados.ativo);
        if (this.operacao.disabled) { this.formulario.controls["ativo"].disable(); }
        this.formulario.get('codigoUsuarioLogado')?.setValue(resp.dados.codigoUsuarioLogado);
        if (this.operacao.disabled) { this.formulario.controls["codigoUsuarioLogado"].disable(); }
        this.formulario.get('dataAtualizacao')?.setValue(resp.dados.dataAtualizacao);
        if (this.operacao.disabled) { this.formulario.controls["dataAtualizacao"].disable(); }
        this.formulario.get('dataCadastro')?.setValue(resp.dados.dataCadastro);
        if (this.operacao.disabled) { this.formulario.controls["dataCadastro"].disable(); }
      });
    }

  }

  override salvar(): void {
    if (!this.verificaFormulario()) {
      return;
    }

    const valoresForm = this.formulario.getRawValue();
    var filtro: criancasTypes.CriancaModel = valoresForm;
    filtro.dataCadastro = utils.obterDataHoraBrasileira();
    filtro.dataAtualizacao = utils.obterDataHoraBrasileira();
    filtro.codigoUsuarioLogado = 0;

    if (this.operacao.isNovo) {
      this.criancaService.Incluir(filtro, (res: any) => {
        if (res) {
          const codigoAluno = res.dados;
          const { turmaMatricula } = this.formulario.value;
          var filtroMatricula = {
            "codigo": 0,
            "codigoAluno": codigoAluno,
            "codigoTurma": turmaMatricula.codigo,
            "ativo": true,
            "codigoUsuarioLogado": 0,
            "dataAtualizacao": utils.obterDataHoraBrasileira(),
            "dataCadastro": utils.obterDataHoraBrasileira()
          }
          this.matriculaService.Incluir(filtroMatricula, (res: any) => {
            if (res) {
              var url = `criancas/detalhar/${codigoAluno}`;
              this.finalizarAcao(url);
            }
          });
        }
      });
    }

    if (this.operacao.isEditar) {
      this.criancaService.Alterar(filtro, (res: any) => {
        if (res) {
          const codigoAluno = res.dados;
          const { turmaMatricula } = this.formulario.value;
          var filtroMatricula = {
            "codigo": 0,
            "codigoAluno": codigoAluno,
            "codigoTurma": turmaMatricula.codigo,
            "ativo": true,
            "codigoUsuarioLogado": 0,
            "dataAtualizacao": utils.obterDataHoraBrasileira(),
            "dataCadastro": utils.obterDataHoraBrasileira()
          }
          this.matriculaService.Alterar(filtroMatricula, (res: any) => {
            if (res) {
              var url = `criancas/detalhar/${codigoAluno}`;
              this.finalizarAcao(url);
            }
          });
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

  async carregarTurmasAtiva() {
    try {
      const turmas = await this.turmaService.listarTurmasAtivasPromise();
      this.turmas = turmas?.dados ?? [];
    } catch (err) {
      console.error('Erro ao carregar turmas', err);
    }
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
