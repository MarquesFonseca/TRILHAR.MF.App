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

  selecionarPeloTabAsync(event: any, form: FormGroup, field: string, listaPromise: Promise<any[]>): void {
    if (event.key === 'Tab') {
      listaPromise.then(function (lista: any[]): void {
        const firstItem = lista[0];
        form?.get(field)?.setValue(firstItem);
      })
    }
  }

  goto(tela: string) {
    let rotaAtual = this.router.routerState.snapshot.url;
    this.router.navigateByUrl(`/afc`, { skipLocationChange: true }).then(() => {
      this.router.navigate([rotaAtual + "/" + tela]);
    });
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
