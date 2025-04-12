import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { finalize, firstValueFrom, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoadingService } from '../../services/loading.service';
import { MensagemService } from '../../services/mensagem.service';
import * as types from './crianca.types';

@Injectable({
  providedIn: 'root', // Isso garante que o serviço seja singleton no root injector
})
export class CriancaService {
  private apiUrl = `${environment.API_TRILHAR}/aluno`; // URL da API

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService,
    private mensagemService: MensagemService,
  ) { }

  listarTodos(): Observable<any> {
    this.loadingService.show(); // Exibe o indicador de carregamento
    return this.http
      .get(`${this.apiUrl}`)
      .pipe(finalize(() => this.loadingService.hide())); // Oculta o indicador de carregamento ao finalizar
  }

  async listarTodosPromise(): Promise<any> {
    this.loadingService.show(); // Exibe o indicador de carregamento
    try {
      const response = await firstValueFrom(
        this.http.get(`${this.apiUrl}`)
      );
      return response; // Retorna a resposta da API
    } catch (error: any) {
      this.mensagemService.showError('Erro ao listar todos os registros', error);
      console.error('Erro ao listar todos os registros:', error);
      throw error; // Propaga o erro
    } finally {
      this.loadingService.hide(); // Oculta o indicador de carregamento
    }
  }

  listarPorId(Id: string): Observable<any> {
    this.loadingService.show();
    return this.http
      .get(`${this.apiUrl}/${Id}`)
      .pipe(finalize(() => this.loadingService.hide()));
  }

  async listarPorIdPromise(Id: string): Promise<any> {
    this.loadingService.show(); // Exibe o indicador de carregamento
    try {
      const response = await firstValueFrom(
        this.http.get<any>(`${this.apiUrl}/${Id}`)
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

  listarPorFiltro(filtro: types.IAlunoInput, callback?: (resp: any) => void): void {
    const params = this.buildHttpParams(filtro);

    this.loadingService.show(); // Exibe o indicador de carregamento
    this.http.get(`${this.apiUrl}/listarPorFiltro`, { params }).subscribe({
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

  async listarPorFiltroPromise(filtro: types.IAlunoInput): Promise<any> {
    const params = this.buildHttpParams(filtro);

    this.loadingService.show();
    try {
      const response = await firstValueFrom(
        this.http.get(`${this.apiUrl}/listarPorFiltro`, { params })
      );
      return response; // Retorna a resposta da API
    } catch (error: any) {
      this.mensagemService.showError('Erro ao listar por filtro', error);
      console.error('Erro ao listar por filtro:', error);
      throw error; // Propaga o erro
    } finally {
      this.loadingService.hide();
    }
  }

  listarPorCodigoCadastro(codigoCadastro: string): Observable<any> {
    this.loadingService.show();
    return this.http
      .get(`${this.apiUrl}/CodigoCadastro/${codigoCadastro}`)
      .pipe(finalize(() => this.loadingService.hide()));
  }

  async listarPorCodigoCadastroPromise(codigoCadastro: string): Promise<any> {
    this.loadingService.show(); // Exibe o indicador de carregamento
    try {
      const response = await firstValueFrom(
        this.http.get(`${this.apiUrl}/CodigoCadastro/${codigoCadastro}`)
      );
      return response; // Retorna a resposta da API
    } catch (error: any) {
      this.mensagemService.showError('Erro ao buscar por Codigo do Cadastro', error);
      console.error('Erro ao buscar por Codigo do Cadastro:', error);
      throw error; // Propaga o erro
    } finally {
      this.loadingService.hide(); // Oculta o indicador de carregamento
    }
  }

  Incluir(Entity: types.IAlunoEntity, callback?: any) {
    this.http.post(`${this.apiUrl}`, Entity).subscribe((resp: any) => {
      this.mensagemService.showSuccess('Registro incluído com sucesso!');
      callback(resp);
    });
  }

  Alterar(Entity: types.IAlunoEntity, Id: any, callback?: any) {
    this.http.put(`${this.apiUrl}/${Id}`, Entity).subscribe((resp: any) => {
      this.mensagemService.showSuccess('Registro alterado com sucesso!');
      callback(resp);
    });
  }

  private buildHttpParams(filtro: types.IAlunoInput): HttpParams {
    let params = new HttpParams();

    if (filtro.codigo) {
      params = params.set('codigo', filtro.codigo.toString());
    }
    if (filtro.codigoCadastro) {
      params = params.set('codigoCadastro', filtro.codigoCadastro);
    }
    if (filtro.nomeCrianca) {
      params = params.set('nomeCrianca', filtro.nomeCrianca);
    }
    if (filtro.dataNascimento) {
      params = params.set('dataNascimento', filtro.dataNascimento.toISOString());
    }
    if (filtro.nomeMae) {
      params = params.set('nomeMae', filtro.nomeMae);
    }
    if (filtro.nomePai) {
      params = params.set('nomePai', filtro.nomePai);
    }
    if (filtro.outroResponsavel) {
      params = params.set('outroResponsavel', filtro.outroResponsavel);
    }
    if (filtro.telefone) {
      params = params.set('telefone', filtro.telefone);
    }
    if (filtro.enderecoEmail) {
      params = params.set('enderecoEmail', filtro.enderecoEmail);
    }
    if (filtro.alergia) {
      params = params.set('alergia', filtro.alergia.toString());
    }
    if (filtro.descricaoAlergia) {
      params = params.set('descricaoAlergia', filtro.descricaoAlergia);
    }
    if (filtro.restricaoAlimentar) {
      params = params.set('restricaoAlimentar', filtro.restricaoAlimentar.toString());
    }
    if (filtro.descricaoRestricaoAlimentar) {
      params = params.set('descricaoRestricaoAlimentar', filtro.descricaoRestricaoAlimentar);
    }
    if (filtro.deficienciaOuSituacaoAtipica) {
      params = params.set('deficienciaOuSituacaoAtipica', filtro.deficienciaOuSituacaoAtipica.toString());
    }
    if (filtro.descricaoDeficiencia) {
      params = params.set('descricaoDeficiencia', filtro.descricaoDeficiencia);
    }
    if (filtro.batizado) {
      params = params.set('batizado', filtro.batizado.toString());
    }
    if (filtro.dataBatizado) {
      params = params.set('dataBatizado', filtro.dataBatizado.toISOString());
    }
    if (filtro.igrejaBatizado) {
      params = params.set('igrejaBatizado', filtro.igrejaBatizado);
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
