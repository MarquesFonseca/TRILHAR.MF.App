import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { ValidatorMessages } from '../validator-messages';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../material.module';

@Component({
  selector: 'app-mensagem-erro',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
  ],
  templateUrl: './mensagem-erro.component.html',
  styleUrl: './mensagem-erro.component.scss'
})
export class MensagemErroComponent {
  @Input() control: AbstractControl | null = null;
  @Input() field: string = '';
  @Input() customMessages: { [key: string]: string } = {};


  public objectKeysForMessagesErros = Object.keys;
  public getValidatorMessage(errorKey: string, errorValue: any): string {
    // Se foi passada mensagem customizada para esta chave, usa ela
    if (this.customMessages && this.customMessages[errorKey]) {
      return this.customMessages[errorKey];
    }
    const messageFn = ValidatorMessages[errorKey];
    return messageFn ? messageFn(errorValue) : 'Erro desconhecido';
  }

  get exibeErro(): boolean {
    return !!this.control && this.control.invalid && (this.control.dirty || this.control.touched);
  }
}

