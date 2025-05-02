import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { finalize, firstValueFrom, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoadingService } from '../../services/loading.service';
import { MensagemService } from '../../services/mensagem.service';
import * as types from './turma.types';

@Injectable({
  providedIn: 'root', // Isso garante que o serviço seja singleton no root injector
})
export class TurmaService {
  private apiUrl = `${environment.API_TRILHAR}/turmas`; // URL da API

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

  ListarTurmasAtivas(): Observable<any> {
    this.loadingService.show();
    return this.http
      .get(`${this.apiUrl}/ListarTurmasAtivas`)
      .pipe(finalize(() => this.loadingService.hide()));
  }

  async listarTurmasAtivasPromise(): Promise<any> {
    this.loadingService.show();
    try {
      const resultado = await firstValueFrom(
        this.http.get(`${this.apiUrl}/ListarTurmasAtivas`)
      );
      return resultado;
    } finally {
      this.loadingService.hide();
    }
  }

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

  Incluir(Entity: any, callback?: any) {
    this.http.post(`${this.apiUrl}`, Entity).subscribe((resp: any) => {
      this.mensagemService.showSuccess('Registro incluído com sucesso!');
      callback(resp);
    });
  }

  Alterar(Id: any, Entity: any, callback?: any) {
    this.http.put(`${this.apiUrl}/${Id}`, Entity).subscribe((resp: any) => {
      this.mensagemService.showSuccess('Registro alterado com sucesso!');
      callback(resp);
    });
  }
}
