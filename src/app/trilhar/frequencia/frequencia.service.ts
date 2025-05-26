import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, finalize, firstValueFrom, Observable, of, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoadingService } from '../../services/loading.service';
import { MensagemService } from '../../services/mensagem.service';
import * as types from './frequencia.types';

@Injectable({
  providedIn: 'root',
})
export class FrequenciaService {
  private apiUrl = `${environment.API_TRILHAR}/frequencias`;

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService,
    private mensagemService: MensagemService,
  ) { }

  /** GET /api/frequencias
  * Retorna todos os registros de frequência
  *
  * Exemplo de uso com Observable:
  * this.frequenciaService.listarTodos().subscribe({
  *   next: (data) => {
  *     this.frequencias = data;
  *     console.log('Frequências carregadas:', this.frequencias);
  *   },
  *   error: (err) => {
  *     console.error('Erro ao carregar frequências:', err);
  *   }
  * });
  */
  listarTodos(): Observable<any[]> {
    this.loadingService.show();
    return this.http
      .get<any[]>(this.apiUrl)
      .pipe(finalize(() => this.loadingService.hide()));
  }

  /** GET /api/frequencias
  * Retorna todos os registros de frequência (versão Promise)
  *
  * Exemplo de uso com Promise:
  * async carregarDados() {
  *   try {
  *     this.frequencias = await this.frequenciaService.listarTodosPromise();
  *   } catch (err) {
  *     console.error('Erro:', err);
  *   }
  * }
  */
  async listarTodosPromise(): Promise<any> {
    this.loadingService.show();
    try {
      return await firstValueFrom(this.http.get<any>(`${this.apiUrl}`));
    } finally {
      this.loadingService.hide();
    }
  }

  /** GET /api/frequencias/{id}
  * Retorna o registro de frequência por ID
  *
  * Exemplo de uso com Observable:
  * this.frequenciaService.obterPorId(1).subscribe({
  *   next: (data) => {
  *     this.frequencia = data;
  *     console.log('Frequência carregada:', this.frequencia);
  *   },
  *   error: (err) => {
  *     console.error('Erro ao carregar frequência:', err);
  *   }
  * });
  */
  obterPorId(id: number): Observable<any> {
    this.loadingService.show();
    return this.http
      .get<any>(`${this.apiUrl}/${id}`)
      .pipe(finalize(() => this.loadingService.hide()));
  }

  /** GET /api/frequencias/{id}
  * Retorna o registro de frequência por ID (versão Promise)
  *
  * Exemplo de uso com Promise:
  * async carregarFrequencia(id: number) {
  *   try {
  *     this.frequencia = await this.frequenciaService.obterPorIdPromise(id);
  *   } catch (err) {
  *     console.error('Erro:', err);
  *   }
  * }
  */
  async obterPorIdPromise(id: number): Promise<any> {
    this.loadingService.show();
    try {
      return await firstValueFrom(this.http.get<any>(`${this.apiUrl}/${id}`));
    } catch (error: any) {
      this.mensagemService.showError('Erro ao obter frequência', error);
      throw error;
    } finally {
      this.loadingService.hide();
    }
  }

  /** GET /api/frequencias/data/{data}
  * Retorna todas as frequências [Presentes + Ausentes] para o dia informado
  *
  * Exemplo de uso com Observable:
  * this.frequenciaService.listarPorData('2025-05-17').subscribe({
  *   next: (data) => {
  *     this.frequenciasDoDia = data;
  *     console.log('Frequências do dia:', this.frequenciasDoDia);
  *   },
  *   error: (err) => {
  *     console.error('Erro ao carregar frequências do dia:', err);
  *   }
  * });
  */
  listarPorData(data: string): Observable<any[]> {
    this.loadingService.show();
    return this.http
      .get<any[]>(`${this.apiUrl}/data/${data}`)
      .pipe(finalize(() => this.loadingService.hide()));
  }

  /** GET /api/frequencias/data/{data}
  * Retorna todas as frequências [Presentes + Ausentes] para o dia informado (versão Promise)
  *
  * Exemplo de uso com Promise:
  * async carregarFrequenciasDoDia(data: string) {
  *   try {
  *     this.frequenciasDoDia = await this.frequenciaService.listarPorDataPromise(data);
  *   } catch (err) {
  *     console.error('Erro:', err);
  *   }
  * }
  */
  async listarPorDataPromise(data: string): Promise<any[]> {
    this.loadingService.show();
    try {
      return await firstValueFrom(
        this.http.get<any[]>(`${this.apiUrl}/data/${data}`)
      );
    } catch (error: any) {
      this.mensagemService.showError('Erro ao obter frequências por data', error);
      throw error;
    } finally {
      this.loadingService.hide();
    }
  }

  /** GET /api/frequencias/turmas/agrupadas/data/{data}
  * Retorna Agrupamento de Turmas e suas quantidades para o dia informado
  *
  * Exemplo de uso com Observable:
  * this.frequenciaService.listarTurmasAgrupadasPorData('2025-05-17').subscribe({
  *   next: (data) => {
  *     this.turmasAgrupadas = data;
  *     console.log('Turmas agrupadas por data:', this.turmasAgrupadas);
  *   },
  *   error: (err) => {
  *     console.error('Erro ao carregar turmas agrupadas:', err);
  *   }
  * });
  */
  listarTurmasAgrupadasPorData(data: string): Observable<any> {
    this.loadingService.show();

    return this.http
      .get<any[]>(`${this.apiUrl}/turmas/agrupadas/data/${data}`)
      .pipe(
        finalize(() => this.loadingService.hide()),
        catchError((error: any) => {
          if (error.status === 404) {
            const mensagem = error.error?.detail || 'Registro não encontrado.';
            this.mensagemService.showError(mensagem, error);
          } else if (error.status === 400) {
            const erros = error.error?.erros || ['Erro de validação.'];
            this.mensagemService.showError(erros.join('\n'), error);
          } else {
            this.mensagemService.showError('Erro inesperado.', error);
          }

          //return throwError(() => error); // dispara erro para quem consome
          return of({ dados: null }); // evita que o subscribe dispare erro, depende da lógica desejada
        })
      );
  }

  /** GET /api/frequencias/turmas/agrupadas/data/{data}
  * Retorna Agrupamento de Turmas e suas quantidades para o dia informado (versão Promise)
  *
  * Exemplo de uso com Promise:
  * async carregarTurmasAgrupadas(data: string) {
  *   try {
  *     this.turmasAgrupadas = await this.frequenciaService.listarTurmasAgrupadasPorDataPromise(data);
  *   } catch (err) {
  *     console.error('Erro:', err);
  *   }
  * }
  */
  async listarTurmasAgrupadasPorDataPromise(data: string): Promise<any[]> {
    this.loadingService.show();
    try {
      return await firstValueFrom(
        this.http.get<any[]>(`${this.apiUrl}/turmas/agrupadas/data/${data}`)
      );
    } catch (error: any) {
      this.mensagemService.showError('Erro ao obter turmas agrupadas por data', error);
      throw error;
    } finally {
      this.loadingService.hide();
    }
  }

  /** GET /api/frequencias/turmas/{codigoTurma}/data/{data}
  * Retorna todas as frequências [Presentes + Ausentes] das turma para o dia informado
  *
  * Exemplo de uso com Observable:
  * this.frequenciaService.listarPorTurmaEData(123, '2025-05-17').subscribe({
  *   next: (data) => {
  *     this.frequenciasTurma = data;
  *     console.log('Frequências da turma no dia:', this.frequenciasTurma);
  *   },
  *   error: (err) => {
  *     console.error('Erro ao carregar frequências da turma:', err);
  *   }
  * });
  */
  listarPorTurmaEData(codigoTurma: number, data: string): Observable<any[]> {
    this.loadingService.show();
    return this.http
      .get<any[]>(`${this.apiUrl}/turmas/${codigoTurma}/data/${data}`)
      .pipe(finalize(() => this.loadingService.hide()));
  }

  /** GET /api/frequencias/turmas/{codigoTurma}/data/{data}
  * Retorna todas as frequências [Presentes + Ausentes] das turma para o dia informado (versão Promise)
  *
  * Exemplo de uso com Promise:
  * async carregarFrequenciasTurma(codigoTurma: number, data: string) {
  *   try {
  *     this.frequenciasTurma = await this.frequenciaService.listarPorTurmaEDataPromise(codigoTurma, data);
  *   } catch (err) {
  *     console.error('Erro:', err);
  *   }
  * }
  */
  async listarPorTurmaEDataPromise(codigoTurma: number, data: string): Promise<any[]> {
    this.loadingService.show();
    try {
      return await firstValueFrom(
        this.http.get<any[]>(`${this.apiUrl}/turmas/${codigoTurma}/data/${data}`)
      );
    } catch (error: any) {
      this.mensagemService.showError('Erro ao obter frequências da turma por data', error);
      throw error;
    } finally {
      this.loadingService.hide();
    }
  }

  /** GET /api/frequencias/aluno/{codigoAluno}
  * Retorna todas as frequências do aluno
  *
  * Exemplo de uso com Observable:
  * this.frequenciaService.listarPorAluno(123).subscribe({
  *   next: (data) => {
  *     this.frequenciasAluno = data;
  *     console.log('Frequências do aluno:', this.frequenciasAluno);
  *   },
  *   error: (err) => {
  *     console.error('Erro ao carregar frequências do aluno:', err);
  *   }
  * });
  */
  listarPorAluno(codigoAluno: number): Observable<any[]> {
    this.loadingService.show();
    return this.http
      .get<any[]>(`${this.apiUrl}/aluno/${codigoAluno}`)
      .pipe(finalize(() => this.loadingService.hide()));
  }

  /** GET /api/frequencias/aluno/{codigoAluno}
  * Retorna todas as frequências do aluno (versão Promise)
  *
  * Exemplo de uso com Promise:
  * async carregarFrequenciasAluno(codigoAluno: number) {
  *   try {
  *     this.frequenciasAluno = await this.frequenciaService.listarPorAlunoPromise(codigoAluno);
  *   } catch (err) {
  *     console.error('Erro:', err);
  *   }
  * }
  */
  async listarPorAlunoPromise(codigoAluno: number): Promise<any[]> {
    this.loadingService.show();
    try {
      return await firstValueFrom(
        this.http.get<any[]>(`${this.apiUrl}/aluno/${codigoAluno}`)
      );
    } catch (error: any) {
      this.mensagemService.showError('Erro ao obter frequências do aluno', error);
      throw error;
    } finally {
      this.loadingService.hide();
    }
  }

  /** GET /api/frequencias/turmas/{codigoTurma}
  * Retorna todas as frequências da turma
  *
  * Exemplo de uso com Observable:
  * this.frequenciaService.listarPorTurma(123).subscribe({
  *   next: (data) => {
  *     this.frequenciasTurma = data;
  *     console.log('Frequências da turma:', this.frequenciasTurma);
  *   },
  *   error: (err) => {
  *     console.error('Erro ao carregar frequências da turma:', err);
  *   }
  * });
  */
  listarPorTurma(codigoTurma: number): Observable<any[]> {
    this.loadingService.show();
    return this.http
      .get<any[]>(`${this.apiUrl}/turmas/${codigoTurma}`)
      .pipe(finalize(() => this.loadingService.hide()));
  }

  /** GET /api/frequencias/turmas/{codigoTurma}
  * Retorna todas as frequências da turma (versão Promise)
  *
  * Exemplo de uso com Promise:
  * async carregarFrequenciasTurma(codigoTurma: number) {
  *   try {
  *     this.frequenciasTurma = await this.frequenciaService.listarPorTurmaPromise(codigoTurma);
  *   } catch (err) {
  *     console.error('Erro:', err);
  *   }
  * }
  */
  async listarPorTurmaPromise(codigoTurma: number): Promise<any[]> {
    this.loadingService.show();
    try {
      return await firstValueFrom(
        this.http.get<any[]>(`${this.apiUrl}/turmas/${codigoTurma}`)
      );
    } catch (error: any) {
      this.mensagemService.showError('Erro ao obter frequências da turma', error);
      throw error;
    } finally {
      this.loadingService.hide();
    }
  }

  /** GET /api/frequencias/alunos/{codigoAluno}/turmas/{codigoTurma}
  * Retorna todas as frequências do aluno e da turma
  *
  * Exemplo de uso com Observable:
  * this.frequenciaService.listarPorAlunoETurma(123, 456).subscribe({
  *   next: (data) => {
  *     this.frequenciasAlunoTurma = data;
  *     console.log('Frequências do aluno na turma:', this.frequenciasAlunoTurma);
  *   },
  *   error: (err) => {
  *     console.error('Erro ao carregar frequências do aluno na turma:', err);
  *   }
  * });
  */
  listarPorAlunoETurma(codigoAluno: number, codigoTurma: number): Observable<any[]> {
    this.loadingService.show();
    return this.http
      .get<any[]>(`${this.apiUrl}/alunos/${codigoAluno}/turmas/${codigoTurma}`)
      .pipe(finalize(() => this.loadingService.hide()));
  }

  /** GET /api/frequencias/alunos/{codigoAluno}/turmas/{codigoTurma}
  * Retorna todas as frequências do aluno e da turma (versão Promise)
  *
  * Exemplo de uso com Promise:
  * async carregarFrequenciasAlunoTurma(codigoAluno: number, codigoTurma: number) {
  *   try {
  *     this.frequenciasAlunoTurma = await this.frequenciaService.listarPorAlunoETurmaPromise(codigoAluno, codigoTurma);
  *   } catch (err) {
  *     console.error('Erro:', err);
  *   }
  * }
  */
  async listarPorAlunoETurmaPromise(codigoAluno: number, codigoTurma: number): Promise<any[]> {
    this.loadingService.show();
    try {
      return await firstValueFrom(
        this.http.get<any[]>(`${this.apiUrl}/alunos/${codigoAluno}/turmas/${codigoTurma}`)
      );
    } catch (error: any) {
      this.mensagemService.showError('Erro ao obter frequências do aluno na turma', error);
      throw error;
    } finally {
      this.loadingService.hide();
    }
  }

  /** POST /api/frequencias
  * Inclui um novo registro de frequência
  *
  * Exemplo de uso com Observable:
  * const novaFrequencia = { ... };
  * this.frequenciaService.incluir(novaFrequencia).subscribe({
  *   next: (response) => {
  *     console.log('Frequência incluída com sucesso:', response);
  *     this.carregarDados(); // Recarrega os dados
  *   },
  *   error: (err) => {
  *     console.error('Erro ao incluir frequência:', err);
  *   }
  * });
  */
  incluir(entity: any): Observable<any> {
    this.loadingService.show();
    return this.http.post<any>(this.apiUrl, entity).pipe(
      finalize(() => this.loadingService.hide())
    );
  }

  /** POST /api/frequencias
  * Inclui um novo registro de frequência (versão com Callback)
  *
  * Exemplo de uso com Callback:
  * const novaFrequencia = { ... };
  * this.frequenciaService.Incluir(novaFrequencia, (response) => {
  *   if (response) {
  *     console.log('Frequência incluída com sucesso!');
  *     this.carregarDados(); // Recarrega os dados
  *   } else {
  *     console.error('Falha ao incluir frequência');
  *   }
  * });
  */
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

  /** POST /api/frequencias
  * Inclui um novo registro de frequência (versão Promise)
  *
  * Exemplo de uso com Promise:
  * async salvarFrequencia() {
  *   try {
  *     const response = await this.frequenciaService.IncluirPromise(this.formFrequencia.value);
  *     console.log('Frequência incluída:', response);
  *     this.carregarDados(); // Recarrega os dados
  *   } catch (err) {
  *     console.error('Erro:', err);
  *   }
  * }
  */
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

  /** PUT /api/frequencias/{id}
  * Altera um registro de frequência existente
  *
  * Exemplo de uso com Observable:
  * const frequenciaAtualizada = { ... };
  * this.frequenciaService.alterar(123, frequenciaAtualizada).subscribe({
  *   next: (response) => {
  *     console.log('Frequência alterada com sucesso:', response);
  *     this.carregarDados(); // Recarrega os dados
  *   },
  *   error: (err) => {
  *     console.error('Erro ao alterar frequência:', err);
  *   }
  * });
  */
  alterar(id: number, entity: any): Observable<any> {
    this.loadingService.show();
    return this.http.put<any>(`${this.apiUrl}/${id}`, entity).pipe(
      finalize(() => this.loadingService.hide())
    );
  }

  /** PUT /api/frequencias/{id}
  * Altera um registro de frequência existente (versão com Callback)
  *
  * Exemplo de uso com Callback:
  * const frequenciaAtualizada = { ... };
  * this.frequenciaService.Alterar(123, frequenciaAtualizada, (response) => {
  *   if (response) {
  *     console.log('Frequência alterada com sucesso!');
  *     this.carregarDados(); // Recarrega os dados
  *   } else {
  *     console.error('Falha ao alterar frequência');
  *   }
  * });
  */
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

  /** PUT /api/frequencias/{id}
  * Altera um registro de frequência existente (versão Promise)
  *
  * Exemplo de uso com Promise:
  * async atualizarFrequencia() {
  *   try {
  *     const id = this.formFrequencia.value.id;
  *     const response = await this.frequenciaService.AlterarPromise(id, this.formFrequencia.value);
  *     console.log('Frequência atualizada:', response);
  *     this.carregarDados(); // Recarrega os dados
  *   } catch (err) {
  *     console.error('Erro:', err);
  *   }
  * }
  */
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

/* modelos de utilização das funções
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FrequenciaService } from 'path/to/frequencia.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-frequencia',
  templateUrl: './frequencia.component.html',
  styleUrls: ['./frequencia.component.scss']
})
export class FrequenciaComponent implements OnInit, OnDestroy {
  frequencias: any[] = [];
  frequenciaDetalhe: any;
  turmasAgrupadas: any[] = [];

  private subscriptions: Subscription = new Subscription();

  constructor(private frequenciaService: FrequenciaService) { }

  ngOnInit(): void {
    /// Você pode iniciar com uma dessas chamadas
    this.carregarTodasFrequencias();
    /// OU
    /// this.carregarTodasFrequenciasPromise();
  }

  ngOnDestroy(): void {
    /// Certifique-se de cancelar todas as assinaturas ao destruir o componente
    this.subscriptions.unsubscribe();
  }

  /// EXEMPLO 1: GET /api/frequencias - Listar todos

  /// Usando Observable
  carregarTodasFrequencias(): void {
    const sub = this.frequenciaService.listarTodos()
      .subscribe({
        next: (data) => {
          this.frequencias = data;
          console.log('Frequências carregadas:', this.frequencias);
        },
        error: (err) => {
          console.error('Erro ao carregar frequências:', err);
        }
      });

    this.subscriptions.add(sub);
  }

  /// Usando Promise
  async carregarTodasFrequenciasPromise(): Promise<void> {
    try {
      this.frequencias = await this.frequenciaService.listarTodosPromise();
      console.log('Frequências carregadas (Promise):', this.frequencias);
    } catch (err) {
      console.error('Erro ao carregar frequências (Promise):', err);
    }
  }

  /// EXEMPLO 2: GET /api/frequencias/{id} - Obter por ID

  /// Usando Observable
  carregarFrequenciaPorId(id: number): void {
    const sub = this.frequenciaService.obterPorId(id)
      .subscribe({
        next: (data) => {
          this.frequenciaDetalhe = data;
          console.log('Frequência detalhada:', this.frequenciaDetalhe);
        },
        error: (err) => {
          console.error('Erro ao carregar detalhe da frequência:', err);
        }
      });

    this.subscriptions.add(sub);
  }

  /// Usando Promise
  async carregarFrequenciaPorIdPromise(id: number): Promise<void> {
    try {
      this.frequenciaDetalhe = await this.frequenciaService.obterPorIdPromise(id);
      console.log('Frequência detalhada (Promise):', this.frequenciaDetalhe);
    } catch (err) {
      console.error('Erro ao carregar detalhe da frequência (Promise):', err);
    }
  }

  /// EXEMPLO 3: POST /api/frequencias - Incluir

  /// Usando Observable
  salvarFrequencia(frequenciaData: any): void {
    const sub = this.frequenciaService.incluir(frequenciaData)
      .subscribe({
        next: (response) => {
          console.log('Frequência salva com sucesso:', response);
          /// Recarregar a lista após salvar
          this.carregarTodasFrequencias();
        },
        error: (err) => {
          console.error('Erro ao salvar frequência:', err);
        }
      });

    this.subscriptions.add(sub);
  }

  /// Usando callback
  salvarFrequenciaCallback(frequenciaData: any): void {
    this.frequenciaService.Incluir(frequenciaData, (response: any) => {
      if (response) {
        console.log('Frequência salva com sucesso (callback):', response);
        /// Recarregar a lista após salvar
        this.carregarTodasFrequencias();
      }
    });
  }

  /// Usando Promise
  async salvarFrequenciaPromise(frequenciaData: any): Promise<void> {
    try {
      const response = await this.frequenciaService.IncluirPromise(frequenciaData);
      console.log('Frequência salva com sucesso (Promise):', response);
      /// Recarregar a lista após salvar
      await this.carregarTodasFrequenciasPromise();
    } catch (err) {
      console.error('Erro ao salvar frequência (Promise):', err);
    }
  }

  /// EXEMPLO 4: PUT /api/frequencias/{id} - Alterar

  /// Usando Observable
  atualizarFrequencia(id: number, frequenciaData: any): void {
    const sub = this.frequenciaService.alterar(id, frequenciaData)
      .subscribe({
        next: (response) => {
          console.log('Frequência atualizada com sucesso:', response);
          /// Recarregar a lista ou detalhe após atualizar
          this.carregarFrequenciaPorId(id);
        },
        error: (err) => {
          console.error('Erro ao atualizar frequência:', err);
        }
      });

    this.subscriptions.add(sub);
  }

  /// Usando callback
  atualizarFrequenciaCallback(id: number, frequenciaData: any): void {
    this.frequenciaService.Alterar(id, frequenciaData, (response: any) => {
      if (response) {
        console.log('Frequência atualizada com sucesso (callback):', response);
        /// Recarregar a lista ou detalhe após atualizar
        this.carregarFrequenciaPorId(id);
      }
    });
  }

  /// Usando Promise
  async atualizarFrequenciaPromise(id: number, frequenciaData: any): Promise<void> {
    try {
      const response = await this.frequenciaService.AlterarPromise(id, frequenciaData);
      console.log('Frequência atualizada com sucesso (Promise):', response);
      /// Recarregar a lista ou detalhe após atualizar
      await this.carregarFrequenciaPorIdPromise(id);
    } catch (err) {
      console.error('Erro ao atualizar frequência (Promise):', err);
    }
  }

  /// EXEMPLO 5: GET /api/frequencias/data/{data} - Listar por Data

  /// Usando Observable
  carregarFrequenciasPorData(data: string): void {
    const sub = this.frequenciaService.listarPorData(data)
      .subscribe({
        next: (data) => {
          this.frequencias = data;
          console.log('Frequências por data:', this.frequencias);
        },
        error: (err) => {
          console.error('Erro ao carregar frequências por data:', err);
        }
      });

    this.subscriptions.add(sub);
  }

  /// Usando Promise
  async carregarFrequenciasPorDataPromise(data: string): Promise<void> {
    try {
      this.frequencias = await this.frequenciaService.listarPorDataPromise(data);
      console.log('Frequências por data (Promise):', this.frequencias);
    } catch (err) {
      console.error('Erro ao carregar frequências por data (Promise):', err);
    }
  }

  /// EXEMPLO 6: GET /api/frequencias/turmas/agrupadas/data/{data} - Listar Turmas Agrupadas

  /// Usando Observable
  carregarTurmasAgrupadasPorData(data: string): void {
    const sub = this.frequenciaService.listarTurmasAgrupadasPorData(data)
      .subscribe({
        next: (data) => {
          this.turmasAgrupadas = data;
          console.log('Turmas agrupadas por data:', this.turmasAgrupadas);
        },
        error: (err) => {
          console.error('Erro ao carregar turmas agrupadas:', err);
        }
      });

    this.subscriptions.add(sub);
  }

  /// Usando Promise
  async carregarTurmasAgrupadasPorDataPromise(data: string): Promise<void> {
    try {
      this.turmasAgrupadas = await this.frequenciaService.listarTurmasAgrupadasPorDataPromise(data);
      console.log('Turmas agrupadas por data (Promise):', this.turmasAgrupadas);
    } catch (err) {
      console.error('Erro ao carregar turmas agrupadas (Promise):', err);
    }
  }

  /// Exemplo de método que poderia ser chamado através de um evento de botão ou formulário
  onSubmitForm(formData: any): void {
    if (formData.id) {
      // Se tem ID, é uma atualização
      this.atualizarFrequencia(formData.id, formData);
      // OU
      // this.atualizarFrequenciaCallback(formData.id, formData);
      // OU
      // this.atualizarFrequenciaPromise(formData.id, formData);
    } else {
      // Se não tem ID, é uma inclusão
      this.salvarFrequencia(formData);
      // OU
      // this.salvarFrequenciaCallback(formData);
      // OU
      // this.salvarFrequenciaPromise(formData);
    }
  }

  /// Exemplo de método chamado ao selecionar uma data
  onDataSelecionada(data: string): void {
    // Carrega as frequências da data selecionada
    this.carregarFrequenciasPorData(data);
    // E também carrega o agrupamento de turmas
    this.carregarTurmasAgrupadasPorData(data);
  }
}*/
