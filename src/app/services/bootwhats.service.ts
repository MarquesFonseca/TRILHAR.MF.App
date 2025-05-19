import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { LoadingService } from '../services/loading.service';
import { MensagemService } from '../services/mensagem.service';

// Interfaces para os modelos de dados
export interface MensagemWhatsApp {
  numeroTelefone: string;
  textoMenagem: string; // Mantive o nome do campo como está na API, mesmo com erro ortográfico
  fileBase64: string;
}

export interface BootWhatsPayload {
  identificadorDestino: string;
  distribuir: boolean;
  mensagens: MensagemWhatsApp[];
}

export interface BootWhatsResponse {
  //success: boolean;
  //message: string;
  //data?: any;
  solicitacaoId: string;
}

@Injectable({
  providedIn: 'root'
})
export class BootWhatsService {
  private readonly apiUrl = 'https://api.tinsweb.com.br/BootWhats/Mensagem/Enviar';
  private readonly username = '31dadcef-6ff6-4d38-a7c2-b313048c008e'; // Substitua pelo username real
  private readonly password = '+iXr82wkFMV9p3WYZLQs0Q==';    // Substitua pela senha real
  private readonly identificadorPadrao = 'MARQUES-PC'; // Identificador padrão, pode ser alterado por parâmetro

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService,
    private mensagemService: MensagemService
  ) {}

  /**
   * Cria o cabeçalho HTTP com autenticação Basic Auth
   */
  private createHeaders(): HttpHeaders {
    const authString = `${this.username}:${this.password}`;
    const encodedAuth = btoa(authString); // Codifica em base64

    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Basic ${encodedAuth}`
    });
  }

  /**
   * Envia uma ou mais mensagens pelo BootWhats
   *
   * Exemplo de uso:
   *
   * // Enviando uma única mensagem
   * this.bootWhatsService.enviarMensagens('63992906960', 'Olá, tudo bem?')
   *   .subscribe({
   *     next: (response) => console.log('Mensagem enviada!', response),
   *     error: (err) => console.error('Erro ao enviar mensagem', err)
   *   });
   *
   * // Enviando múltiplas mensagens
   * const mensagens = [
   *   { numeroTelefone: '63992906960', textoMenagem: 'Olá, tudo bem?' },
   *   { numeroTelefone: '63992082269', textoMenagem: 'Reunião amanhã às 14h' }
   * ];
   * this.bootWhatsService.enviarMensagens(mensagens)
   *   .subscribe({
   *     next: (response) => console.log('Mensagens enviadas!', response),
   *     error: (err) => console.error('Erro ao enviar mensagens', err)
   *   });
   */
  enviarMensagens(
    telOrMensagens: string | MensagemWhatsApp[],
    texto?: string,
    identificadorDestino: string = this.identificadorPadrao,
    distribuir: boolean = false
  ): Observable<BootWhatsResponse> {
    this.loadingService.show();

    // Preparar o array de mensagens
    let mensagens: MensagemWhatsApp[];

    if (typeof telOrMensagens === 'string' && texto) {
      // Caso 1: enviando uma única mensagem
      mensagens = [{
        numeroTelefone: this.formatarNumeroTelefone(telOrMensagens),
        textoMenagem: texto,
        fileBase64: ''
      }];
    } else if (Array.isArray(telOrMensagens)) {
      // Caso 2: enviando múltiplas mensagens
      mensagens = telOrMensagens.map(msg => ({
        numeroTelefone: this.formatarNumeroTelefone(msg.numeroTelefone),
        textoMenagem: msg.textoMenagem,
        fileBase64: msg.fileBase64 || ''
      }));
    } else {
      throw new Error('Parâmetros inválidos. Forneça um número de telefone e texto ou um array de mensagens.');
    }

    // Montar o payload
    const payload: BootWhatsPayload = {
      identificadorDestino,
      distribuir,
      mensagens
    };

    // Enviar a requisição
    return this.http.post<BootWhatsResponse>(
      this.apiUrl,
      payload,
      { headers: this.createHeaders() }
    ).pipe(
      catchError(error => {
        this.mensagemService.showError('Erro ao enviar mensagem(ns) via WhatsApp', error);
        return throwError(() => error);
      }),
      finalize(() => this.loadingService.hide())
    );
  }

  /**
   * Versão Promise do método enviarMensagens
   *
   * Exemplo de uso:
   *
   * async enviarMensagemWhatsApp() {
   *   try {
   *     const response = await this.bootWhatsService.enviarMensagensPromise(
   *       '63992906960',
   *       'Olá, tudo bem?'
   *     );
   *     console.log('Mensagem enviada com sucesso!', response);
   *   } catch (error) {
   *     console.error('Erro ao enviar mensagem', error);
   *   }
   * }
   */
  async enviarMensagensPromise(
    telOrMensagens: string | MensagemWhatsApp[],
    texto?: string,
    identificadorDestino: string = this.identificadorPadrao,
    distribuir: boolean = false
  ): Promise<BootWhatsResponse> {
    try {
      return await new Promise((resolve, reject) => {
        this.enviarMensagens(telOrMensagens, texto, identificadorDestino, distribuir)
          .subscribe({
            next: (response) => resolve(response),
            error: (error) => reject(error)
          });
      });
    } catch (error) {
      console.error('Erro ao enviar mensagens via WhatsApp:', error);
      throw error;
    }
  }

  /**
   * Formata o número de telefone, removendo caracteres não numéricos e adicionando o código do país se necessário
   */
  private formatarNumeroTelefone(telefone: string): string {
    // Remove caracteres não numéricos
    let numero = telefone.replace(/\D/g, '');

    // Verifica se já tem o código do país
    if (!numero.startsWith('55')) {
      // Adiciona o código do Brasil
      numero = '55' + numero;
    }

    // Verifica se tem o DDD (considerando que um número brasileiro tem no mínimo 10 dígitos com DDD)
    if (numero.length < 12) {
      console.warn('Número de telefone possivelmente inválido:', telefone);
    }

    return numero;
  }

  /**
   * Envia uma mensagem com arquivo anexo (base64)
   *
   * Exemplo de uso:
   *
   * // Enviar uma mensagem com um arquivo PDF codificado em base64
   * this.bootWhatsService.enviarMensagemComAnexo(
   *   '63992906960',
   *   'Segue o relatório solicitado',
   *   pdfBase64String
   * ).subscribe({
   *   next: (response) => console.log('Mensagem com anexo enviada!', response),
   *   error: (err) => console.error('Erro ao enviar mensagem com anexo', err)
   * });
   */
  enviarMensagemComAnexo(
    telefone: string,
    texto: string,
    arquivoBase64: string,
    identificadorDestino: string = this.identificadorPadrao
  ): Observable<BootWhatsResponse> {
    const mensagem: MensagemWhatsApp = {
      numeroTelefone: this.formatarNumeroTelefone(telefone),
      textoMenagem: texto,
      fileBase64: arquivoBase64
    };

    return this.enviarMensagens([mensagem], undefined, identificadorDestino);
  }
}
