export const ValidatorMessages: { [key: string]: (error?: any) => string } = {
  required: () => 'Este campo é obrigatório.',
  requiredTrim: () => 'Preenchimento obrigatório.',
  emailInvalid: () => 'E-mail inválido.',
  telefoneInvalid: () => 'Telefone deve conter 11 dígitos numéricos.',
  cpfInvalid: () => 'CPF inválido.',
  dataInvalida: () => 'Data inválida.',
  matDatepickerParse: () => 'Data inválida.',
  dataFutura: () => 'Data não pode ser futura.',
  minLength: (error) => `Mínimo de ${error?.requiredLength} caracteres.`,
  camposDiferentes: () => 'Os campos não coincidem.',
};

// Exemplo de uso no FormGroup:
// this.formulario = this.fb.group({
//   nome: ['', [requiredTrimValidator(), minLengthValidator(3)]],
//   email: ['', [emailValidator()]],
//   telefone: ['', [telefoneValidator()]],
//   cpf: ['', [cpfValidator()]],
//   dataNascimento: ['', [dataNaoFuturaValidator()]],
//   senha: [''],
//   confirmarSenha: ['']
// }, {
//   validators: [camposIguaisValidator('senha', 'confirmarSenha')]
// });

//----------------------

// Como usar no HTML (exemplo com *ngIf):
// <div *ngIf="formulario.get('email')?.errors as errors">
//   <div *ngFor="let errorKey of objectKeys(errors)">
//     {{ getValidatorMessage(errorKey, errors[errorKey]) }}
//   </div>
// </div>

//----------------------

// No Componente:
// import { ValidatorMessages } from './validator-messages';

// objectKeys = Object.keys;

// getValidatorMessage(errorKey: string, errorValue: any): string {
//   const messageFn = ValidatorMessages[errorKey];
//   return messageFn ? messageFn(errorValue) : 'Erro desconhecido';
// }
