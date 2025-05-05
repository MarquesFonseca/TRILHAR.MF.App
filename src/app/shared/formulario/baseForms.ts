import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ValidatorMessages } from '../funcoes-comuns/validators/validator-messages';
import { Base } from './base';
import * as utils from '../funcoes-comuns/utils';

const ROTAREPLACE: string = '/afc/';

interface Operacao {
  isDetalhar: boolean,
  isNovo: boolean,
  isEditar: boolean,
  disabled: boolean,
  operacao: string,
  titleButton: string
}

@Component({
  template: ''
})
export abstract class BaseFormComponent extends Base implements OnInit {
  formulario: FormGroup = new FormGroup({});
  operacao: Operacao = this.criarOperacaoPadrao();
  locale = this.ptbr();
  // Propriedades para datas e ambiente
  currentDate: string = new Date().toISOString();
  hoje: Date = new Date();
  @Output() dadosRegistro = new EventEmitter<any>();



  constructor(
    public router: Router,
    public activatedRoute: ActivatedRoute
  ) {
    super();
    this.operacao = this.getConfiguracaoOperacao(this.getOperacao());
  }

  abstract salvar(): void;
  abstract preencheFormulario(): void;
  abstract carregaFormGroup(): void;
  override ngOnInit() { }

  public get f() {
    return this.formulario.controls;
  }

  protected criarOperacaoPadrao(): Operacao {
    return {
      isDetalhar: false,
      isNovo: false,
      isEditar: false,
      disabled: false,
      operacao: '',
      titleButton: ''
    };
  }

  public finalizarAcao(url?: string): void {
    let rotaAtual = this.router.routerState.snapshot.url;

    if (url) {
      rotaAtual = url;
    }

    this.router.navigateByUrl(`/afc`, { skipLocationChange: true }).then(() => {
      this.router.navigate([rotaAtual]);
    });
  }

  public verificaFormulario(): boolean {
    if (this.formulario?.valid) {
      return true;
    } else {
      this.verificaValidacoesForm(this.formulario ?? new FormGroup({}));
      return false;
    }
  }

  public verificaValidacoesForm(formGroup: FormGroup | FormArray) {
    Object.keys(formGroup.controls).forEach(campo => {
      const controle = formGroup.get(campo);
      controle?.markAsDirty();
      controle?.markAsTouched();
      if (controle instanceof FormGroup || controle instanceof FormArray) {
        this.verificaValidacoesForm(controle);
      }
    });
  }

  public limpar() {
    this.formulario?.reset();
  }

  public verificaValidTouched(campo: string) {
    return (
      !this.formulario?.get(campo)?.valid &&
      (this.formulario?.get(campo)?.touched || this.formulario?.get(campo)?.dirty)
    );
  }

  public verificaRequired(campo: string) {
    return (
      this.formulario?.get(campo)?.hasError('required') &&
      (this.formulario?.get(campo)?.touched || this.formulario?.get(campo)?.dirty)
    );
  }

  public aplicaCssErro(campo: string) {
    return {
      'has-error': this.verificaValidTouched(campo),
      'has-feedback': this.verificaValidTouched(campo)
    };
  }

  public ptbr() {
    return {
      firstDayOfWeek: 0,
      dayNames: [
        'Domingo',
        'Segunda',
        'Terça',
        'Quarta',
        'Quinta',
        'Sexta',
        'Sábado'
      ],
      dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
      dayNamesMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
      monthNames: [
        'Janeiro',
        'Fevereiro',
        'Março',
        'Abril',
        'Maio',
        'Junho',
        'Julho',
        'Agosto',
        'Setembro',
        'Outubro',
        'Novembro',
        'Dezembro'
      ],
      monthNamesShort: [
        'Jan',
        'Fev',
        'Mar',
        'Abr',
        'Mai',
        'Jun',
        'Jul',
        'Ago',
        'Set',
        'Out',
        'Nov',
        'Dez'
      ],
      today: 'Hoje',
      clear: 'Limpar'
    };
  }

  public getTitle() {
    var retorno = this.activatedRoute.routeConfig
      ? this.activatedRoute.routeConfig.data?.['titulo']
      : '';
    return retorno;
  }

  public getOperacao() {
    var retorno = this.activatedRoute.routeConfig
      ? this.activatedRoute.routeConfig.data?.['breadcrumb']
      : '';
    return retorno;
  }

  public getConfiguracaoOperacao(operacao: string): Operacao {
    if(utils.isNullOrEmpty(operacao)) { return this.criarOperacaoPadrao(); }

    switch (operacao?.toLocaleLowerCase()) {
      case 'detalhar':
        return {
          isDetalhar: Boolean(true),
          isNovo: Boolean(false),
          isEditar: Boolean(false),
          disabled: Boolean(true),
          operacao: 'detalhar',
          titleButton: '',
        };
      case 'alterar':
        return {
          isDetalhar: Boolean(false),
          isNovo: Boolean(false),
          isEditar: Boolean(true),
          disabled: Boolean(false),
          operacao: 'alterar',
          titleButton: 'Alterar',
        }
      case 'novo':
      case 'incluir':
        return {
          isDetalhar: Boolean(false),
          isNovo: Boolean(true),
          isEditar: Boolean(false),
          disabled: Boolean(false),
          operacao: 'incluir',
          titleButton: 'Incluir',
        }
      default:
        return this.criarOperacaoPadrao();
    }
  }

  public getRota() {
    var retorno = this.activatedRoute.routeConfig
      ? this.activatedRoute.routeConfig.data?.['rota']
      : '';
    return retorno;
  }

  public getRotaOperacao() {
    var retorno = `/${this.getRota()}/${this.getOperacao()}`;
    return retorno.toLocaleLowerCase();
  }

  public selecionarPeloTab(event: any, form: FormGroup, field: string, lista: any[]): void {
    if (event.keyCode === 9) {
      if (form && field && lista) {
        form?.get(field)?.setValue(lista[0])
      }
    }
  }

  public voltar(): void {
    const rotaAtual = this.router.routerState.snapshot.url;

    const NextRota = rotaAtual.replace(ROTAREPLACE, '').split('/')[0];

    this.router.navigateByUrl(`/afc/${NextRota}`, { state: { voltar: true } });
  }

  public objectKeysForMessagesErros = Object.keys;
  public getValidatorMessage(errorKey: string, errorValue: any): string {
    const messageFn = ValidatorMessages[errorKey];
    return messageFn ? messageFn(errorValue) : 'Erro desconhecido';
  }

  // Para navegação com parâmetros
  // Exemplo: this.navegar(event, '/caminho', [param1, param2]);
  //(click)="navegar($event, '/criancas/listar')">
  //(click)="navegar($event, '/criancas/incluir', [formulario.get('codigoCadastro')?.value])"
  public navegar(event: Event, caminho: string, parametros?: any[]): void {
    event.preventDefault();

    if (parametros && parametros.length > 0) {
      // Se há parâmetros, usa o array completo [caminho, param1, param2, ...]
      this.router.navigate([caminho, ...parametros]);
    } else {
      // Se não há parâmetros, navega apenas para o caminho
      this.router.navigate([caminho]);
    }
  }

  // Para navegação com query params
  // Exemplo: this.navegarComQuery(event, '/caminho', { param1: 'valor1', param2: 'valor2' });
  public navegarComQuery(event: Event, caminho: string, queryParams: any): void {
    event.preventDefault();
    this.router.navigate([caminho], { queryParams });
  }

}
