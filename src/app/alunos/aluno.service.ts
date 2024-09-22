import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

import * as types from './aluno.types';

@Injectable({
  providedIn: 'root', // Isso garante que o serviço seja singleton no root injector
})
export class AlunoService {
  private apiUrl = `${environment.API_TRILHAR}/Aluno`; // URL da API

  constructor(private http: HttpClient) {}

  // listarTodos(): Observable<any[]> {
  //   return this.http.get<any[]>(this.apiUrl);
  // }

  async listarTodos(): Promise<any> {
    return this.http.get<any>(`${this.apiUrl}`).toPromise();
  }

  //   listarPorFiltro(filtro: any, callback?) {
  //     let params = new HttpParams()
  //       .set("coug", filtro.coUg.toString())
  //       .set("coGestao", filtro.coGestao.toString())
  //       .set("periodoApuracao", filtro.periodoApuracaoString.toString())
  //       .set("numeroInscricaoProdutor", filtro.numeroInscricaoProdutor.toString())
  //       .set("pagina", filtro.page.toString())
  //       .set("tamanhoPagina", filtro.pageSize.toString())

  //     this.http.get(`${this.url}/listarPorFiltro`, { params })
  //       .subscribe({
  //         next: (resp: any) => {
  //           callback(resp);
  //         }
  //       });
  //   }

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

  //   Incluir(Entity: any, callback?) {
  //     this.http.post(`${this.url}`, Entity)
  //       .subscribe((resp: any) => {
  //         this.tratarMensagemRetornoSucesso('Registro incluído com sucesso!');
  //         callback(resp);
  //       });
  //   }

  //   Alterar(Entity: any, Id: any, callback?) {
  //     this.http.put(`${this.url}/${Id}`, Entity)
  //       .subscribe((resp: any) => {
  //         this.tratarMensagemRetornoSucesso("Registro alterado com sucesso!");
  //         callback(resp);
  //       });
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
