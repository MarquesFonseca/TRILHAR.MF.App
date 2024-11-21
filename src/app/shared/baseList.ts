import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Base } from '../shared/base';
import { stringify } from 'querystring';

const KEY = 'filtroListar';

@Component({
    template: ''
})
export abstract class BaseListComponent extends Base implements OnInit {
  filtro: any;
  funcaoSCA: string;
  isSearch = false;
  paginacao = [10, 20, 50, 100, 200];


  constructor(
    public router: Router,
    public activatedRoute: ActivatedRoute
  ) {
    super();

    this.funcaoSCA = this.activatedRoute.routeConfig?.data?.['funcaoSCA'];
    this.verificaFiltro();
  }

  override ngOnInit() {
  }

  getFiltroListar(): any | null {

    var fil = window.localStorage.getItem(`${KEY}${this.funcaoSCA}`)?.toString();
    const filtro = JSON.stringify(fil);

    if (filtro) {
      return filtro;
    }
    return null;
  }

  setFiltroListar(filtro: any): void {
    window.localStorage.setItem(`${KEY}${this.funcaoSCA}`, JSON.stringify(filtro));
  }

  limparFiltroListar(): void {
    window.localStorage.removeItem(`${KEY}${this.funcaoSCA}`);
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

  // selecionarPeloTab(event: any, form: FormGroup, field: string, lista: any[]): void {
  //   if (event.keyCode === 9) {
  //     if (form && field && lista) {
  //       form?.get(field).setValue(lista[0])
  //     }
  //   }
  // }
  // selecionarPeloTabAsync (event: any, form: FormGroup, field: string, listaPromise: Promise<any[]>): void {
  //       if (event.key === 'Tab') {
  //           listaPromise.then(function (lista: any[]): void {
  //               const firstItem = lista[0];
  //               form.get(field).setValue(firstItem);
  //           })
  //       }
  //   }

  // selecionarPeloTabModel(event, field: any, lista: any[]): void {
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

  getTituloPaginaAtual() {
    return this.activatedRoute.routeConfig
      ? this.activatedRoute.routeConfig.data?.['titulo']
      : '';
  }

  abstract preencheFiltro(): void;
}
