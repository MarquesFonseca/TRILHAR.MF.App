import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { finalize, firstValueFrom, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import * as types from './frequencia.types';
import { LoadingService } from '../../services/loading.service';

@Injectable({
  providedIn: 'root',
})
export class FrequenciaService {
  private apiUrl = `${environment.API_TRILHAR}/frequencia`; // URL da API

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

  // listarPorFiltro(filtro: any, callback?: (resp: any) => void) {
  //   this.loadingService.show();
  //   this.http.post(`${this.apiUrl}/listarPorFiltro`, filtro).subscribe({
  //       next: (resp: any) => {
  //           this.loadingService.hide();
  //           if (callback) {
  //               callback(resp); // Invoca o callback com os dados da resposta
  //           }
  //       },
  //       error: (err: any) => {
  //           this.loadingService.hide();
  //           console.error('Erro ao listar por filtro:', err);
  //           // Aqui você pode adicionar lógica para mostrar mensagens de erro
  //           if (callback) {
  //               callback(null); // Invoca o callback com `null` para indicar erro
  //           }
  //       }
  //   });
  // }

  listarPorFiltroPromise(filtro: any): Promise<any> {
    this.loadingService.show();
    return new Promise((resolve, reject) => {
      this.http.post(`${this.apiUrl}/listarPorFiltro`, filtro).subscribe({
        next: (resp: any) => {
          this.loadingService.hide();
          resolve(resp); // Resolve a Promise com os dados da resposta
        },
        error: (err: any) => {
          this.loadingService.hide();
          console.error('Erro ao listar por filtro:', err);
          reject(err); // Rejeita a Promise em caso de erro
        }
      });
    });
  }

  listarPorFiltro(filtro: any): Observable<any> {
    this.loadingService.show();
    return this.http.post(`${this.apiUrl}/listarPorFiltro`, filtro).pipe(
        finalize(() => this.loadingService.hide()) // Garante que o loading sempre será escondido
    );
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

  Alterar(Entity: types.FrequenciaModel, Id: any, callback?: any) {
    this.http.put(`${this.apiUrl}/${Id}`, Entity).subscribe((resp: any) => {
      //this.tratarMensagemRetornoSucesso("Registro alterado com sucesso!");
      callback(resp);
    });
  }
}
