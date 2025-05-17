import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { finalize, firstValueFrom, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoadingService } from '../../services/loading.service';
import { MensagemService } from '../../services/mensagem.service';
import * as types from './matricula.types';

@Injectable({
  providedIn: 'root',
})
export class MatriculaService {
  private apiUrl = `${environment.API_TRILHAR}/matriculas`; // URL da API

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService,
    private mensagemService: MensagemService,
  ) {}

  listarPorCodigoAlunoCodigoTurma(codigoAluno: string, codigoTurma: string): Observable<any> {
    this.loadingService.show();
    return this.http
      .get(`${this.apiUrl}/aluno/${codigoAluno}/turma/${codigoTurma}`)
      .pipe(finalize(() => this.loadingService.hide()));
  }

  async listarPorCodigoAlunoCodigoTurmaPromise(codigoAluno: string, codigoTurma: string): Promise<any> {
    this.loadingService.show(); // Exibe o indicador de carregamento
    try {
      const response = await firstValueFrom(
        this.http.get<any>(`${this.apiUrl}/aluno/${codigoAluno}/turma/${codigoTurma}`)
      );
      return response; // Retorna a resposta da API
    } catch (error: any) {
      this.mensagemService.showError('Erro ao buscar por ID', error);
      console.error('Erro ao buscar por ID:', error);
      throw error; // Propaga o erro
    } finally {
      this.loadingService.hide(); // Oculta o indicador de carregamento
    }
  }

  listarPorCodigoAluno(codigoAluno: string): Observable<any> {
    this.loadingService.show();
    return this.http
      .get(`${this.apiUrl}/aluno/${codigoAluno}`)
      .pipe(finalize(() => this.loadingService.hide()));
  }

  async listarPorCodigoAlunoPromise(codigoAluno: string): Promise<any> {
    this.loadingService.show(); // Exibe o indicador de carregamento
    try {
      const response = await firstValueFrom(
        this.http.get<any>(`${this.apiUrl}/aluno/${codigoAluno}`)
      );
      return response; // Retorna a resposta da API
    } catch (error: any) {
      this.mensagemService.showError('Erro ao buscar por ID', error);
      console.error('Erro ao buscar por ID:', error);
      throw error; // Propaga o erro
    } finally {
      this.loadingService.hide(); // Oculta o indicador de carregamento
    }
  }

  listarPorCodigoTurma(codigoTurma: string): Observable<any> {
    this.loadingService.show();
    return this.http
      .get(`${this.apiUrl}/turma/${codigoTurma}`)
      .pipe(finalize(() => this.loadingService.hide()));
  }

  async listarPorCodigoTurmaPromise(codigoTurma: string): Promise<any> {
    this.loadingService.show(); // Exibe o indicador de carregamento
    try {
      const response = await firstValueFrom(
        this.http.get<any>(`${this.apiUrl}/turma/${codigoTurma}`)
      );
      return response; // Retorna a resposta da API
    } catch (error: any) {
      this.mensagemService.showError('Erro ao buscar por ID', error);
      console.error('Erro ao buscar por ID:', error);
      throw error; // Propaga o erro
    } finally {
      this.loadingService.hide(); // Oculta o indicador de carregamento
    }
  }

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

  async listarTodosPromise(): Promise<any> {
    return this.http.get<any>(`${this.apiUrl}`).toPromise();
  }

  Incluir(Entity: any, callback?: any) {
    this.http.post(`${this.apiUrl}`, Entity).subscribe({
      next: (resp: any) => {
        this.mensagemService.showSuccess('Matrícula incluída com sucesso!');
        if (callback) callback(resp);
      },
      error: (error: any) => {
        this.mensagemService.showError('Erro ao incluir matrícula', error);
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

      this.mensagemService.showSuccess('Matrícula incluída com sucesso!');
      return response;
    } catch (error: any) {
      this.mensagemService.showError('Erro ao incluir matrícula', error);
      throw error; // Re-throw para que o chamador possa lidar com o erro se necessário
    } finally {
      this.loadingService.hide();
    }
  }

  Alterar(id: number, Entity: any, callback?: any) {
    this.http.put(`${this.apiUrl}/${id}`, Entity).subscribe({
      next: (resp: any) => {
        this.mensagemService.showSuccess('Matrícula alterada com sucesso!');
        if (callback) callback(resp);
      },
      error: (error: any) => {
        this.mensagemService.showError('Erro ao alterar matrícula', error);
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

      this.mensagemService.showSuccess('Matrícula alterada com sucesso!');
      return response;
    } catch (error: any) {
      this.mensagemService.showError('Erro ao alterar matrícula', error);
      throw error;
    } finally {
      this.loadingService.hide();
    }
  }

}
