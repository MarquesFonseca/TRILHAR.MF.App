import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Base } from './base';

const ROTAREPLACE: string = '/afc/';

@Component({
  template: ''
})
export abstract class BaseFormComponent extends Base implements OnInit {
  formulario: FormGroup | undefined;
  locale = this.ptbr();
  @Output() dadosRegistro = new EventEmitter<any>();

  constructor(
    public router: Router,
    public activatedRoute: ActivatedRoute
  ) {
    super();
  }


  override ngOnInit() {
  }

  finalizarAcao(url?: string): void {
    let rotaAtual = this.router.routerState.snapshot.url;

    if (url) {
      rotaAtual = url;
    }

    this.router.navigateByUrl(`/afc`, { skipLocationChange: true }).then(() => {
      this.router.navigate([rotaAtual]);
    });
  }

  //abstract save(): void;
  abstract preencheFormulario(): void;;

  // onSubmit() {
  //   if (this.verificaFormulario()) {
  //     this.save();
  //   }
  // }

  verificaFormulario(): boolean {
    if (this.formulario?.valid) {
      return true;
    } else {
      this.verificaValidacoesForm(this.formulario ?? new FormGroup({}));
      return false;
    }
  }

  verificaValidacoesForm(formGroup: FormGroup | FormArray) {
    Object.keys(formGroup.controls).forEach(campo => {
      const controle = formGroup.get(campo);
      controle?.markAsDirty();
      controle?.markAsTouched();
      if (controle instanceof FormGroup || controle instanceof FormArray) {
        this.verificaValidacoesForm(controle);
      }
    });
  }

  resetar() {
    this.formulario?.reset();
  }

  verificaValidTouched(campo: string) {
    return (
      !this.formulario?.get(campo)?.valid &&
      (this.formulario?.get(campo)?.touched || this.formulario?.get(campo)?.dirty)
    );
  }

  verificaRequired(campo: string) {
    return (
      this.formulario?.get(campo)?.hasError('required') &&
      (this.formulario?.get(campo)?.touched || this.formulario?.get(campo)?.dirty)
    );
  }

  aplicaCssErro(campo: string) {
    return {
      'has-error': this.verificaValidTouched(campo),
      'has-feedback': this.verificaValidTouched(campo)
    };
  }

  ptbr() {
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

  override removeAcento(text: string): string {
    return text.replace(new RegExp('[áàâã]', 'gi'), 'a')
      .replace(new RegExp('[éèê]', 'gi'), 'e')
      .replace(new RegExp('[íìî]', 'gi'), 'i')
      .replace(new RegExp('[óòôõ]', 'gi'), 'o')
      .replace(new RegExp('[úùû]', 'gi'), 'u')
      .replace(new RegExp('[ç]', 'gi'), 'c')
      .replace(new RegExp('[ÁÀÂÃ]', 'gi'), 'A')
      .replace(new RegExp('[ÉÈÊ]', 'gi'), 'E')
      .replace(new RegExp('[ÍÌÎ]', 'gi'), 'I')
      .replace(new RegExp('[ÓÒÔÕ]', 'gi'), 'O')
      .replace(new RegExp('[ÚÙÛ]', 'gi'), 'U')
      .replace(new RegExp('[Ç]', 'gi'), 'C');
  }

  override mascaraCpf(valor: string) {
    return valor.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, '\$1.\$2.\$3\-\$4');
  }

  override mascaraCnpj(valor: string) {
    if (valor) {
      valor = valor.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, '\$1.\$2.\$3\/\$4\-\$5');
    }
    return valor;
  }

  getTitle() {
    var retorno = this.activatedRoute.routeConfig
      ? this.activatedRoute.routeConfig.data?.['titulo']
      : '';
      return retorno;
  }

  getOperacao() {
    var retorno = this.activatedRoute.routeConfig
      ? this.activatedRoute.routeConfig.data?.['breadcrumb']
      : '';
    return retorno;
  }

  getRota() {
    var retorno = this.activatedRoute.routeConfig
      ? this.activatedRoute.routeConfig.data?.['rota']
      : '';
      return retorno;
  }

  getRotaOperacao() {
    var retorno = `/${this.getRota()}/${this.getOperacao()}`;
    return retorno.toLocaleLowerCase();
  }

  selecionarPeloTab(event: any, form: FormGroup, field: string, lista: any[]): void {
    if (event.keyCode === 9) {
      if (form && field && lista) {
        form?.get(field)?.setValue(lista[0])
      }
    }
  }

  // selecionarPeloTabModel(event: any, field: any, lista: any[]): void {
  //   if (event.keyCode === 9) {
  //     this[field] = lista[0];
  //   }
  // }

  voltar(): void {
    const rotaAtual = this.router.routerState.snapshot.url;

    const NextRota = rotaAtual.replace(ROTAREPLACE, '').split('/')[0];

    this.router.navigateByUrl(`/afc/${NextRota}`, { state: { voltar: true } });
  }


  compararNumeros(a: any, b: any) {
    return a.id - b.id;
  }

}
