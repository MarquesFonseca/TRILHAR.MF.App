import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  template: ''
})
export class Base implements OnInit {

  limiteRetornoAutoComplete = 100;

  constructor() { }

  ngOnInit() { }

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

  filtrarAutocomplete(registros: any, filtro: string, camposComparar: Array<string>): any {
    const listaFiltrada = [];
    for (let i = 0, length = registros.length; i < length; i++) {
      const registro = registros[i];

      if (filtro !== '') {
        camposComparar.forEach(campo => {
          if (typeof registro[campo] === 'string') {
            if (this.removeAcento(registro[campo].toLowerCase()).indexOf(this.removeAcento(filtro.toLowerCase())) !== -1) {
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

  removeAcento(text: string): string {
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

  mascaraCpf(valor: string) {
    return valor.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, '\$1.\$2.\$3\-\$4');
  }

  mascaraCnpj(valor: string) {
    if (valor) {
      valor = valor.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, '\$1.\$2.\$3\/\$4\-\$5');
    }
    return valor;
  }

  abrirAba(router: Router, namedRoute: any, rowData: any) {
    let newRelativeUrl = router.createUrlTree([namedRoute]);
    let baseUrl = window.location.href.replace(router.url, '');
    window.open(baseUrl + newRelativeUrl, '_blank');
  }


  abertoPorNovaAba(): boolean {
    return window.opener !== null;
  }
}
