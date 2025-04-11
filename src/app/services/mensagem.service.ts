import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom, Observable } from 'rxjs';
import { ConfirmDialogComponent } from '../shared/confirm-dialog/confirm-dialog.component';


// this.mensagemService.showInfo('Essa é uma informação.');
// this.mensagemService.showError('Erro ao salvar registro!');
// this.mensagemService.showSuccess('Registro salvo com sucesso!');
//return;
// var resposta = await this.excluirItem();
// this.mensagemService.showInfo(`apertou: ${resposta ? 'Confirmou' : 'Cancelou'}`);
//ou
// if (await this.mensagemService.confirm('Atenção', 'Deseja prosseguir com esta operação?')) {
//   // continue sua ação aqui
//   this.mensagemService.showSuccess(`apertou: 'Confirmou'`);
// }
// else {
//   this.mensagemService.showInfo(`apertou: 'Cancelou'`);
//   // continue sua ação aqui
//   return;
// }

// async excluirItem(): Promise<boolean>{
//   const confirmado = await this.mensagemService.confirm(
//     'Atenção',
//     'Deseja prosseguir com esta operação?');

//   if (confirmado) {
//     // continue sua ação aqui
//     this.mensagemService.showSuccess('Confirmado!');
//     return true;
//   } else {
//     //cancelado
//     this.mensagemService.showError('Cancelado!');
//     return false;
//   }

//   return false; // só chega aqui depois da escolha
// }


@Injectable({
  providedIn: 'root'
})
export class MensagemService {
  constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  // Configurações padrão para os diferentes tipos de mensagens
  private infoConfig: MatSnackBarConfig = {
    duration: 5000,
    horizontalPosition: 'center',
    verticalPosition: 'top',
    panelClass: ['info-snackbar']
  };

  private successConfig: MatSnackBarConfig = {
    duration: 5000,
    horizontalPosition: 'center',
    verticalPosition: 'top',
    panelClass: ['success-snackbar']
  };

  private errorConfig: MatSnackBarConfig = {
    duration: 8000, // Erro fica visível por mais tempo
    horizontalPosition: 'center',
    verticalPosition: 'top',
    panelClass: ['error-snackbar']
  };

  /**
   * Exibe uma mensagem de informação (amarela)
   * @param message Texto da mensagem
   */
  showInfo(message: string): void {
    this.snackBar.open(message, 'Fechar', this.infoConfig);
  }

  /**
   * Exibe uma mensagem de sucesso (verde)
   * @param message Texto da mensagem
   */
  showSuccess(message: string): void {
    this.snackBar.open(message, 'Fechar', this.successConfig);
  }

  /**
   * Exibe uma mensagem de erro (vermelha)
   * @param message Texto da mensagem
   * @param error Objeto de erro (opcional)
   */
  showError(message: string, error?: any): void {
    console.error('Erro:', error);
    this.snackBar.open(message, 'Fechar', this.errorConfig);
  }

  /**
   * Exibe um diálogo de confirmação com botões personalizáveis e aguarda a resposta
   * @param title Título do diálogo
   * @param message Mensagem/pergunta do diálogo
   * @param confirmText Texto do botão de confirmação (padrão: "Sim")
   * @param cancelText Texto do botão de cancelamento (padrão: "Não")
   * @returns Promise<boolean> - true quando confirmado, false quando cancelado
   */
  async confirm(
    title: string,
    message: string,
    confirmText: string = 'Sim',
    cancelText: string = 'Não'): Promise<boolean> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        titulo: title,
        mensagem: message,
        confirmText: confirmText,
        cancelText: cancelText
      }
    });

    // Aguarda a resposta e a converte para boolean (garantindo true/false)
    const resultado = await firstValueFrom(dialogRef.afterClosed());
    return resultado === true;
  }
}
