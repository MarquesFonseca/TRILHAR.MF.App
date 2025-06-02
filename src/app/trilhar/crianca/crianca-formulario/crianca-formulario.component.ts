import { CommonModule,  ViewportScroller } from '@angular/common';
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
import { FrequenciaService } from '../../frequencia/frequencia.service';
import { FrequenciaInput } from '../../frequencia/frequencia.types';
import { BootWhatsService, MensagemWhatsApp } from '../../../services/bootwhats.service';
import QRCode from 'qrcode';
//import { ToggleStatusComponent } from '../../../shared/toggle-status/toggle-status.component';

@Component({
  selector: 'app-criancas-formulario',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MaterialModule,
    NgxMaskDirective,
    AutoCompleteComponent,
    CalendarioComponent,
    MensagemErroComponent,
    //ToggleStatusComponent,
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
  nomeCriancaOriginal = '';
  criancaAtual: any = null;

  constructor(
    private fb: FormBuilder,
    private criancaService: CriancaService,
    private turmaService: TurmaService,
    private matriculaService: MatriculaService,
    private frequenciaService: FrequenciaService,
    private viewportScroller: ViewportScroller,
    private cdr: ChangeDetectorRef,
    private mensagemService: MensagemService,
    private bootWhatsService: BootWhatsService,
    public override router: Router,
    public override activatedRoute: ActivatedRoute,
  ) {
    super(router, activatedRoute);
    if(!this.isProducao) console.clear();
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
    if (this.operacao.isNovo || this.operacao.isEditar) {
      //this.handleDataNascimentoField();
      this.handleTelefoneField();
      this.handleEnderecoEmailField();
      this.handleAlergiaField();
      this.handleRestricaoAlimentarField();
      this.handleDeficienciaOuSituacaoAtipicaField();
      this.handleBatizadoField();
    }
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

  private handleDataNascimentoField(){
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
  }

  private handleTelefoneField() {
    this.formulario.get('telefone')?.valueChanges.subscribe((value) => {
      const telefone = this.formulario.get('telefone');
      if (value) {
        telefone?.setValidators([validar.telefoneValidator()]);
      } else {
        telefone?.clearValidators();
      }
      telefone?.updateValueAndValidity({ emitEvent: false });
    });
  }

  private handleEnderecoEmailField() {
    this.formulario.get('enderecoEmail')?.valueChanges.subscribe((value) => {
      const enderecoEmail = this.formulario.get('enderecoEmail');
      if (value) {
        enderecoEmail?.setValidators([validar.emailValidator()]);
      } else {
        enderecoEmail?.clearValidators();
      }
      enderecoEmail?.updateValueAndValidity({ emitEvent: false });
    });
  }

  private handleAlergiaField() {
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
  }

  private handleRestricaoAlimentarField() {
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
  }

  private handleDeficienciaOuSituacaoAtipicaField() {
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
  }

  private handleBatizadoField() {
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

      if (this.isNovoIrmao) {
        this.criancaService.listarPorCodigoCadastro(this.id).subscribe(resp => {
          if (resp.dados == null) {
            this.mensagemService.showError('Nenhum registro encontrado!', 'error');
            return;
          }
          if (!!resp.dados) {
            this.formulario.get('codigo')?.setValue(0);
            this.formulario.get('codigoCadastro')?.setValue('');
            this.formulario.get('nomeCrianca')?.setValue(' ');
            this.formulario.get('dataNascimento')?.setValue(null);
            this.formulario.get('nomeMae')?.setValue(resp.dados.nomeMae || ' ');
            this.formulario.get('nomePai')?.setValue(resp.dados.nomePai || ' ');
            this.formulario.get('outroResponsavel')?.setValue(resp.dados.outroResponsavel || ' ');
            this.formulario.get('telefone')?.setValue(utils.retirarFormatacao(resp.dados.telefone));
            this.formulario.get('telefone')?.markAsTouched();
            this.formulario.get('telefone')?.markAsDirty();
            this.formulario.get('enderecoEmail')?.setValue(resp.dados.enderecoEmail || ' ');
            this.formulario.get('alergia')?.setValue(false);
            this.formulario.get('descricaoAlergia')?.setValue(' ');
            this.formulario.get('restricaoAlimentar')?.setValue(false);
            this.formulario.get('descricaoRestricaoAlimentar')?.setValue(' ');
            this.formulario.get('deficienciaOuSituacaoAtipica')?.setValue(false);
            this.formulario.get('descricaoDeficiencia')?.setValue(' ');
            this.formulario.get('batizado')?.setValue(false);
            this.formulario.get('dataBatizado')?.setValue(null);
            this.formulario.get('igrejaBatizado')?.setValue(' ');
            this.formulario.get('ativo')?.setValue(true);
          }
        });
      }
    }

    if (this.operacao.isEditar || this.operacao.isDetalhar) {
      this.criancaService.listarPorCodigoCadastro(this.id).subscribe(crianca => {
        if (crianca.dados == null) {
          //this.mensagemService.showError('Nenhum registro encontrado!', 'error');
          return;
        }
        if (!!crianca.dados) {
          this.criancaAtual = crianca.dados;
          this.nomeCriancaOriginal = crianca.dados.nomeCrianca || '';
          this.formulario.get('codigo')?.setValue(crianca.dados.codigo);
          this.formulario.get('codigoCadastro')?.setValue(crianca.dados.codigoCadastro || ' ');
          this.formulario.get('nomeCrianca')?.setValue(crianca.dados.nomeCrianca || ' ');
          this.formulario.get('dataNascimento')?.setValue(crianca.dados.dataNascimento);

          // const dataNascimentoRetornada = utils.converterParaDataOutput(crianca.dados.dataNascimento);
          // this.onDataNascimentoSelecionada(dataNascimentoRetornada);

          this.formulario.get('nomeMae')?.setValue(crianca.dados.nomeMae || ' ');
          this.formulario.get('nomePai')?.setValue(crianca.dados.nomePai || ' ');
          this.formulario.get('outroResponsavel')?.setValue(crianca.dados.outroResponsavel || ' ');
          this.formulario.get('telefone')?.setValue(utils.retirarFormatacao(crianca.dados.telefone));
          this.formulario.get('enderecoEmail')?.setValue(crianca.dados.enderecoEmail || ' ');
          this.formulario.get('alergia')?.setValue(crianca.dados.alergia);
          if (this.operacao.disabled) { this.formulario.controls["alergia"].disable(); }
          this.formulario.get('descricaoAlergia')?.setValue(crianca.dados.descricaoAlergia || ' ');
          this.formulario.get('restricaoAlimentar')?.setValue(crianca.dados.restricaoAlimentar);
          if (this.operacao.disabled) { this.formulario.controls["restricaoAlimentar"].disable(); }
          this.formulario.get('descricaoRestricaoAlimentar')?.setValue(crianca.dados.descricaoRestricaoAlimentar || ' ');
          this.formulario.get('deficienciaOuSituacaoAtipica')?.setValue(crianca.dados.deficienciaOuSituacaoAtipica);
          if (this.operacao.disabled) { this.formulario.controls["deficienciaOuSituacaoAtipica"].disable(); }
          this.formulario.get('descricaoDeficiencia')?.setValue(crianca.dados.descricaoDeficiencia || ' ');
          this.formulario.get('batizado')?.setValue(crianca.dados.batizado);
          if (this.operacao.disabled) { this.formulario.controls["batizado"].disable(); }
          this.formulario.get('dataBatizado')?.setValue(crianca.dados.dataBatizado);
          this.formulario.get('igrejaBatizado')?.setValue(crianca.dados.igrejaBatizado || ' ');
          this.formulario.get('ativo')?.setValue(crianca.dados.ativo);
          if (this.operacao.disabled) { this.formulario.controls["ativo"].disable(); }
          this.formulario.get('codigoUsuarioLogado')?.setValue(crianca.dados.codigoUsuarioLogado);
          this.formulario.get('dataAtualizacao')?.setValue(crianca.dados.dataAtualizacao);
          this.formulario.get('dataCadastro')?.setValue(crianca.dados.dataCadastro);
          //----------------------------------------
          this.preencheMatricula(crianca);
        }
      });
    }

  }

  private preencheMatricula(crianca: any) {
    this.matriculaService.listarPorCodigoAluno(String(crianca.dados.codigo)).subscribe((mat: any) => {
      // Primeiro, configura a data de nascimento e idade
      if (crianca.dados.dataNascimento) {
        this.formulario.patchValue({
          dataNascimento: new Date(crianca.dados.dataNascimento),
          idadeCrianca: utils.retornaIdadeFormatadaAnoMesDia(new Date(crianca.dados.dataNascimento))
        }, { emitEvent: false });

        const turmaSugerida = this.retornaTurmaSugerida(new Date(crianca.dados.dataNascimento), this.turmas);
        this.turmaSelecionado = this.turmas.find(u => Number(u.codigo) === Number(turmaSugerida.codigo)) || null;
        this.turmaSugeridaDescricao = `${this.turmaSelecionado.descricaoAnoSemestreLetivo} - ${utils.formatarDataBrasileira(turmaSugerida.idadeInicialAluno)} até ${utils.formatarDataBrasileira(turmaSugerida.idadeFinalAluno)}`
      }

      // Depois, processa a matrícula e turma
      if (mat.dados != null) {
        const matriculaAluno = mat.dados.find((m: any) => m.ativo === true);
        if (matriculaAluno) {
          const turmaMatricula = this.turmas.find((t: any) => t.codigo === matriculaAluno.codigoTurma);
          if (turmaMatricula) {
            this.configurarTurmaSugerida(turmaMatricula);
          }
        } else {
          this.resetarSelecaoTurma();
        }
      } else {
        this.resetarSelecaoTurma();
      }
    });
  }

  async salvar(): Promise<void> {
    if (!this.verificaFormulario()) {
      return;
    }

    const valoresForm = this.formulario.getRawValue();
    var input: criancasTypes.IAlunoEntity = valoresForm;
    input.codigoCadastro = input.codigoCadastro?.toString()?.trim() ?? '';
    input.nomeCrianca = input.nomeCrianca?.toString()?.trim() ?? '';
    input.nomeMae = input.nomeMae?.toString()?.trim() ?? '';
    input.nomePai = input.nomePai?.toString()?.trim() ?? '';
    input.outroResponsavel = input.outroResponsavel?.toString()?.trim() ?? '';
    input.enderecoEmail = input.enderecoEmail?.toString()?.trim() ?? '';
    input.descricaoAlergia = input.descricaoAlergia?.toString()?.trim() ?? '';
    input.descricaoRestricaoAlimentar = input.descricaoRestricaoAlimentar?.toString()?.trim() ?? '';
    input.descricaoDeficiencia = input.descricaoDeficiencia?.toString()?.trim() ?? '';
    input.igrejaBatizado = input.igrejaBatizado?.toString()?.trim() ?? '';
    input.telefone = utils.retirarFormatacao(valoresForm.telefone);
    input.dataCadastro = utils.obterDataHoraBrasileira();
    input.dataAtualizacao = input.dataCadastro;
    input.codigoUsuarioLogado = 0;

    try {
      if (this.operacao.isNovo) {
        const res = await this.criancaService.IncluirPromise(input);

          if (!!res.dados) {
            const aluno = res.dados;
            const turmaSelecionada = valoresForm.turmaMatricula;

            if (!!turmaSelecionada) { //se a turma for selecionada
              await this.adicionarMatriculaRegistro(aluno, turmaSelecionada);
              await this.adicionarFrequenciaRegistro(aluno, turmaSelecionada);
            }

            await this.enviarWhatsApp('INCLUSAO', aluno, turmaSelecionada);

            var url = `criancas/detalhar/${aluno.codigoCadastro}`;
            this.finalizarAcao(url);
          }
      }
    } catch (error) {
      this.mensagemService.showError('Erro ao inserir novo registro', error);
    }

    try {
      if (this.operacao.isEditar) {
        const res = await this.criancaService.AlterarPromise(valoresForm.codigo, input);

        if (!!res) {
          const codigoAluno = input.codigo;
          const matriculaAtual = this.criancaAtual.matricula;
          const turmaSelecionada = valoresForm.turmaMatricula;

          // Decidir o que fazer com a matrícula baseado nas situações
          await this.gerenciarMatricula(codigoAluno, matriculaAtual, turmaSelecionada);

          await this.enviarWhatsApp('ALTERACAO', input, turmaSelecionada);

          const url = `criancas/detalhar/${input.codigoCadastro}`;
          this.finalizarAcao(url);
        }
      }
    } catch (error) {
      this.mensagemService.showError('Erro ao alterar registro', error);
    }
  }

  private async enviarWhatsApp(tipo:string | 'INCLUSAO' | 'ALTERACAO', input: criancasTypes.IAlunoEntity, turmaSelecionada: any): Promise<void> {
    if (input.telefone && input.telefone.length > 0) {

      var texto = '';
      texto += `Olá! Aqui é do *Ministério Trilhar da SIBAPA* 💚\r\n\r\n`;
      if (tipo === 'INCLUSAO') {
        texto += `Estamos muito felizes por receber sua família em nossa jornada de fé e cuidado com as crianças!\r\n\r\n`;
        texto += `✨ Seu código de cadastro é: *${input.codigoCadastro}*\r\n\r\n`;
      }
      texto += `*Por favor, confira as informações abaixo:* 👇\r\n\r\n`;
      if (tipo === 'ALTERACAO') {
        texto += `🧾 Código do Cadastro: *${input.codigoCadastro}*\r\n\r\n`;
      }
      if (!!turmaSelecionada) {
        texto += `🏫 Sala: *${turmaSelecionada.descricaoAnoSemestreLetivo}*\r\n\r\n`;
      }
      texto += `👧 Nome da Criança: *${input.nomeCrianca}*\r\n\r\n`;
      var dataNascimento = input.dataNascimento ? new Date(input.dataNascimento) : null;
      texto += `🎂 Data de Nascimento: *${dataNascimento?.dataString()}*\r\n\r\n`;
      if (input.nomeMae) {
        texto += `👩‍👧 Nome da Mãe: *${input.nomeMae}*\r\n\r\n`;
      }
      if (input.nomePai) {
        texto += `👨‍👧 Nome do Pai: *${input.nomePai}*\r\n\r\n`;
      }
      if (input.outroResponsavel) {
        texto += `👥 Outro Responsável: *${input.outroResponsavel}*\r\n\r\n`;
      }
      if (input.enderecoEmail) {
        texto += `📧 E-mail para contato: *${input.enderecoEmail?.toString().toLocaleLowerCase()}*\r\n\r\n`;
      }
      texto += `⚠️ Alergia: *${input.alergia ? 'Sim' : 'Não'}*\r\n`;
      if (Boolean(input.alergia)) {
        texto += `📋 Qual?: *${input.descricaoAlergia}*\r\n`;
      }
      texto += `\r\n🥗 Restrição Alimentar: *${input.restricaoAlimentar ? 'Sim' : 'Não'}*\r\n`;
      if (Boolean(input.restricaoAlimentar)) {
        texto += `📋 Qual?: *${input.descricaoRestricaoAlimentar}*\r\n\r\n`;
      }
      texto += `\r\n♿ Situação Atípica: *${input.deficienciaOuSituacaoAtipica ? 'Sim' : 'Não'}*\r\n`;
      if (Boolean(input.deficienciaOuSituacaoAtipica)) {
        texto += `📋 Qual?: *${input.descricaoDeficiencia}*\r\n`;
      }

      texto += `\r\nSe houver algo para ajustar ou se quiser conversar com a gente, é só responder esta mensagem. 💬\r\n\r\n`;
      texto += `Conte conosco! Estamos animados por trilhar esse caminho junto com sua família. 🙌`;

      //await this.bootWhatsService.enviarMensagensPromise('5563992082269', texto);

      const telefoneFormatado = `55${input.telefone}`;

      // var fileBase64QRCode = await this.gerarQRCodeBase64(input.codigoCadastro);
      // fileBase64QRCode = fileBase64QRCode.replace(/^data:image\/png;base64,/, '');

      const fileBase64QRCode = await this.bootWhatsService.geraImagemMinisterioTrilhar()  ;

      const mensagens: MensagemWhatsApp[] = [
        {
          numeroTelefone: telefoneFormatado,
          textoMenagem: texto,
          fileBase64: fileBase64QRCode
        },
      ];

      await this.bootWhatsService.enviarMensagensPromise(mensagens);
    }
  }

  async gerarQRCodeBase64(codigoCadastro: string): Promise<string> {
    try {
      const texto = `${codigoCadastro}`;
      const base64 = await QRCode.toDataURL(texto); // retorna um data:image/png;base64,...
      return base64;
    } catch (err) {
      console.error('Erro ao gerar QR Code:', err);
      throw err;
    }
  }

  private async gerenciarMatricula(codigoAluno: number, matriculaAtual: any, turmaSelecionada: any): Promise<void> {
    // SITUAÇÃO 1: Aluno não possui matrícula (matriculaAtual é null) e continua sem turma
    if (!matriculaAtual && !turmaSelecionada) {
      console.log('Situação 1: Aluno continua sem matrícula');
      // Não fazer nada - aluno não tinha matrícula e continua sem
      return;
    }

    // SITUAÇÃO 2: Aluno não possui matrícula (matriculaAtual é null) e agora selecionou turma
    if (!matriculaAtual && turmaSelecionada) {
      console.log('Situação 2: Novo aluno sendo matriculado pela primeira vez');
      await this.alterarMatriculaRegistro(0, codigoAluno, turmaSelecionada.codigo);
      return;
    }

    // A partir daqui, sabemos que matriculaAtual existe

    // SITUAÇÃO 3: Aluno possuía matrícula e agora selecionou uma turma diferente
    if (matriculaAtual && turmaSelecionada && matriculaAtual.codigoTurma !== turmaSelecionada.codigo) {
      console.log('Situação 3: Aluno mudando de turma');
      await this.alterarMatriculaRegistro(turmaSelecionada.codigo, codigoAluno, turmaSelecionada.codigo);
      return;
    }

    // SITUAÇÃO 4: Aluno possuía matrícula, mas agora não tem turma selecionada (remover matrícula)
    if (matriculaAtual && !turmaSelecionada) {
      console.log('Situação 4: Removendo matrícula do aluno');
      await this.alterarMatriculaRegistro(matriculaAtual.codigo, codigoAluno, 0);
      return;
    }

    // SITUAÇÃO 5: Aluno mantém a mesma turma
    if (matriculaAtual && turmaSelecionada && matriculaAtual.codigoTurma === turmaSelecionada.codigo) {
      console.log('Situação 5: Aluno mantém a mesma turma, nenhuma alteração necessária');
      // Não fazer nada - aluno continua na mesma turma
      return;
    }
  }

  private async adicionarMatriculaRegistro(aluno: any, turmaMatricula: any): Promise<any> {
    var inputMatricula = {
      "codigo": 0,
      "codigoAluno": aluno.codigo,
      "codigoTurma": turmaMatricula.codigo,
      "ativo": true,
      "codigoUsuarioLogado": 0,
      "dataAtualizacao": utils.obterDataHoraBrasileira(),
      "dataCadastro": utils.obterDataHoraBrasileira()
    };
    return await this.matriculaService.IncluirPromise(inputMatricula);
  }

  private async alterarMatriculaRegistro(codigoMatricula: any, codigoAluno: any, codigoTurma: any) {
    var filtroMatricula = {
      "codigo": codigoMatricula,
      "codigoAluno": codigoAluno,
      "codigoTurma": codigoTurma,
      "ativo": true,
      "codigoUsuarioLogado": 0,
      "dataAtualizacao": utils.obterDataHoraBrasileira(),
      "dataCadastro": utils.obterDataHoraBrasileira()
    }

    return await this.matriculaService.AlterarPromise(codigoMatricula, filtroMatricula);
  }

  private async adicionarFrequenciaRegistro(aluno: any, turmaMatricula: any) {
    var inputFrequencia: FrequenciaInput = {
      "codigo": 0,
      "dataFrequencia": utils.obterDataHoraBrasileira(),
      "codigoAluno": aluno.codigo,
      "codigoTurma": turmaMatricula.codigo,
      "presenca": true,
      "turmaDescricao": turmaMatricula.descricao,
      "turmaIdadeInicialAluno": turmaMatricula.idadeInicialAluno,
      "turmaIdadeFinalAluno": turmaMatricula.idadeFinalAluno,
      "turmaAnoLetivo": turmaMatricula.anoLetivo,
      "turmaSemestreLetivo": turmaMatricula.semestreLetivo,
      "codigoUsuarioLogado": turmaMatricula.codigoUsuarioLogado,
      "dataAtualizacao": utils.obterDataHoraBrasileira(),
      "dataCadastro": utils.obterDataHoraBrasileira()
    }
    return await this.frequenciaService.IncluirPromise(inputFrequencia);
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
    if (!dataNascimentoSelecionada) {
      this.formulario.get('idadeCrianca')?.setValue('', { emitEvent: false });
      return;
    }

    const dataNascimento = this.formulario.get('dataNascimento');
    const idadeCrianca = this.formulario.get('idadeCrianca');
    const turmaMatricula = this.formulario.get('turmaMatricula');

    // Batch updates para melhor performance
    this.formulario.patchValue({
      dataNascimento: dataNascimentoSelecionada.data,
      idadeCrianca: utils.retornaIdadeFormatadaAnoMesDia(dataNascimentoSelecionada.data)
    }, { emitEvent: false });

    this.atualizarTurmaSugerida(dataNascimentoSelecionada.data);
  }

  private atualizarTurmaSugerida(dataNascimento: Date): void {
    const turmaSugerida = this.retornaTurmaSugerida(dataNascimento, this.turmas);
    const turmaMatricula = this.formulario.get('turmaMatricula');

    if (!turmaSugerida) {
      this.resetarSelecaoTurma();
      return;
    }

    this.configurarTurmaSugerida(turmaSugerida);
  }

  private resetarSelecaoTurma(): void {
    this.turmaSelecionado = null;
    this.formulario.get('turmaMatricula')?.setValue(null, { emitEvent: false });
    this.childAutoCompleteComponent?.limpar();
    //this.turmaSugeridaDescricao = 'Nenhuma Turma encontrada!';
    this.cdr.detectChanges();
  }

  private configurarTurmaSugerida(turmaSugerida: any): void {
    this.turmaSugeridaDescricao =
      `${turmaSugerida.descricaoAnoSemestreLetivo} -
       ${utils.formatarDataBrasileira(turmaSugerida.idadeInicialAluno)} até
       ${utils.formatarDataBrasileira(turmaSugerida.idadeFinalAluno)}`;

    this.turmaSelecionado = this.turmas.find(u =>
      Number(u.codigo) === Number(turmaSugerida.codigo)) || null;

    this.formulario.get('turmaMatricula')?.setValue(this.turmaSelecionado, { emitEvent: false });

    if (this.childAutoCompleteComponent) {
      this.childAutoCompleteComponent.limpar();
      this.childAutoCompleteComponent.ngAfterViewInit();
    }

    this.cdr.detectChanges();
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
    const { codigoCadastro, nomeCrianca } = this.formulario.value;
    if (this.operacao.isNovo) return 'Nova criança';
    if (this.operacao.isEditar) return `Alterando: #${codigoCadastro} - ${this.nomeCriancaOriginal}`;
    if (this.operacao.isDetalhar) return `Detalhando: #${codigoCadastro} - ${this.nomeCriancaOriginal}`;
    return '';
  }
}
