import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Base } from './base';
import { FormGroup } from '@angular/forms';

const KEY = 'filtroListar';

@Component({
    template: ''
})
export abstract class BaseListComponent extends Base implements OnInit {
  filtro: any;
  funcao: string;
  isSearch = false;
  paginacao = [10, 20, 50, 100, 200];

  constructor(
    public router: Router,
    public activatedRoute: ActivatedRoute,
  ) {
    super();
    this.funcao = this.activatedRoute.routeConfig?.data?.['funcao'];
    this.verificaFiltro();
  }

  override ngOnInit() {
  }

  abstract preencheFiltro(): void;

  getFiltroListar(): any | null {

    var fil = window.localStorage.getItem(`${KEY}${this.funcao}`)?.toString();
    const filtro = JSON.stringify(fil);

    if (filtro) {
      return filtro;
    }
    return null;
  }

  setFiltroListar(filtro: any): void {
    //window.localStorage.setItem(`${KEY}${this.funcao}`, JSON.stringify(filtro));
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(`${KEY}${this.funcao}`, JSON.stringify(filtro));
    }
  }

  limparFiltroListar(): void {
    //window.localStorage?.removeItem(`${KEY}${this.funcao}`);

    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(`${KEY}${this.funcao}`);
    }
  }

  verificaFiltro(): void {
    if (this.router?.getCurrentNavigation()?.extras.state === undefined) {
      this.limparFiltroListar();
    } else {
      const isVoltar = this.router?.getCurrentNavigation()?.extras?.state?.['voltar'];
      if (isVoltar !== undefined && isVoltar === true) {
        this.filtro = this.getFiltroListar();
      }
    }
  }

  selecionarPeloTab(event: any, form: FormGroup, field: string, lista: any[]): void {
    if (event.keyCode === 9) {
      if (form && field && lista) {
        form?.get(field)?.setValue(lista[0])
      }
    }
  }

  selecionarPeloTabAsync (event: any, form: FormGroup, field: string, listaPromise: Promise<any[]>): void {
        if (event.key === 'Tab') {
            listaPromise.then(function (lista: any[]): void {
                const firstItem = lista[0];
                form?.get(field)?.setValue(firstItem);
            })
        }
    }

  // selecionarPeloTabModel(event: any, field: any, lista: any[]): void {
  //   if (event.keyCode === 9) {
  //     this[field] = lista[0];
  //   }
  // }

  compararNumeros(a: any, b: any) {
    return a.id - b.id;
  }

  goto(tela: string) {
    let rotaAtual = this.router.routerState.snapshot.url;
    this.router.navigateByUrl(`/afc`, { skipLocationChange: true }).then(() => {
      this.router.navigate([rotaAtual + "/" + tela]);
    });
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


}
