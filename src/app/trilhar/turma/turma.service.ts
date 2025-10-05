import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { finalize, firstValueFrom, Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoadingService } from '../../services/loading.service';
import { MensagemService } from '../../services/mensagem.service';

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

  async listarPorFiltroPromise(filtro: any): Promise<any> {
    this.loadingService.show();
    try {
      return await firstValueFrom(
        this.http.post(`${this.apiUrl}/listarPorFiltro`, filtro)
      );
    } catch (error: any) {
      if (error.status === 404) {
        return of({ dados: null }); // evita que o subscribe dispare erro, depende da lógica desejada
      } else if (error.status === 400) {
        const erros = error.error?.erros || ['Erro de validação.'];
        this.mensagemService.showError(erros.join('\n'), error);
      } else {
        this.mensagemService.showError('Erro inesperado.', error);
        throw error;
      }
      //return throwError(() => error); // dispara erro para quem consome
      return of({ dados: null }); // evita que o subscribe dispare erro, depende da lógica desejada
    } finally {
      this.loadingService.hide();
    }
  }

  Incluir(Entity: any, callback?: any) {
    this.http.post(`${this.apiUrl}`, Entity).subscribe({
      next: (resp: any) => {
        this.mensagemService.showSuccess('Turma incluída com sucesso!');
        if (callback) callback(resp);
      },
      error: (error: any) => {
        this.mensagemService.showError('Erro ao incluir turma', error);
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

      this.mensagemService.showSuccess('Turma incluída com sucesso!');
      return response;
    } catch (error: any) {
      this.mensagemService.showError('Erro ao incluir turma', error);
      throw error; // Re-throw para que o chamador possa lidar com o erro se necessário
    } finally {
      this.loadingService.hide();
    }
  }

  Alterar(id: number, Entity: any, callback?: any) {
    this.http.put(`${this.apiUrl}/${id}`, Entity).subscribe({
      next: (resp: any) => {
        this.mensagemService.showSuccess('Turma alterada com sucesso!');
        if (callback) callback(resp);
      },
      error: (error: any) => {
        this.mensagemService.showError('Erro ao alterar turma', error);
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

      this.mensagemService.showSuccess('Turma alterada com sucesso!');
      return response;
    } catch (error: any) {
      this.mensagemService.showError('Erro ao alterar turma', error);
      throw error;
    } finally {
      this.loadingService.hide();
    }
  }
}
