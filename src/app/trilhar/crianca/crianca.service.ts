import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { finalize, firstValueFrom, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

import * as types from './crianca.types';
import { LoadingService } from '../../services/loading.service';

@Injectable({
  providedIn: 'root', // Isso garante que o serviço seja singleton no root injector
})
export class CriancaService {
  private apiUrl = `${environment.API_TRILHAR}/aluno`; // URL da API

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService
  ) {}

  listarTodos(): Observable<any[]> {
    this.loadingService.show();
    return this.http
      .get<any[]>(this.apiUrl)
      .pipe(finalize(() => this.loadingService.hide()));
  }

  //sem loading
  // listarPorFiltro(filtro: any, callback?: any) {
  //   this.loadingService.show();
  //   this.http.post(`${this.apiUrl}/listarPorFiltro`, filtro).subscribe((resp: any) => {
  //     this.loadingService.hide();

  //     callback(resp);
  //   });
  // }

  listarPorFiltro(filtro: any, callback?: (resp: any) => void) {
    this.loadingService.show();
    this.http.post(`${this.apiUrl}/listarPorFiltro`, filtro).subscribe({
        next: (resp: any) => {
            this.loadingService.hide();
            if (callback) {
                callback(resp); // Invoca o callback com os dados da resposta
            }
        },
        error: (err: any) => {
            this.loadingService.hide();
            console.error('Erro ao listar por filtro:', err);
            // Aqui você pode adicionar lógica para mostrar mensagens de erro
            if (callback) {
                callback(null); // Invoca o callback com `null` para indicar erro
            }
        }
    });
}

  async listarTodosPromise(): Promise<any> {
    return this.http.get<any>(`${this.apiUrl}`).toPromise();
  }

  Incluir(Entity: any, callback?: any) {
    this.http.post(`${this.apiUrl}`, Entity).subscribe((resp: any) => {
      //this.tratarMensagemRetornoSucesso('Registro incluído com sucesso!');
      callback(resp);
    });
  }

  Alterar(Entity: types.CriancaModel, Id: any, callback?: any) {
    this.http.put(`${this.apiUrl}/${Id}`, Entity).subscribe((resp: any) => {
      //this.tratarMensagemRetornoSucesso("Registro alterado com sucesso!");
      callback(resp);
    });
  }

  // listarPorFiltro(filtro: any, callback?: any) {
  //   //this.loadingService.show();
  //   let params = new HttpParams()
  //     .set('coug', filtro.coUg.toString())
  //     .set('coGestao', filtro.coGestao.toString())
  //     .set('periodoApuracao', filtro.periodoApuracaoString.toString())
  //     .set('numeroInscricaoProdutor', filtro.numeroInscricaoProdutor.toString())
  //     .set('pagina', filtro.page.toString())
  //     .set('tamanhoPagina', filtro.pageSize.toString());

  //   this.http.get(`${this.apiUrl}/listarPorFiltro`, { params }).subscribe({
  //     next: (resp: any) => {
  //       callback(resp);
  //     },
  //   });
  // }

  //   async listarPorFiltroPromise(filtro: any): Promise<any> {
  //     let params = new HttpParams()
  //       .set("coug", filtro.coUg ? filtro.coUg.toString() : '')
  //       .set("coGestao", filtro.coGestao ? filtro.coGestao.toString() : '')
  //       .set("periodoApuracao", filtro.periodoApuracaoString ? filtro.periodoApuracaoString.toString() : '')
  //       .set("numeroInscricaoProdutor", filtro.numeroInscricaoProdutor ? filtro.numeroInscricaoProdutor.toString() : '')
  //       .set("pagina", filtro.page ? filtro.page.toString() : '')
  //       .set("tamanhoPagina", filtro.pageSize ? filtro.pageSize.toString() : '');

  //     return this.http.get(`${this.url}/listarPorFiltro`, { params }).toPromise();
  //   }

  //   listarPorId(Id: string, callback?) {
  //     this.http.get(`${this.url}/${Id}`)
  //       .subscribe({
  //         next: (resp: any) => {
  //           callback(resp);
  //         }
  //       });
  //   }

  //   async verificaSeExistePromise(Id: string): Promise<any> {
  //     return this.http.get<any>(`${this.url}/VerificaSeExiste/${Id}`).toPromise();
  //   }

  //   Excluir(Id: number, callback?) {
  //     this.http.delete(`${this.url}/excluirEvento/${Id}`)
  //       .subscribe((resp: any) => {
  //         this.tratarMensagemRetornoSucesso("Registro excluído com sucesso!");
  //         callback(resp);
  //       });
  //   }

  //   Cancelar(Id: number, callback?) {
  //     this.http.delete(`${this.url}/${Id}`)
  //       .subscribe((resp: any) => {
  //         this.tratarMensagemRetornoSucesso("Registro cancelado com sucesso!");
  //         callback(resp);
  //       });
  //   }

  //   DeleteItemAquisicao(idAquisicaoProducaoRuralPai: number, idItemRegistroFilho: number, callback?) {
  //     this.http.delete(`${this.url}/${idAquisicaoProducaoRuralPai}/itemAquisicao/${idItemRegistroFilho}`)
  //       .subscribe({
  //         next: (resp: any) => {
  //           callback(resp);
  //         }
  //       });
  //   }

  //   ObterEFDReinfDescricao(List: any[], callback?) {
  //     let params = new HttpParams();
  //     List.forEach(c => {
  //       params = params.append('listaCampos', c);
  //     });

  //     this.http.get(`${this.urlDescricao}?${params}`)
  //       .subscribe({
  //         next: (resp: any) => {
  //           callback(resp);
  //         }
  //       });
  //   }

  //   async ObterEFDReinfDescricaoPromise(List: any[]): Promise<any> {

  //     let params = new HttpParams();
  //     List.forEach(c => {
  //       params = params.append('listaCampos', c);
  //     });

  //     return new Promise<any>(async (resolve) => {
  //       this.http.get(`${this.urlDescricao}?${params}`)
  //       .subscribe({
  //         next: (resp: any | any) => {
  //           resolve(resp);
  //         }
  //       });
  //     });
  //   }

  //   async verificarExisteInformacoesContribuinte(coug: number, periodoApuracao: string): Promise<any> {
  //     return await this.http.get<boolean>(`${this.url}/verificaSeExisteInformacaoContribuitePeriodo/${coug}/${periodoApuracao}`).toPromise().catch(() => {
  //       var retornoErro = { dados: false };
  //       return retornoErro;
  //     });
  //   }
}
