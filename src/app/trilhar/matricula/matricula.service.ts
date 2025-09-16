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

  async listarTodosPromise(): Promise<any> {
    return this.http.get<any>(`${this.apiUrl}`).toPromise();
  }

    listarPorFiltro(filtro: any, callback?: (resp: any) => void): void {
      const params = this.buildHttpParams(filtro);
      // Criando os headers com no-cache
      const headers = new HttpHeaders({
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      });

      this.loadingService.show(); // Exibe o indicador de carregamento
      this.http.get(`${this.apiUrl}/filtro`, {
            params,
            headers // Adicionando os headers
          }
        ).subscribe({
        next: (resp: any) => {
          if (callback) {
            callback(resp); // Chama o callback apenas se ele estiver definido
          }
        },
        error: (err: any) => {
          console.error('Erro ao listar por filtro:', err);
          this.mensagemService.showError('Erro ao listar por filtro', err); // Exibe uma mensagem de erro
        },
        complete: () => {
          this.loadingService.hide(); // Oculta o indicador de carregamento ao finalizar
        },
      });
    }

    // async listarPorFiltroPromise(filtro: types.IAlunoInput): Promise<any> {
    //   const params = this.buildHttpParams(filtro);

    //   this.loadingService.show();
    //   try {
    //     const response = await firstValueFrom(
    //       this.http.get(`${this.apiUrl}/filtro`, { params })
    //     );
    //     return response; // Retorna a resposta da API
    //   } catch (error: any) {
    //     this.mensagemService.showError('Erro ao listar por filtro', error);
    //     console.error('Erro ao listar por filtro:', error);
    //     throw error; // Propaga o erro
    //   } finally {
    //     this.loadingService.hide();
    //   }
    // }

    async listarPorFiltroPromise(filtro: any): Promise<any> {
      const params = this.buildHttpParams(filtro);

      // Criando os headers com no-cache
      const headers = new HttpHeaders({
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      });

      this.loadingService.show();

      try {
        const response = await firstValueFrom(
          this.http.get(`${this.apiUrl}/filtro`, {
            params,
            headers // Adicionando os headers
          })
        );
        return response;
      } catch (error: any) {
        this.mensagemService.showError('Erro ao listar por filtro', error);
        console.error('Erro ao listar por filtro:', error);
        throw error;
      } finally {
        this.loadingService.hide();
      }
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

  private buildHttpParams(filtro: any): HttpParams {
    let params = new HttpParams();

    if (filtro.codigo) {
      params = params.set('codigo', filtro.codigo.toString());
    }
    if (filtro.codigoAluno) {
      params = params.set('codigoAluno', filtro.CodigoAluno.toString());
    }
    if (filtro.codigoTurma) {
      params = params.set('codigoTurma', filtro.codigoTurma.toString());
    }
    if (filtro.ativo) {
      params = params.set('ativo', filtro.ativo.toString());
    }
    if (filtro.codigoUsuarioLogado) {
      params = params.set('codigoUsuarioLogado', filtro.codigoUsuarioLogado.toString());
    }
    if (filtro.dataAtualizacao) {
      params = params.set('dataAtualizacao', filtro.dataAtualizacao.toISOString());
    }
    if (filtro.dataCadastro) {
      params = params.set('dataCadastro', filtro.dataCadastro.toISOString());
    }
    if (filtro.alunoCodigoCadastro) {
      params = params.set('alunocodigoCadastro', filtro.alunocodigoCadastro.toString());
    }
    if (filtro.alunoNomeCrianca) {
      params = params.set('alunoNomeCrianca', filtro.alunoNomeCrianca.toString());
    }
    if (filtro.alunoDataNascimento) {
      params = params.set('alunoDataNascimento', filtro.alunoDataNascimento.toISOString());
    }
    if (filtro.alunoNomeMae) {
      params = params.set('alunoNomeMae', filtro.alunoNomeMae.toString());
    }
    if (filtro.alunoNomePai) {
      params = params.set('alunoNomePai', filtro.alunoNomePai.toString());
    }
    if (filtro.alunoOutroResponsavel) {
      params = params.set('alunoOutroResponsavel', filtro.alunoOutroResponsavel.toString());
    }
    if (filtro.alunoTelefone) {
      params = params.set('alunoTelefone', filtro.alunoTelefone.toString());
    }
    if (filtro.alunoEnderecoEmail) {
      params = params.set('alunoEnderecoEmail', filtro.alunoEnderecoEmail.toString());
    }
    if (filtro.alunoAlergia) {
      params = params.set('alunoAlergia', filtro.alunoAlergia.toString());
    }
    if (filtro.alunoDescricaoAlergia) {
      params = params.set('alunoDescricaoAlergia', filtro.alunoDescricaoAlergia.toString());
    }
    if (filtro.alunoRestricaoAlimentar) {
      params = params.set('alunoRestricaoAlimentar', filtro.alunoRestricaoAlimentar.toString());
    }
    if (filtro.alunoDescricaoRestricaoAlimentar) {
      params = params.set('alunoDescricaoRestricaoAlimentar', filtro.alunoDescricaoRestricaoAlimentar.toString());
    }
    if (filtro.alunoDeficienciaOuSituacaoAtipica) {
      params = params.set('alunoDeficienciaOuSituacaoAtipica', filtro.alunoDeficienciaOuSituacaoAtipica.toString());
    }
    if (filtro.alunoDescricaoDeficiencia) {
      params = params.set('alunoDescricaoDeficiencia', filtro.alunoDescricaoDeficiencia.toString());
    }
    if (filtro.alunoBatizado) {
      params = params.set('alunoBatizado', filtro.alunoBatizado.toString());
    }
    if (filtro.alunoDataBatizado) {
      params = params.set('alunoDataBatizado', filtro.alunoDataBatizado.toISOString());
    }
    if (filtro.alunoIgrejaBatizado) {
      params = params.set('alunoIgrejaBatizado', filtro.alunoIgrejaBatizado.toString());
    }
    if (filtro.alunoAtivo) {
      params = params.set('alunoAtivo', filtro.alunoAtivo.toString());
    }
    if (filtro.turmaDescricao) {
      params = params.set('turmaDescricao', filtro.turmaDescricao.toString());
    }
    if (filtro.turmaIdadeInicialAluno) {
      params = params.set('turmaIdadeInicialAluno', filtro.turmaIdadeInicialAluno.toString());
    }
    if (filtro.turmaIdadeFinalAluno) {
      params = params.set('turmaIdadeFinalAluno', filtro.turmaIdadeFinalAluno.toString());
    }
    if (filtro.turmaAnoLetivo) {
      params = params.set('turmaAnoLetivo', filtro.turmaAnoLetivo.toString());
    }
    if (filtro.turmaSemestreLetivo) {
      params = params.set('turmaSemestreLetivo', filtro.turmaSemestreLetivo.toString());
    }
    if (filtro.turmaAtivo) {
      params = params.set('turmaAtivo', filtro.turmaAtivo.toString());
    }
    if (filtro.dataNascimentoInicial) {
      params = params.set('dataNascimentoInicial', filtro.dataNascimentoInicial.toISOString());
    }
    if (filtro.dataNascimentoFinal) {
      params = params.set('dataNascimentoFinal', filtro.dataNascimentoFinal.toISOString());
    }
    if (filtro.dataBatizadoInicial) {
      params = params.set('dataBatizadoInicial', filtro.dataBatizadoInicial.toISOString());
    }
    if (filtro.dataBatizadoFinal) {
      params = params.set('dataBatizadoFinal', filtro.dataBatizadoFinal.toISOString());
    }
    if (filtro.dataAtualizacaoInicial) {
      params = params.set('dataAtualizacaoInicial', filtro.dataAtualizacaoInicial.toISOString());
    }
    if (filtro.dataAtualizacaoFinal) {
      params = params.set('dataAtualizacaoFinal', filtro.dataAtualizacaoFinal.toISOString());
    }
    if (filtro.dataCadastroInicial) {
      params = params.set('dataCadastroInicial', filtro.dataCadastroInicial.toISOString());
    }
    if (filtro.dataCadastroFinal) {
      params = params.set('dataCadastroFinal', filtro.dataCadastroFinal.toISOString());
    }
    if (filtro.page) {
      params = params.set('page', filtro.page.toString());
    }
    if (filtro.pageSize) {
      params = params.set('pageSize', filtro.pageSize.toString());
    }
    if (filtro.isPaginacao !== undefined) {
      params = params.set('isPaginacao', filtro.isPaginacao.toString());
    }


    return params;
  }

}
