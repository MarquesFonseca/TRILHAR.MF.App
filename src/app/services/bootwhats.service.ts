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
  private readonly identificadorPadrao = 'MARQUES-PC'; // MARQUES-PC - Identificador padrão, pode ser alterado por parâmetro

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

  geraImagemMinisterioTrilhar(): string {
    var retorno = '/9j/4AAQSkZJRgABAgAAAQABAAD//gAEKgD/4gIcSUNDX1BST0ZJTEUAAQEAAAIMbGNtcwIQAABtbnRyUkdCIFhZWiAH3AABABkAAwApADlhY3NwQVBQTAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA9tYAAQAAAADTLWxjbXMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAApkZXNjAAAA/AAAAF5jcHJ0AAABXAAAAAt3dHB0AAABaAAAABRia3B0AAABfAAAABRyWFlaAAABkAAAABRnWFlaAAABpAAAABRiWFlaAAABuAAAABRyVFJDAAABzAAAAEBnVFJDAAABzAAAAEBiVFJDAAABzAAAAEBkZXNjAAAAAAAAAANjMgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB0ZXh0AAAAAEZCAABYWVogAAAAAAAA9tYAAQAAAADTLVhZWiAAAAAAAAADFgAAAzMAAAKkWFlaIAAAAAAAAG+iAAA49QAAA5BYWVogAAAAAAAAYpkAALeFAAAY2lhZWiAAAAAAAAAkoAAAD4QAALbPY3VydgAAAAAAAAAaAAAAywHJA2MFkghrC/YQPxVRGzQh8SmQMhg7kkYFUXdd7WtwegWJsZp8rGm/fdPD6TD/';
    retorno += '///bAEMABQMEBAQDBQQEBAUFBQYHDAgHBwcHDwsLCQwRDxISEQ8RERMWHBcTFBoVEREYIRgaHR0fHx8TFyIkIh4kHB4fHv/bAEMBBQUFBwYHDggIDh4UERQeHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHv/CABEIAScBJwMAIgABEQECEQH/xAAcAAEAAgMBAQEAAAAAAAAAAAAABQYDBAcCAQj/xAAaAQEAAgMBAAAAAAAAAAAAAAAAAwQBAgUG/8QAGgEBAAIDAQAAAAAAAAAAAAAAAAMEAQIFBv/aAAwDAAABEQIRAAAB7KAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA1YHWS0NfY2jAAAAAAAAAAAAA06Zv0in3uj2DkPXpqATUBX8bw9Q0cnM9nbM9d2ZaOLqvGupb1Y77v6lzg+Nv74I3f0M+M7ErD72cTCnyWlieVDZxmzPHuSsAAAAI3GYWie/HM9nj6Vzn5nXsvunWno+S2Kpl0dLHO8kto8/13iR1tLDbsldx5jnfcBhzH0CvVCV30z+LDGaS4bZS/W0Pn15ww9DMtGpNQm7fGSd/ywbwAAANDfYzymO6xyfn+s8bupOazR+TQ86y+oW7Q2dcejv5NZscVKw+JJizVm+Tcud5F2fk01CpXmpTFbuW+s6EzvTi46RiIejL7ulK7wdSIXqeI3N7859ZPMpyLoBfgAAAa3Jewcjqd3Xs9Yt0N+o4JLTh6PXaDZqpd83DWKu3mHp0aCsMJB1ZW/wDN+hz8i3ci69yObn1aWi5Sl6joqj61jh5IyxVqHqbVkrdm2h6b8+/On4us0PqenyJeadXjZTlS7GX5oeqqyLFl2AAOV9UqMHRo3p55/rYjax521xjsVqtcGidDqvR9oqFTu6t4OMdRlm9dR7w2r8rkOiI7fNZ+1ttGLKlo0+x7rSb59wZ9ocVfsmvlryMduxZyQUzhlxj3oaS1ZxsAAjcEy131KP0PHrNUPUP5pc/d24+xZjlIeMp03obJ9ruOt0b7koczBxZ/X1sPO1lJKnbHU5ty2YjW6djYrMB7p+ntN05BaMcC74oaPtV9uRrOTg2Lhjp+DoR7tppltizMDtQgAAK/YKzrrT9iK3eZQnJ2rzfSv0Lxo7FL1vr7qZoObuzlYnKdWWhZOuYpS+3GOlRuVNsdMudjw1/NLvfZmEyVeBYNqJ2qDyyZdMyGPBhw+9Cp9879cOjGAAAxZRxb31jlNev5sdOlZJdKPtdf16kd9+eK8u5709iGpOwuTDrBJeY/cn58ni0tq3br6T0ouz5zxe7Wp7uzp5q+m5s5JvXWvSVosFvTDnOhGGQAAACk3YcmsN4+H5/vdxkzkG91McXiO/tc6XJ+ys45nUe9arHEbjfNs4vZ+gs54lbr+w/Otm6hta5z+zfAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH//xAAsEAACAgICAQIFAwUBAAAAAAACAwEEAAUREhMGEBQgITA0FTEzIiM1QIAy/9oACAEAAAEFAv8AldzQUJbuoMpaty/9qy8K62byz31WzVe+bfnPt6YbIW9rdZ3C9aqklkNUvcQyP1QOzdnykNks7S9oyddG1TIL2QxlOwFpP3/UMz0zXn4tv8m2tShVwmMfVOTGmzw7PYflP/g0s9tUjXKVH6QjxWNctxHQXFuaCYXXCulo0FlNdQ0UM24CVfZKeg9uuJRtklkTBR9r1BHKcIvG2Nxru0TEx7b5Bmq0a8qCUDY58L2eYij+mjsvBqj2NosVtbi5HdIdXdfeckRHOIsPrnsbQv1uczHv6XcTKH2dg6UVmEbGe0xHHpUymg5q0ge5qRNnd1yFlq1ypsPDKJc1sMxDO2WJ4XM9GTJyaNFaOLdRlRuV2zCsZJYHp7+0WguSVCqFSv8AZup8yX03qnDnqLKjvgq9q3VTauNt+1r6ZH7Uh4DKf9Lc9M1Fty4sWVbi5x7B8fp3rBWtrGOe13tM8bDNWEM3Ht8XW8ubTeRWs6fZBfD570dq2T9Y/wDfp/CmBilqbVlN7XfD2srqj4DInrYz0t/iWRyu3+TbLuHcjHtJHGouSvLU9bGaL67vN0bV6ryRx6c2c2w2B+bZeltfYrz89n8dkdWZqg8uhyx+PVmJrb387KKu/p/G89RmCH0v/jf3yz/OX40czW0XwatftLgivLH89SZ8ei/zGfvhaPVd9Im3V2rUXB3cWRwGCXzlHIWf589McSi2EhYmImPTrfJqdz9b2eng76JkdTmOGU+fh/Ss86/Lf5DI8WVvpXE2BjDgIRrb7q92TWyquQD00Mt2fsxJHhpkfZSYjOMB6TaBc/Nsw6XMWTFG8e1ioczHpdvWxtvzs9NxxpdzRat8otOZWpXemqq/BUs2+seb16S5bJ2ishg6TYFlHS1q5YwBMD9P0ZmrWTVV7M7QvUuuuXAR5vatr69azM9fm3lMme9n6nWXIDqZkdxt9adg1ae84krBSvvdv7mc5OTP1ic5yctnAV0l3V8raVVs/plDnwJ8FjT2hOjSDXS7YPOfiH4m7ZiVO7jc2yUye3tlgbe2OBu09B3AFLLzjzzvwb7lz+pp4VdWzPIU5d2QVpZtbh5qrZfF85zkzmweUFUtA8e2TOXrEWGa6eav2GHAA95WHRixk5rrgI3VyVDHtzzgxziB+kY1nSP3xccyiIiNpbmrXiefZZwTKu0NQ/qVOYftQysMxLVQZeXYBDItuyIFY6j8L7G+Z0oBOROVMCctt81yJxk5GDPGK/bJPuyJxJf1qnN0zvficIuI7dGKZgwvA6jj70VmV9h8VYksksYWU1+Gt9j1IMzq1HzkFlRnMAeTPV8TjS4ZE4R9cQyJjviC+kTgtiLKmcxt567KJxhYUQYKOYwDyCwupwqAAe2EeaevL7H2WCLAuVma+0B4hkqet2blUg8D5yxzILPmJ4IUMkJFuFMqsAeO5LKtjmNqubCls5h8z41nnETg9oyGZ5ME/pLMo0XW5SsFL+1crJtp2dYdfZ7jOD5VxBiQWKchPJRgqIjieM7DOJgzJkwcAUxgnGcjJA2YywgDlqXpziV4E85BcZ5AyhRbcEdI3mtqqyvvb3SFecj03ek/UYMraQbk8enaw3UX9Hslv02lvfGb9FxWypV7Ftq6yFrsaDZJZpdHYCzsSOvsNeZNv77SPdYRoto095pXuBWm2xk3QrDXQyJz04sLGyGIiP8ASnXUJOIiI+d9dD4r10Ij5X6+k866E1x/5U//xAAsEQABBAEDAgQGAwEAAAAAAAABAAIDBBEFEiEQMRMgIkEjMDJRYXEzQmCh/9oACAECEQE/Af8AIxwySfQMrt87TNPili8SRajVFeXDe3SON0jgxvcqjWNeEMKNRhvZcOMZWs142AOaMdQ0nsOklWaMZc1OpWGjcWHzNaXHAVGs6tFscVboMtEFxU0RikLFXgsxyNc1qifJyHhFvxQ5WKsc+PE9kaVUtxtCj0yCty4Z/aiuwPf4bDyrVRjpWSgc5Rx7oanXP9lZe18rnM7eUEg5C0y4+y07/ZW3ua5gBwCUKkIfv28qO7DJJ4bTypH7XBY5WryOZBx7rQ3ep7VajfYbtzgJkdSl+/8Aqd7K67bA4/j5Ghn1vC1bIh3D2KY8SMDh7rTW7bpB/K1aTw42uH3UXrIwtZ/gWhn4rv0ncgIaSPG8SR2Qo7ET34B7LUSBXf0Yxh7lPjjZ38ulziGf1dinNa8YPZN27doT3sq39zuxC1e3FK0MYcqDV5YowzHZWr8lkBruygsPgfvYnarYLt2VLqM8gwT0ksyyN2ud1JJ7+YSPAwCq9uWucsKs25Jn7nFRtc7nKoaeJBvk7KeOtC3GxOiYnBjBkp85cfSFExzyG+6r6fDGORkqwz4h2raV4PpXhFPaGtx5XdugGOFXeNgwrL90xRPKungBRfUqBAl5U0u2IkJ3BQKyVlSOz5nx/ZMOQqtnb6SrAyd4ROVM3e3C5aVHJg5CbYbIzaSvwVhbkX/b5eT0wEBjruP+k//EACsRAAICAQMCBQQCAwAAAAAAAAECAAMRBCExEBITICIyQRQVMFEFYCNC8P/aAAgBAREBPwH+olgOfz32srYEpcuu/QnAyZa3e2Z4h8LaaZidj5RYp4MFqH58xlr97ZldpTiK3cMx2QgjMbGNp/riI5TieK/7jXO8apwMmJYQCvTwHiAhcHzX1BDtKwCDPEbGJ4bKO4xRmCacZaargGIwXeE2WwSr3j8Gq4E0/uxCMHEuOappxkziab3zVe0dPqPTgCFCJV7x01uq1tYJqr2/74mk/ktfrnxWAAOYvdj1eS9O5YCRDAC9W009ZXcxtOpOYlQTeOgcYM+nTEWlF6BFG4610pXkqOd+ncM9vk7RHrVuY9uPSvEpR23zLLiuwhuYfMs11iiePda3MostX05zM9o3j3MZRqQvpsj6mpBktPvDC8nHpn3anG00Vz36gu368rcRlijAxHBzGEvQ4mjr5M04/wAkt4hEsr7hHqnhpjjeLVNBT2L3HzPV+oh2jpCkKfEqQo0ClTmAhhGSMkasz6Zj8SnRAbt+PtHQjMx0IB5grUf2T//EAEEQAAIBAgIGBQoEBQIHAAAAAAECAwAREiEEEBMxQVEiMmFxkRQgIzBCUoGhscEzYnLwQHOC0eFTgCQ0Q5KisvH/2gAIAQAABj8C/wBq93NZrLb3gt6EkTh0O4j+LMj16PRosPa5vTLhMcq9ZD52HgW+gH99U2iX6DDaKOXOtmh4X7q2ySsyjrIdxH2pZF3ML1Hh0SY7QHZ7s7b62ox7Pyba4LD3rb6m6EsDphPSUHImm0dYpGKsVytvpWcWnkcqmQz+dQ7OOaVpL9FVzy31JiEkjbdo0RUzyraR332IO8H+At3ff/GrRXHtHAf34+b0d9EvJJe1xn++yiH6ymxrRpeBbAfjR/Sv0FP+k1o5/LWjgOxEAYL/AFVg2j/g7L/yvUpLsNoqr/2mhpUmkNk+MYrZfHl2Uo8pkOzYmO8dwt9/fUT7YkxhuA491GWDSSJNs0qta9sW8VgDY2ZizM3Pia6JZ/6MqLoQCv4mL2ayaRu5BarObfC1XG71d+77/wB9UMnuSAmgDPh/UjAeNquNeNRe1IcQJvbI/vsou2RY3okb16XhSSe9En/qKI7K0eICzBd3Gsnt3E11hIOTVjQ4WGTLxv8AvjXRODu3+NXZie/UJIGzHs8G7KWeLdIo+Gef01WvkdbBjcI5Cd3qmdetwovI7Ox4k67HMU6HqxyFV7qxSOFFZCVu5aK6M/pOTCxppUkBftQZ1tAMIPDlqRTvTo6rsaFwwvuxKRVgbFjhpJBlbo/CliiXHI24VebSxGeSLeijPtBwe2rSNGO7Grr8b31KiddzYUMWlSLJ41hOkq0fhQiT4+qK0bxtbnbUW32FJpBlRBILgLmaEejzBVX2cAt/elaQYTbNQdUh3ENceA1SAbhIRqkj55/O2qTTZAGOMqnZapFYXFqZBmUbL4UwOTW3EVJp0oy6qX3VaPpfIf3NdNshuHAagPejtq0UHhdvDXsvKI9p7uLPUYIoxIV6xJphhwSLvX1DDu1WNaI3Jfpl99RJ4UJmkjgDC4XDiP2q0k20zvkttTS8TO37+mpG/My/M6l/W31ph2VLf3zUg9kA/E0uI3sMq2cKNK/Ja208oisR0B36lf3bffVH2RNq0h4euE8OdXryeQekRL4uYqZ4VY7STojiak0jSUMZYWVePqHPJb0y8jqaP3JGHz/zqk/SaiI3FBXw++pzylf66pLbwxPzoEbjR/mv9dTXr+j7ULHPBUWywKxXpjjeivHgvHUb+5/esB9k2qP+U321mQ6MvdiNqUGJ1C9dvZIppIdHYEy4la3RteswayPnkcxT999Wlwn/AFPqKdTzq3CogetH6M/Cm/fHVbixf6miO2pP1UoPDKpOydtT+FOhyFiV7qjH5RRwOy9xq7f/AGjpSgfliPEUC0MikZEMLUcXWJuaaYdSOO1+ZOvpPWWeq7b9TxxyqXTrDlVvOcameGV4yws2E76faXYnpYic6ZGNyh31pGjH2rSL9D9qk7/vq0ftBPzNNPEjPG2Zwi+Gr6Jo8khIz6JFCGLQ5sXvOuEUkF8TDNjzOoz6IFfF1kJtn2Uq6VGsMW89K5Nf8NpKOvASjMeFWeaBP0itpJeeT3m1FHAZTkQay2qr7uLKtnCmEa2KC7WyFOdNi2ZB6OVr0Drk0iLFjffnV/O28Yvbra1KDGRkQtEt1mNz2Vo1uOJT3W/wK22j4cfFTxrBKFgj9o4rkjspY0FlUWHryvIeYO/zJGPBaVuY867wJfnur/lkP6s6MAjVYzwUWr0GzkXtNq8q0uQNNayhdw7q6HoxX40njVgdp2GgWQqeVFEBkceFZYF7hXSwN8K6cT4uzdVtg3jXR6Ar8V/GumQ47a6klZI9cqwD0knLlWTqn6RR2z32nHt8yOKI+kJvWWTjrLy1+Tx5xg3c86HYfUs7bgLmjI3wHIarVlQ0eI9Nh0jyHn2G+r6rCuh+I+S9lXO/U6fvdQTSlLD/AFF+9X248DWHRlMjUZJWvI3yrGrFH94VYSK1ennsvIVhXIUDzJ9SR7zAebLJvu2XdqA81m7dQHx/fz1FfcUDWDwOrqL4V0VAq0yNhPVZaVIFOAZux8xI+Qz7/Uu4H4bBtfbfVKnuuV+epe7Up4Ys9fbqsfd1N+dQft9tQFW8KwtkddnAYdtWRVUdg17Zvw4z4n1TI4urCxFGB7lPYbmNRHst0h99XlSdV+v2HUHG9fpqIO6sLb9TDgxxLqDL1l+dDOlkTOSP5jViHA31cvODHoRc+fdSxxiyjd6vZTLcfShCJw5Ivuzqz+N91LtBYMLq3AiiDmDzrFAbr7p4VmpFehRix9kCrNkasd1BIrueQFZkX4Z1Y6rg2NW31tE6DceRpRLGVxDK/Gt3R+mvMWovGLJ7z5XrpSoB2VdhtW7d3rvKYJgkuGxDbjQ208KJxw5mo49GUskZAY2uQtq9mnm0iM4b2TgDR2I8oiv0TiAIqOfSRsUjbFa+ZqaWSJmjZrq9ri1BNHiJv7VshTRxRKgIscIorCqzpwIYD60J9OChV/6e+/fU0Ukez6Zwi3DhUKJGJLuLi3CvKNBwWIsYt3hWF4lhXizMPtUDaI4ZoYhHhb2gKCnRsHazjKrgu2kohPR3Masb3rA8O1QKSb8KsN38HjOhwX/lirDIeotPDHIPzLerQQxx/pW3nY5tFiduZWsEMSRj8ot/tV//xAAqEAEAAgECBQQDAAMBAQAAAAABABEhMUEQUWFxkYGhsfAwwdEg4fFAgP/aAAgBAAABPyH/AOV8KmLlBzvIPQbhfptWH/1vTg2JYtHtceoQEdbvPcd/8j0XRvZAeXwV2BtatIqNRbeaOQrtXmX4Db73lc3b3mhIB6xYMbll720uzH2AZ2h1jOcKxdX1iE6rsC9LuuukfLWdijlpGh2jEM1DV3i5RMLJOgu+3PEpkQRdA1H/AMFQHC/fx4cG0V5T/E2vWBd1lv8Aj7ROpWr4dGd3wAa9ZdyCO1/zLZ9YQUQtor0m+NmW9oR13XOU+rjTV8y2rFWxZ+iLaDDRZ2xuBjCrG4w0oP6lFOvMuOmjxK02yLQFHYiFuGRaynIig64UfotxNy1bR399pReuAXluNHcnB6Wnv6QywosTf8dp1PxwFp1KUWhkiktsX5UpCaiOiPGw8IWjJV/326wiJDRkbxp3gzWiDijaDkYHuhgo2cc80ZNq4S6CnRoy68vukUVPtbywt5k9fXX5j1zNCno2rw/Vv6VV+bMvC+avhzGsnFzfcRcmu62weaPbgAQhMg68bsmzvwfdq/FRDhq2wswhKyscUIBCkd5d3Zq+Epme6ynbTf8ASopUJrQ86/8AOeMeBun4ZM1fvDlsrn4RBKckVxdj9F4Hgi2g1uUst85e1kewABNr19rlG6IR1Y9sREK+n3ZZcs1aef7AD3YKX0TnwVtoG7f0Hvw60nrSAtTrUUHlqWPRzRdOtHxM3wZVav4vU3F1diPzLOhutLnwxtqK5youpjm6tB7zPOQSLneNXeVD7wA7cGU3JnJwxKF1rMqxQf0z+zhlzYk+S+DgJlmRogk+bTzMkM61bYu0uU5mIm8wiMFxHr50vWKuz7fpUZM+gldg4cuvYK/3gJNhLw49XVYcuXDBvOgB5E0cbmsR3PwdUUeWuAEyFUy0jNV9LP6OCFUC1gSmKdfXNPeJUC0lOyjm8uAgmo+mHgspoXev8DgEJ2+XOsDJa4Uqe8zYhgH0olhWiW2ORNcM0MHdjQzU1XRnzwa9oDe1h+eBQLhJ5OF6has2bvQuV3NQ+7fF1Yz1ySuNektF5Qmh27LtU22x3/B6keGZ12zgQ2a/p9W9JpDf0sTU7E8RWs49uRwSotUez5rhkcDuOVogdhYxL0yhAIxq+q7ZW/r+UJ1ToPJqW5DrHvjvrDw5mbU802DgBAWUEd8w5rbm8zb2YS7en34UAiYlHa9aHjdRdHIR6B0dvpGOhPjVi3TTXebJQPHLv/Lr2EFY6vFyvPAvVmaXpX/uG5TZ/v7iBFopOcZ9dlPXXxUVnv8ALghPPl5YHqqEQb1+xMhWtv2UiCTATrpwxJKREPQqXNUBz/0gUCmp8QwWGuC5fJtaAyrpDscbN73P2+YJbtOuVunONzvCNCWGtSNEf69ng3sRG37Vgg1qnSBsawcAfhEViP0bC5jUNT/LZ8vB7frhpseFhpcNCogl83OoxPFRbccksYUBfT/qJodme54PdMp+rRkr0WF2M1HdXRSCb24lHmmaSu6sHUo5kyvDXGS3dS0zyhBm6Ltq0jVcgD6mrxMcW8qL7ws30uOAaRoMJMr2Lr8cIGHlvHlwYABXbu0wGVt7aeYa68R4ApbAttqCr6GX/IAuBgfMRMOOGW1sS0Ovj3lGuIGegjm9s52vzC6WDNo7HnMveql0QY8+IC48+QfnSkqyded/yDcQEcQY4FlxUqEYr+or/k+ceoLeSAWfXvnGscUkEWCu4zzvhip0227ltVxmUqvRyvqxVt9J1MXDkZnWRZGaldAaD3i2Z935iWQ9f5jLB5UPlKi7tYvmcoLfLG2Y90AKfJ/uDWLuVGPeXp60P7DR0Okvj0enc/fSaeP11uU13Uw9H79oS8CWbnegZzLnzQ1hgwVaNYCXBPTo+/qV3mH4U7pycglm4ae0RQyLrnBoAd3nKEFoH6XNMsC3EE722lgD1eUAFFd4JUZHp0gqU27srzbeGwgAYIp7n48xEotrV3gxZaCHsYGD4A17IUivr/CMzbdKUE37mX2QwX1UKQLzQx5lCcw3/Eob+yBt74+P1+GjGn9/+pj4DKXrAqIm0U7GDgOUb6xwEXu1+/1FhBxM6YwOxwiOkt12Iwk5KUPfP7OFpbToSw2DrBv9+ICFxf8ANGFBbgTfPQrHoyidjeuwfefFkcGXYJhanfer3v8ADawfQ7p9lggb4GuPMOu8KtYe6+GRwKguqo4SmgwWdtT9kMZgJaReR4YIKxp55fvrABGWNcDwOVcq7uWhh1XJjtFOGA7zrQc7YC4yvi6ojAG8oBqD2fH8/EJVh2iOsyAC3+9m8vNYp7tVd7/r5ISGZSZaCmxgfUrx1lAbhyCt9933pDBG4sxophxaGjs9YiaxD65O+vv8ksIQOr2BlG58eICCxDps2Buanx46wgRhhzIG5o/ekBBuKRW3OKnc2leuIHnBq31hbNwmW/L+nr/yCxPQPxrB7fNcxmIgngDrt92iHABmmXV9/wBzJfADuiFGEpN0RZRamfrzL9MdSFxgvedq+/pV0BHWUDJqNqhRP0zIPKNyNEUwPUcQRrFIjapoygsKhwx3lM2hQmXVaOkF2LLFxUG8RxRpyYNV2Wpoej/ZXh3GB2VcQOyi/wAj476WIAFBR+UsDAvGaZMkNN4E+lgi6bZQEX8ZmQy6yqJ4i4Oevr/IvlmAC5I17QA8AUrGQxKwXn0I6VLMsy131mnx8C+svh/OtdRH7hTcauZ8dFeYMyiLhno6VH3WoQ7rlFmFTjWL2QLaGReBMV4RWtgjz1gERvUeDH+ds7tqq9IsoRqOpBxtkXlfvOCwAFAGn/iQSksiZO9q6kJABsGn4D5FoFTzF1l1rt4/yu0PWRbb9odvH/yr/9oADAMAAAERAhEAABDzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzPXzzzzzzzzzzzzwf3zju1fShdjDPzzzzzt/5nmTm+93rz/l7zzzy7Xlz/wA8u1879s8+488889r/ANqLJ/ff9TKNf/fPPPtasaPHb/3LL+lKPOPPPHijTLiI1wH39ffPpfPPPPw9+KQoA9vywQ4X/PPPPAAgP+hAQ0PQSXnvPPPPPHALDnuNvLffPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP/xAApEQEAAgECBAUFAQEAAAAAAAABABExIUFRYXGhECCBkbEwYNHw8eHB/9oACAECEQE/EPtEVVpwIikTX61WLVQ5V0g7KLPAmLSiUUKLdcbv4qLiK0NrEO1kAcrpr1/HjkhmYNeDjSaBDp5gOZa94RsNrpzjgBOEvLaNRCt3pZR63GoJuU312IPQJ8fiEjBX16yhKuX5I83Gb1BBweQNNO00xAXz/kYL2R5NnX/pA41On7zz5QSakpUXTG9/yV+iH95wMQDealIvZ+YLXdr3moPD/JWHVq9IjZ0QfWO1Yy1q5x1xcHHTmdf10hv1TqM+Podcg+z/ALGPMD3mBkX7kfY0LlAH21iFYI9yY+pKC/WpEDOFMUtSXVa8heXLtKxVWsBuXghIW0t4jV6eQeqgq/iUtFesRAljtsRKtZXBf5NFUbaxiCgLgw+AGxCyU9pRQOQaTSxOWnfMGtYAUh++vjSWx4A1fktBDhbEGVm9RiqwzNAQH0Bx5sOUK7V3XMtWGe0RhQSpkQW6qGauI69oSo0tx12grQSqDea9QgPLliNwCDaVTCo1nbTwb1MQ6YLeBj5JXyhA37MGamYxYrzLawmpkhgWd75mDOYCZFSsbUjOhcXM1mIk3l/0wG/gtkgYHgKYi+/3J//EACcRAQACAQMDAwUBAQAAAAAAAAEAESEQMUEgUXEwYaFggbHR8JHx/9oACAEBEQE/EPpHf1Qb9a8dS8bjQ22CChldFzUeUvVQ3dG0ghQL6kBbDqFQ1BAHvisgHJcHL3EvubAXdKgGpQrEYjioXdEQ4hLc6UEpgLgxBS0LIpa4jWGIgamyHl4gO4iJTJMJx8aBYe/oHJKrXIxGXEIHxLc9mU2viYLxPmRJfZmBCm8K6V7Mc2L5p+IW3ykU+c32D7wgiF7hR/lv56Gx7mYhjDLbsBnBjSFTK0eRvoAApUygaM0Zg3o3VXt5/jTms1fQq2kBK7R+DCeUIxyzJWmLOfETS9vvUBMp75grXcTw0R1as2PmIQQT7KivEc8K/b9zaI/Y6SrCUMExLi9NV5QvuV/fEGnhgvTl70WU/wDN5mfaXgZfx1XZhmruS3IS4pJcYRRjDAI00o7RzadpcNu4h8MCvSV3IFQNxAGxoJQiFh9Sf//EACoQAQABAgUDBAIDAQEAAAAAAAERACEQMUFRYXGBkaGxwfAgMNHh8UCA/9oACAEAAAE/EP8AyuszIALwZvAbtW0uCIDdRDoNXzglB/1ow0s5itsNRxvYnSGskhUoNhk/J+4D7+EYGiuiXWA6xNWCUskHCyTcVvQRK5/a5bBcaNSPvOBNWgkp5wkiAa1lFFaGTdTdkyqIp1ORwt3LhbVKJkdmmnUQM66VjgZZYBpMt1ZWDioFkBvNmpECTIVIYpK7eiis7FVIHe5/wDsyezJO7hLVKn4yz+IIk4hI2xOgDOtDCSs8WyTFNmLALZIcjQJGHkwU5yTy1SADyGpydSzmFJqBlCVqnK00rzQnhefsoUyPhYSkmtEraYrdVnpKKJqS+kXmYM3eFWrauZYdORlQoLkPaDzNykcY2HKDYgpmsaTpPc6h0aE2rZfYM6ZQx9OglIMTWb6vQJUIUq7Ack/WeqnlDhDk4CiUYB3pSu4TnyIeaJI0ygjqOMTSvNYHyUAKSFSNkLtGZqwQQJdivmHtHwqatT2F2azkEdxSWSpVgpSJPaFpOQfvyUCzhDZsGz6iorohww36vsmSjDmk783hBxUwjzc/LhEw8xIedGkaLOctlY1MEBYI2xEwpxOOpWdb0ybGn6ixgIVwiZHariaC3wJYDgxzmEgA1PFlJWPspwSOV0M2kQcZDD1qhCAlLM5BgQSpPqUyMYC1YMGc0prRwCc6uKzAFekUMx6YbgPkWwF2s8uWxHcU1rqykFcdKLKTfYmgd0qiIECfAm16c5KAuLdQ03EHe0SgP7wzSdUgbXF7AzQi8XSrGti1ROqVhtEjxWYXBdXL+AqHPQFaDLQggP1ZCujIAU7xZzRVKKWQB9hhq6HSExQIc+VQ3Dfal0xTtmZbm5uprM+t05LaPXCwI2rH1mVZwAU9WBqPZge1ELghAiozDokHfOpoOHW+QKvwtqqGL5SWqCb3GostFTwwKiBdnBN7JKOdBE99t9MVtgLunYDD+/EGwC04DIY4/WTSE58YQd6l6ExBdJvWYw21gu1u36A/gAFei4XyDyKIWAL6Kwp2ycYJaktmKm4wKRpRLk4G4JFnuwtAg7gnrg9lAnvXAAiEaUaBepFfJAlvzWmCyIi681uWiBFNkMADQKMrHXCbZHzTlqL+QQfJ/TDlJL3+kYPUIJDgwTAPDKQPVdsNJjU2rQns8itABEJwATK5FQ7QNyXIhDN+h1gLqIe1f4AamFigN2KCemAfZGeo07R5QlK8Mm4+Fh1AByLAdmA+UEUGo2gcRJoSdC835q8UNmswB5BXcvIyeVqLG27bXzVoQUwwtnR/KoiyMogQdfPE3XjCdIaIGrwMGkXRvKV2/kwmDqyOSU692lc7ZQKbg7eOXFgVsjrR2PfxAgkaCTw6NSRPDZ9aBk/Kaf5Eit5Edix74RMHZSf7Ui5KNpdHRhXSbEDROuDCh9FOwHwPxhcAJfKcXqVryXQ0r/YAf5peAShnoVAVRdkqfLh3qkAV7UHQKK4oZ8KiJAHbRhHLfvQ1vXUC6DVrMAKLvxp2zdRhMHMsk0yTmmuSCyMoOgVKcDKIzGAcM55qcTsYdqa9DKPiusK207csCIS3tboZOudfWT+X8GCLMAQEZLy0NJzL1YIdXm2c9QoOfNcIk50oPtEL7lCtIrv8rC01zhfPDTQyK9XmZLcLa1GS4Q6yMyWiagTsE7icwu6V3C4X9U4Bd+PdkWGpRe80FRcEQ0qtNXxBtleCkDQk/wCLj0oyd5A1t9HGCEQjFRCI6Ull9zI4FJWaI7Ut1peWDSWkQGWPeoiSSKCXu23rY264cQeCkxiAjcr+NyH5c1HlBHsMQGsGrtvMMidVNsvkWRJwFXAMX1G+KA3IJ+LkgMdVqAoMHrYEQu6tQShB0UB+9ApD6lkUDJiC2CH4b+QAFFqiCBc0Uuefy1CKO+Bq0O6APDShKlxUuwAUtCXVNwi8Panm6nJaOYRJMO1INm2dYHsVcEcLwmivUm8i9MrTOI9xq27MDZnecVxFR8o1zVxG+orSZU7cyT2q0j0/oVA9Eih5+Crl6mv8ubkKHtw2fdSJMnA80vHlD603gGcJe7XSjfQg+81IuN9ohG0BaHX8C0TGPoyYraJrJizbbCjAFzUKONArhepT7obPz+ngo8AlqYCcDS/lgcxF8MKjBr94o9oOcFsArxoV/UAGbisD8Ymb1ImaPvhxgsNshIB7c91GITMCnA97Bd15azGDqRpkX5rswCfDTLEZ3lRm+lc3ayFN6kI23hK5lML3ArsAJ6EAe9WvDyt2vgAIf0lnAl2vP0eIfoC1nBfqQCroYXOL2H+4W0C+3TFQ3lHjj+fwgIDPnVATcK1kKPQQA7uVxtggfe/0qTpZEe1eqq2YVITvTSBIayEFfNxVqgUJDghmXX9b9KY9QcZPZ3bGBtniOK/LAP8AEhUeYw/jAgk++H5gNgD1DEIMhJ5Szh2yjZM34wZD2oAhRg3OC6h/tZYnpnLf8LcgNMa8mPhrLKM5l4IxIZTATZuPc/qDF8GRoD1GmVYsmmtL2sAdTrASuExmOemBA6IF8jpQGAI8yKUy/OCYOJoib6kjfau3UK7MIPXaiJPZeMAEZUlEffhUkIlTkAz6JHzZGBINMK5R8AzgmPtxGcfhYQDeTgwIhd2BpLN8KbEHVf26/rcX7vLSaJoycBO2oeLemhiB59lyemtLWZSEokXUvWdm5wHSpyv6AStynchQpwjJdVEsfZ4plhuSVlwOR0VISORbSWAm1XSJGsst6yaW7wU8lXwTda2YQTn0rvEdDq7NaQWK59xevrDgVqxV7yBXIOXQ4gpZD1fPUvGPFEGtFs6CUAPNdbp+ZoBALAftS2RFcVXFvs1sfJ14IetAgHT0qN7h7V863wlQAiUJO6h0NGgxJAtlhPNJkRN+2DQJzlpEmlcjNQZ5IaBQgRL1WQBT4LQIUi+Zz1rsgYY7cejS+o5mg5ExTOdEZ0QM7lvqIORn8M/ICnoUQzGC6ULjFWghRiayBoDStemQXym1LQ2Qea4+CkhAoQYEi6YirQEbZuRKuOsSxxMDDLaGgJlQwBkB/wASCQWRpCbzFbsqAsMEABt+j2GOjIMUPny+5oE/kzzFAn1SFpCRgUW7Al/8q//Z';
    return retorno;
  }
}
