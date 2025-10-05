import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { CustomizerSettingsService } from '../../../customizer-settings/customizer-settings.service';
import { MaterialModule } from '../../../material.module';
import { MensagemService } from '../../../services/mensagem.service';
import { AutoCompleteComponent } from '../../../shared/auto-complete/auto-complete.component';
import { BaseListComponent } from '../../../shared/formulario/baseList';
import { formatDataToFormatoAnoMesDia, obterDataHoraBrasileira, parseDataLocalToString, retornaIdadeFormatadaAnoMesDia } from '../../../shared/funcoes-comuns/utils';
import { CriancaService } from '../../crianca/crianca.service';
import * as types from '../../crianca/crianca.types';
import { FrequenciaService } from '../frequencia.service';
import { FrequenciaInput } from '../frequencia.types';

@Component({
  selector: 'app-frequencia-checkin-dia-incluir-data',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MaterialModule,
    // CalendarioComponent,
    AutoCompleteComponent
  ],
  templateUrl: './frequencia-checkin-dia-incluir-data.component.html',
  styleUrl: './frequencia-checkin-dia-incluir-data.component.scss'
})
export class FrequenciaCheckinDiaIncluirDataComponent extends BaseListComponent implements OnInit, OnDestroy {
  // @ViewChild(CalendarioComponent) childCalendarioComponent!: CalendarioComponent;
  @ViewChild(AutoCompleteComponent) childAutoCompleteComponent!: AutoCompleteComponent;

  formularioCheckin!: FormGroup;
  listaAlunosAutoComplete: any[] = [];
  alunoAtual: any;
  maxData: Date = new Date();
  dataSelecionada: Date = new Date();
  descricaoTuramaSelecionda: string = '';
  private subscriptions: Subscription = new Subscription();

  // alternado
  isToggled = false;

  constructor(
    public themeService: CustomizerSettingsService,
    private fb: FormBuilder,
    private criancaService: CriancaService,
    private frequenciaService: FrequenciaService,
    private mensagemService: MensagemService,
    public override router: Router,
    public override activatedRoute: ActivatedRoute,
  ) {
    super(router, activatedRoute);
    this.themeService.isToggled$.subscribe((isToggled) => {
      this.isToggled = isToggled;
      if (!this.isProducao) console.clear();
    });
    this.descricaoTuramaSelecionda = '';
    this.maxData = new Date();
  }

  override ngOnInit() {
    this.carregaFormGroup();

    this.setDataFromParam(this.activatedRoute.snapshot.params['data']);

    setTimeout(async () => {
      this.carregaListaAlunosAutoComplete();
    }, 10);
  }

  override preencheFiltro(): void {
    throw new Error('Method not implemented.');
  }

  carregaFormGroup() {
    this.formularioCheckin = this.fb.group({
      data: [null],
      alunoSelecionado: [null]
    });
  }

  setDataFromParam(dataStr?: string) {
    if (dataStr && dataStr.length === 10) {
      const [dia, mes, ano] = dataStr.split('-').map(Number);
      const data = new Date(ano, mes - 1, dia);
      this.dataSelecionada = data;
    } else {
      this.dataSelecionada = new Date();
    }
    this.formularioCheckin.get('data')?.setValue(this.dataSelecionada);
  }

  private carregaListaAlunosAutoComplete() {
    var filtro: types.IAlunoInput = new types.IAlunoInput();
    filtro.isPaginacao = false;
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

  public onAlunosAutoCompleteSelecionado(alunoSelecionada: any): void {
    if (!!alunoSelecionada) {
      this.formularioCheckin.patchValue({
        alunoSelecionado: alunoSelecionada
      });
    }
    else {//Campo de aluno está vazio!

      // this.formularioCheckin.patchValue({
      //   codigo: 0,
      //   codigoCadastro: '',
      //   alunoSelecionado: null
      // });

      // setTimeout(async () => {
      //   const formValue = this.formularioCheckin.value;
      // }, 10);
    }

    this.carregaAlunoSelecionadoAutoComplete();
  }

  private carregaAlunoSelecionadoAutoComplete() {
    this.alunoAtual = null;

    if (!this.formularioCheckin.get('alunoSelecionado')?.value) {
      return;
    }

    var filtro: types.IAlunoInput = new types.IAlunoInput();
    filtro.isPaginacao = true;
    filtro.codigo = this.formularioCheckin?.value.alunoSelecionado.id;

    this.criancaService.listarPorFiltro(filtro, (res: any) => {
      if (!!res?.dados) {
        var alunoOutput: types.IAlunoOutput[] = res.dados.dados;
        this.alunoAtual = alunoOutput[0] || null;
        this.alunoAtual.idadeCrianca = `${new Date(this.alunoAtual.dataNascimento)?.toLocaleDateString('pt-BR')} - ${retornaIdadeFormatadaAnoMesDia(new Date(this.alunoAtual.dataNascimento))}`;

        this.frequenciaService.listarPorAlunoETurmaEData(this.alunoAtual.codigo, this.alunoAtual.matricula.codigoTurma, formatDataToFormatoAnoMesDia(this.formularioCheckin.get('data')?.value)).subscribe({
          next: (data) => {
            const frequencias = data?.dados ?? [];
            const frequenciaComPresenca = frequencias.find((x: any) => x.presenca);
            if (frequencias.length > 0 && frequenciaComPresenca) {
              const [dataParte, horaParte] = frequenciaComPresenca.dataFrequencia.split('T');
              this.alunoAtual.frequencia = {};
              this.alunoAtual.frequencia.dataFrequenciaParte = parseDataLocalToString(dataParte);
              this.alunoAtual.frequencia.horaFrequenciaParte = horaParte;
              this.mensagemService.showInfo(`Check-in já registrado na data ${this.alunoAtual.frequencia.dataFrequenciaParte} ${this.alunoAtual.frequencia.horaFrequenciaParte}`);
            }
          }
        });
      }
    });
  }

  async onRegistrarCheckin() {
    const alunoSelecionado = this.formularioCheckin.get('alunoSelecionado')?.value;
    const aluno = this.alunoAtual;
    const turma = aluno.matricula;
    const data = this.formularioCheckin.get('data')?.value;

    if (this.formularioCheckin.invalid) {
      this.formularioCheckin.markAllAsTouched();
      this.mensagemService.showInfo('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    if (!data) {
      this.mensagemService.showInfo('Data inválida. Por favor, selecione uma data válida.');
      return;
    }
    if (!alunoSelecionado) {
      this.mensagemService.showInfo('Criança inválida. Por favor, selecione uma criança válida.');
      return;
    }
    if (!aluno.matricula) {
      this.mensagemService.showInfo('Turma inválida. Por favor, verifique se o a criança está vinculado à uma turma.');
      return;
    }

    //verifica se o check-in já foi registrado para o aluno na data selecionada
    const frequenciasAlunoTurmaData = await this.frequenciaService.listarPorAlunoETurmaEDataPromise(aluno.codigo, turma.codigoTurma, formatDataToFormatoAnoMesDia(data));
    const frequencias = frequenciasAlunoTurmaData?.dados ?? [];
    const frequenciaComPresenca = frequencias.find((x: any) => x.presenca);
    if (frequencias.length > 0 && frequenciaComPresenca) {
      const [dataParte, horaParte] = frequenciaComPresenca.dataFrequencia.split('T');
      this.mensagemService.showInfo(`Check-in já registrado na data ${parseDataLocalToString(dataParte)} ${horaParte}`);
      return;
    }

    //verifica se a turma atingiu o limite máximo de crianças na data selecionada
    const listarTurmasAgrupadasPorData = await this.frequenciaService.listarTurmasAgrupadasPorDataPromise(formatDataToFormatoAnoMesDia(data));
    const turmasAgrupadas = listarTurmasAgrupadasPorData?.dados ?? [];
    const turmaLotada = turmasAgrupadas.find((x: any) => x.codigoTurma === turma.codigoTurma && x.qtd === x.turmaLimiteMaximo);
    if (turmasAgrupadas.length > 0 && turmaLotada) {
      this.mensagemService.showInfo(`Turma ${turmaLotada.turmaDescricaoFormatada} está com a capacidade máxima atingida de ${turmaLotada.turmaLimiteMaximo} crianças.`);
      return;
    }

    //adiciona o registro de frequência (check-in)
    var retorno = await this.adicionarFrequenciaRegistro(aluno, turma, data);
    if (retorno || retorno.dados) {
      this.mensagemService.showSuccess('Check-in registrada com sucesso!');
      this.childAutoCompleteComponent.limpar();
      this.formularioCheckin.get('alunoSelecionado')?.setValue(null);
      this.alunoAtual = null;
    }
  }

  private async adicionarFrequenciaRegistro(aluno: any, turma: any, dataFormulario: Date): Promise<any> {
    var inputFrequencia: FrequenciaInput = {
      "codigo": 0,
      "dataFrequencia": dataFormulario,
      "codigoAluno": aluno.codigo,
      "codigoTurma": turma.codigoTurma,
      "presenca": true,
      "turmaDescricao": turma.turmaDescricao,
      "turmaIdadeInicialAluno": turma.turmaIdadeInicialAluno,
      "turmaIdadeFinalAluno": turma.turmaIdadeFinalAluno,
      "turmaAnoLetivo": turma.turmaAnoLetivo,
      "turmaSemestreLetivo": turma.turmaSemestreLetivo,
      "codigoUsuarioLogado": turma.turmaCodigoUsuarioLogado,
      "dataAtualizacao": obterDataHoraBrasileira(),
      "dataCadastro": obterDataHoraBrasileira()
    }
    var retorno = await this.frequenciaService.IncluirPromise(inputFrequencia);
    return retorno;
  }

  desbilitarBotaoRegistrarCheckin(): boolean | null {
    // (this.formularioCheckin.get('alunoSelecionado')?.value && (alunoAtual && !alunoAtual?.ativo)) ||
    // (this.formularioCheckin.get('alunoSelecionado')?.value && (alunoAtual && !alunoAtual?.matricula)) ||
    // (this.formularioCheckin.get('alunoSelecionado')?.value && (alunoAtual && !alunoAtual?.matricula?.ativo))

    const alunoSelecionado = this.formularioCheckin.get('alunoSelecionado')?.value;
    const aluno = this.alunoAtual;

    if (!alunoSelecionado) {
      return true;
    }
    if (!aluno) {
      return true;
    }
    if (!Boolean(aluno?.ativo)) {
      return true;
    }
    if (!aluno?.matricula) {
      return true;
    }
    if (!aluno?.matricula?.ativo) {
      return true;
    }
    if (aluno?.frequencia) {
      return true;
    }

    return null;
  }

  exibirBotaoCadastroDestatualizado(): boolean {
    // (this.formularioCheckin.get('alunoSelecionado')?.value && (this.alunoAtual && !this.alunoAtual?.ativo)) ||
    // (this.formularioCheckin.get('alunoSelecionado')?.value && (this.alunoAtual && !this.alunoAtual?.matricula)) ||
    // (this.formularioCheckin.get('alunoSelecionado')?.value && (this.alunoAtual && !this.alunoAtual?.matricula?.ativo))

    const alunoSelecionado = this.formularioCheckin.get('alunoSelecionado')?.value;
    const aluno = this.alunoAtual;

    if (alunoSelecionado && (aluno && !Boolean(aluno?.ativo))) {
      return true;
    }
    if (alunoSelecionado && (aluno && !Boolean(aluno?.matricula))) {
      return true;
    }
    if (alunoSelecionado && (Boolean(aluno?.matricula) && !Boolean(aluno?.matricula?.ativo))) {
      return true;
    }
    return false;
  }

  limpar() {
    this.descricaoTuramaSelecionda = '';
    this.alunoAtual = null;
    this.formularioCheckin.get('alunoSelecionado')?.setValue(null);
    this.childAutoCompleteComponent.limpar();
  }

  ngOnDestroy(): void {
    this.descricaoTuramaSelecionda = '';
    this.formularioCheckin.reset();
    this.subscriptions.unsubscribe();
  }

  getCorSala(nome: string | undefined): string {
    if (!nome) return 'black';

    const mapa: { [key: string]: string } = {
      'BRANCO': '#cccccc',
      'LILÁS': '#c8a2c8',
      'LARANJA': 'orange',
      'VERMELHO': 'red',
      'VERDE': 'green',
      'AZUL CLARO': 'deepskyblue'
    };

    const chave = Object.keys(mapa).find(cor => nome.toUpperCase().includes(cor));
    return chave ? mapa[chave] : 'black';
  }

}
