import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { finalize, firstValueFrom, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoadingService } from '../../services/loading.service';
import { MensagemService } from '../../services/mensagem.service';
import * as types from './frequencia.types';

@Injectable({
  providedIn: 'root',
})
export class FrequenciaService {
  private apiUrl = `${environment.API_TRILHAR}/frequencias`; // URL da API

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService,
    private mensagemService: MensagemService,
  ) {}

  listarTodos(): Observable<any[]> {
    this.loadingService.show();
    return this.http
      .get<any[]>(this.apiUrl)
      .pipe(finalize(() => this.loadingService.hide()));
  }

  // listarPorFiltro(filtro: any, callback?: (resp: any) => void) {
  //   this.loadingService.show();
  //   this.http.post(`${this.apiUrl}/filtro`, filtro).subscribe({
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

  // listarPorFiltroPromise(filtro: any): Promise<any> {
  //   this.loadingService.show();
  //   return new Promise((resolve, reject) => {
  //     this.http.post(`${this.apiUrl}/filtro`, filtro).subscribe({
  //       next: (resp: any) => {
  //         this.loadingService.hide();
  //         resolve(resp); // Resolve a Promise com os dados da resposta
  //       },
  //       error: (err: any) => {
  //         this.loadingService.hide();
  //         console.error('Erro ao listar por filtro:', err);
  //         reject(err); // Rejeita a Promise em caso de erro
  //       }
  //     });
  //   });
  // }

  // listarPorFiltro(filtro: any): Observable<any> {
  //   this.loadingService.show();
  //   return this.http.post(`${this.apiUrl}/filtro`, filtro).pipe(
  //       finalize(() => this.loadingService.hide()) // Garante que o loading sempre será escondido
  //   );
  // }

  async listarTodosPromise(): Promise<any> {
    return this.http.get<any>(`${this.apiUrl}`).toPromise();
  }

  Incluir(Entity: any, callback?: any) {
    this.http.post(`${this.apiUrl}`, Entity).subscribe({
      next: (resp: any) => {
        this.mensagemService.showSuccess('Frequência incluída com sucesso!');
        if (callback) callback(resp);
      },
      error: (error: any) => {
        this.mensagemService.showError('Erro ao incluir frequência', error);
        if (callback) callback(null);
      }
    });
  }

  async IncluirPromise(Entity: any): Promise<any> {
    this.loadingService.show();

    try {
      const response = await firstValueFrom(
        this.http.post(`${this.apiUrl}`, Entity)
      );

      this.mensagemService.showSuccess('Frequência incluída com sucesso!');
      return response;
    } catch (error: any) {
      this.mensagemService.showError('Erro ao incluir frequência', error);
      throw error; // Re-throw para que o chamador possa lidar com o erro se necessário
    } finally {
      this.loadingService.hide();
    }
  }

  Alterar(id: number, Entity: any, callback?: any) {
    this.http.put(`${this.apiUrl}/${id}`, Entity).subscribe({
      next: (resp: any) => {
        this.mensagemService.showSuccess('Frequência alterada com sucesso!');
        if (callback) callback(resp);
      },
      error: (error: any) => {
        this.mensagemService.showError('Erro ao alterar frequência', error);
        if (callback) callback(null);
      }
    });
  }

  async AlterarPromise(id: number, Entity: any): Promise<any> {
    this.loadingService.show();

    try {
      const response = await firstValueFrom(
        this.http.put(`${this.apiUrl}/${id}`, Entity)
      );

      this.mensagemService.showSuccess('Frequência alterada com sucesso!');
      return response;
    } catch (error: any) {
      this.mensagemService.showError('Erro ao alterar frequência', error);
      throw error;
    } finally {
      this.loadingService.hide();
    }
  }
}
