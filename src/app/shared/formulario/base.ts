import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as utils from '../funcoes-comuns/utils';

@Component({
  template: ''
})
export class Base implements OnInit {

  limiteRetornoAutoComplete = 100;

  constructor() { }

  ngOnInit() { }

  public filtrarAutocomplete(registros: any, filtro: string, camposComparar: Array<string>): any {
    const listaFiltrada = [];
    for (let i = 0, length = registros.length; i < length; i++) {
      const registro = registros[i];

      if (filtro !== '') {
        camposComparar.forEach(campo => {
          if (typeof registro[campo] === 'string') {
            if (utils.removeAcento(registro[campo].toLowerCase()).indexOf(utils.removeAcento(filtro.toLowerCase())) !== -1) {
              listaFiltrada.push(registro);
            }
          } else {
            if (registro[campo].toString().indexOf(filtro) !== -1) {
              listaFiltrada.push(registro);
            }
          }
        });
      } else {
        listaFiltrada.push(registro);
      }

      if (listaFiltrada.length >= this.limiteRetornoAutoComplete) {
        break;
      }
    }
    return listaFiltrada;
  }

  public abrirAba(router: Router, namedRoute: any, rowData: any) {
    let newRelativeUrl = router.createUrlTree([namedRoute]);
    let baseUrl = window.location.href.replace(router.url, '');
    window.open(baseUrl + newRelativeUrl, '_blank');
  }

  public abertoPorNovaAba(): boolean {
    return window.opener !== null;
  }

  public ptBR: any = {
    firstDayOfWeek: 0,
    dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
    dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
    dayNamesMin: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
    monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
    monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    today: 'Hoje',
    clear: 'Limpar'
  };
}
