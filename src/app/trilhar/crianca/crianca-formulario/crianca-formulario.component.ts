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
  isNovoIrmao: boolean = false;

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

  override ngOnInit() {
    this.viewportScroller.scrollToPosition([0, 0]);
    this.maxData = utils.obterDataHoraBrasileira();
    if (this.operacao.isNovo) {
      this.id = this.activatedRoute.snapshot.params['id'];
      this.isNovoIrmao = (this.operacao.isNovo && !!this.id);
    }
    if (this.operacao.isEditar || this.operacao.isDetalhar) {
      this.id = this.activatedRoute.snapshot.params['id'];
    }
    this.carregaFormGroup();
    // await this.carregarTurmasAtiva();
    this.carregarTurmasAtiva();
    this.preencheFormulario();
    if (this.operacao.isNovo || this.operacao.isEditar) this.handleConditionalFields();
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
    this.formulario.get('dataNascimento')?.valueChanges.subscribe((value) => {
      const dataNascimento = this.formulario.get('dataNascimento');
      const idadeCrianca = this.formulario.get('idadeCrianca');

      if (!utils.isNullOrEmpty(value)) {
        if (utils.validarData(value)) {
          var data = utils.retornaDataByString(value);
          const dataNascimentoRetornada = utils.converterParaDataOutput(String(data));
          this.onDataNascimentoSelecionada(dataNascimentoRetornada);

        }
      }

      // if (this.formulario.get('dataNascimento')?.errors) {
      //   try {
      //     //const erros = this.formulario.get('dataNascimento')?.errors;
      //     var erros = dataNascimento?.errors;
      //     var valorTextoCampoDigitado =
      //       erros != null || erros != undefined
      //         ? erros['matDatepickerParse'].text
      //         : null;
      //     if (valorTextoCampoDigitado) {
      //       idadeCrianca?.setValue('');
      //       if (utils.validarData(valorTextoCampoDigitado)) {
      //         var data = utils.retornaDataByString(valorTextoCampoDigitado);

      //         const dataNascimentoRetornada = utils.converterParaDataOutput(valorTextoCampoDigitado);
      //         this.onDataNascimentoSelecionada(dataNascimentoRetornada);
      //       }
      //     }
      //   } catch (error) {
      //     idadeCrianca?.setValue('');
      //   }
      // }
      if (value) {

        //idadeCrianca?.setValue('');
        if (utils.validarData(value)) {
          var data = utils.retornaDataByString(value);

          const dataNascimentoRetornada = utils.converterParaDataOutput(String(data));
          this.onDataNascimentoSelecionada(dataNascimentoRetornada);
        }



        // const idadeFormatada = utils.retornaIdadeFormatadaAnoMesDia(value);
        // idadeCrianca?.setValue(idadeFormatada, { emitEvent: false });

        // const turmaSugerida = this.retornaTurmaSugerida(value, this.turmas);
        // this.turmaSelecionado = this.turmas.find(u => Number(u.codigo) === Number(turmaSugerida.codigo)) || null;
        // this.turmaSugeridaDescricao = `${this.turmaSelecionado.descricaoAnoSemestreLetivo} - ${utils.formatarDataBrasileira(turmaSugerida.idadeInicialAluno)} até ${utils.formatarDataBrasileira(turmaSugerida.idadeFinalAluno)}`
      }
      // else {
      //   idadeCrianca?.setValue('', { emitEvent: false });
      // }

    });

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

      if(this.isNovoIrmao) {
        this.criancaService.listarPorCodigoCadastro(this.id).subscribe(resp => {
          if(resp.dados == null) {
            this.mensagemService.showError('Nenhum registro encontrado!', 'error');
            return;
          }
          if (!!resp.dados) {
            this.formulario.get('codigo')?.setValue(0);
            this.formulario.get('codigoCadastro')?.setValue('');
            this.formulario.get('nomeCrianca')?.setValue('');
            this.formulario.get('dataNascimento')?.setValue(null);
            this.formulario.get('nomeMae')?.setValue(resp.dados.nomeMae);
            this.formulario.get('nomePai')?.setValue(resp.dados.nomePai);
            this.formulario.get('outroResponsavel')?.setValue(resp.dados.outroResponsavel);
            this.formulario.get('telefone')?.setValue(utils.retirarFormatacao(resp.dados.telefone));
            this.formulario.get('telefone')?.markAsTouched();
            this.formulario.get('telefone')?.markAsDirty();
            this.formulario.get('enderecoEmail')?.setValue(resp.dados.enderecoEmail);
            this.formulario.get('alergia')?.setValue(false);
            this.formulario.get('descricaoAlergia')?.setValue('');
            this.formulario.get('restricaoAlimentar')?.setValue(false);
            this.formulario.get('descricaoRestricaoAlimentar')?.setValue('');
            this.formulario.get('deficienciaOuSituacaoAtipica')?.setValue(false);
            this.formulario.get('descricaoDeficiencia')?.setValue('');
            this.formulario.get('batizado')?.setValue(false);
            this.formulario.get('dataBatizado')?.setValue(null);
            this.formulario.get('igrejaBatizado')?.setValue('');
            this.formulario.get('ativo')?.setValue(true);
          }
        });
      }
    }

    if (this.operacao.isEditar || this.operacao.isDetalhar) {
      this.criancaService.listarPorCodigoCadastro(this.id).subscribe(crianca => {
        if (crianca.dados == null) {
          this.mensagemService.showError('Nenhum registro encontrado!', 'error');
          return;
        }
        if (!!crianca.dados) {
          this.formulario.get('codigo')?.setValue(crianca.dados.codigo);
          this.formulario.get('codigoCadastro')?.setValue(crianca.dados.codigoCadastro);
          this.formulario.get('nomeCrianca')?.setValue(crianca.dados.nomeCrianca);
          this.formulario.get('dataNascimento')?.setValue(crianca.dados.dataNascimento);

          // const dataNascimentoRetornada = utils.converterParaDataOutput(crianca.dados.dataNascimento);
          // this.onDataNascimentoSelecionada(dataNascimentoRetornada);

          this.formulario.get('nomeMae')?.setValue(crianca.dados.nomeMae);
          this.formulario.get('nomePai')?.setValue(crianca.dados.nomePai);
          this.formulario.get('outroResponsavel')?.setValue(crianca.dados.outroResponsavel);
          this.formulario.get('telefone')?.setValue(utils.retirarFormatacao(crianca.dados.telefone));
          this.formulario.get('enderecoEmail')?.setValue(crianca.dados.enderecoEmail);
          this.formulario.get('alergia')?.setValue(crianca.dados.alergia);
          if (this.operacao.disabled) { this.formulario.controls["alergia"].disable(); }
          this.formulario.get('descricaoAlergia')?.setValue(crianca.dados.descricaoAlergia);
          this.formulario.get('restricaoAlimentar')?.setValue(crianca.dados.restricaoAlimentar);
          if (this.operacao.disabled) { this.formulario.controls["restricaoAlimentar"].disable(); }
          this.formulario.get('descricaoRestricaoAlimentar')?.setValue(crianca.dados.descricaoRestricaoAlimentar);
          this.formulario.get('deficienciaOuSituacaoAtipica')?.setValue(crianca.dados.deficienciaOuSituacaoAtipica);
          if (this.operacao.disabled) { this.formulario.controls["deficienciaOuSituacaoAtipica"].disable(); }
          this.formulario.get('descricaoDeficiencia')?.setValue(crianca.dados.descricaoDeficiencia);
          this.formulario.get('batizado')?.setValue(crianca.dados.batizado);
          if (this.operacao.disabled) { this.formulario.controls["batizado"].disable(); }
          this.formulario.get('dataBatizado')?.setValue(crianca.dados.dataBatizado);
          this.formulario.get('igrejaBatizado')?.setValue(crianca.dados.igrejaBatizado);
          this.formulario.get('ativo')?.setValue(crianca.dados.ativo);
          if (this.operacao.disabled) { this.formulario.controls["ativo"].disable(); }
          this.formulario.get('codigoUsuarioLogado')?.setValue(crianca.dados.codigoUsuarioLogado);
          this.formulario.get('dataAtualizacao')?.setValue(crianca.dados.dataAtualizacao);
          this.formulario.get('dataCadastro')?.setValue(crianca.dados.dataCadastro);

          // this.matriculaService.listarPorCodigoAluno(String(crianca.dados.codigo)).subscribe((mat: any) => {
          //   if (mat.dados != null) {
          //     const matriculaAluno = mat.dados.find((m: any) => m.ativo === true);
          //     if (matriculaAluno) {
          //       const turmaMatricula = this.turmas.find((t: any) => t.codigo === matriculaAluno.codigoTurma);
          //       if (turmaMatricula) {
          //         if (this.childAutoCompleteComponent) {
          //           this.childAutoCompleteComponent.limpar();
          //         }
          //         this.turmaSelecionado = turmaMatricula;
          //         this.formulario.get('turmaMatricula')?.setValue(turmaMatricula, { emitEvent: false });
          //         if (this.childAutoCompleteComponent) {
          //           this.childAutoCompleteComponent.ngAfterViewInit();
          //         }
          //         this.cdr.detectChanges();
          //       }
          //     }
          //   }
          //   // else {
          //   //   this.turmaSelecionado = null;//inicia null - resetando o valor
          //   //   this.formulario.get('turmaMatricula')?.setValue(null, { emitEvent: false });//inicia null - resetando o valor
          //   //   if(this.childAutoCompleteComponent) {
          //   //     //this.childAutoCompleteComponent.limpar();
          //   //   }
          //   //   this.cdr.detectChanges();
          //   //   //this.turmaSugeridaDescricao = 'Nenhuma Turma encontrada!';
          //   // }
          // });
        }
      });
    }

  }

  override salvar(): void {
    if (!this.verificaFormulario()) {
      return;
    }

    const valoresForm = this.formulario.getRawValue();
    var filtro: criancasTypes.IAlunoEntity = valoresForm;
    filtro.telefone = utils.retirarFormatacao(valoresForm.telefone);
    filtro.dataCadastro = utils.obterDataHoraBrasileira();
    filtro.dataAtualizacao = utils.obterDataHoraBrasileira();
    filtro.codigoUsuarioLogado = 0;

    if (this.operacao.isNovo) {
      this.criancaService.Incluir(filtro, (res: any) => {
        if (res) {
          const codigoAluno = res.dados;
          const { turmaMatricula } = this.formulario.value;

          this.criancaService.listarPorCodigoCadastro(String(codigoAluno)).subscribe(crianca => {
            if (crianca) {
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
                  var url = `criancas/detalhar/${crianca.dados.codigoCadastro}`;
                  this.finalizarAcao(url);
                }
              });
            }
          });
        }
      });
    }

    if (this.operacao.isEditar) {
      this.criancaService.Alterar(this.id, filtro, async (res: any) => {
        if (res) {
          const codigoAluno = filtro.codigo;
          const { turmaMatricula } = this.formulario.value;

          var criancaAlterada = await this.criancaService.listarPorIdPromise(String(codigoAluno));
          if (criancaAlterada) {
            if (this.turmaSelecionado) {
              var filtroMatricula = {
                "codigo": 0,
                "codigoAluno": codigoAluno,
                "codigoTurma": turmaMatricula.codigo,
                "ativo": true,
                "codigoUsuarioLogado": 0,
                "dataAtualizacao": utils.obterDataHoraBrasileira(),
                "dataCadastro": utils.obterDataHoraBrasileira()
              }

              this.matriculaService.Alterar(filtroMatricula, (mat: any) => {
                // if (mat) {
                // }
              });
            }
            var url = `criancas/detalhar/${criancaAlterada.dados.codigoCadastro}`;
            this.finalizarAcao(url);
          }

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

      if (turmaSugerida == null) {
        this.turmaSelecionado = null;//inicia null - resetando o valor
        turmaMatricula?.setValue(null, { emitEvent: false });//inicia null - resetando o valor
        if(this.childAutoCompleteComponent) {
          this.childAutoCompleteComponent.limpar();
        }
        this.cdr.detectChanges();
        this.turmaSugeridaDescricao = 'Nenhuma Turma encontrada!';
      }
      if (turmaSugerida != null) {
        this.turmaSugeridaDescricao =
          `${turmaSugerida.descricaoAnoSemestreLetivo} -
          ${utils.formatarDataBrasileira(turmaSugerida.idadeInicialAluno)} até
          ${utils.formatarDataBrasileira(turmaSugerida.idadeFinalAluno)}`;

        this.turmaSelecionado = this.turmas.find(u => Number(u.codigo) === Number(turmaSugerida.codigo)) || null;
        turmaMatricula?.setValue(this.turmaSelecionado, { emitEvent: false });
        if(this.childAutoCompleteComponent) {
          this.childAutoCompleteComponent.limpar();
          this.childAutoCompleteComponent.ngAfterViewInit();
        }
        this.cdr.detectChanges();
      }
    }
    else {
      idadeCrianca?.setValue('', { emitEvent: false });
    }
  }

  // async carregarTurmasAtiva() {
  //   try {
  //     const turmas = await this.turmaService.listarTurmasAtivasPromise();
  //     this.turmas = turmas?.dados ?? [];
  //   } catch (err) {
  //     console.error('Erro ao carregar turmas', err);
  //   }
  // }

  carregarTurmasAtiva() {
    this.turmaService.ListarTurmasAtivas().subscribe((res: any) => {
      if (res) {
        this.turmas = res?.dados ?? [];
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

  getTituloCard(): string {
    if (this.operacao.isNovo) return 'Nova criança';
    if (this.operacao.isEditar) return `Cadastro de: ${this.formulario.get('nomeCrianca')?.value}`;
    if (this.operacao.isDetalhar) return `Detalhes de: ${this.formulario.get('nomeCrianca')?.value}`;
    return '';
  }
}
