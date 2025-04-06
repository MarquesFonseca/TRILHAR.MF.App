import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

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

// Telefone (11 dígitos, somente números)
export function telefoneValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const rawValue = control.value;

    // Se o valor está vazio, deixa a responsabilidade para o Validators.required (caso ele exista)
    if (!rawValue || rawValue.trim() === '') {
      return null;
    }

    const value = rawValue.replace(/\D+/g, '');
    const pattern = /^\d{11}$/;

    return pattern.test(value) ? null : { telefoneInvalid: true };
  };
}

// Email (formato padrão)
export function emailValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const rawValue = control.value;

    // Se o valor está vazio, deixa a responsabilidade para o Validators.required (caso ele exista)
    if (!rawValue || rawValue.trim() === '') {
      return null;
    }
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return pattern.test(rawValue) ? null : { emailInvalid: true };
  };
}

// CPF (validação simples com máscara ou sem)
export function cpfValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const cpf = (control.value || '').replace(/\D/g, '');
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return { cpfInvalid: true };

    let soma = 0;
    for (let i = 0; i < 9; i++) soma += Number(cpf.charAt(i)) * (10 - i);
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== Number(cpf.charAt(9))) return { cpfInvalid: true };

    soma = 0;
    for (let i = 0; i < 10; i++) soma += Number(cpf.charAt(i)) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== Number(cpf.charAt(10))) return { cpfInvalid: true };

    return null;
  };
}

// Campo obrigatório sem espaços em branco
export function requiredTrimValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    return value && value.trim().length > 0 ? null : { requiredTrim: true };
  };
}

// Valida data futura (não pode ser futura)
export function dataNaoFuturaValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = new Date(control.value);
    const hoje = new Date();
    return value > hoje ? { dataFutura: true } : null;
  };
}

// Valida mínimo de caracteres
export function minLengthValidator(min: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value || '';
    return value.length >= min ? null : { minLength: { requiredLength: min } };
  };
}

// Valida campos iguais (ex: senha e confirmação)
export function camposIguaisValidator(campo1: string, campo2: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const formGroup = group as any;
    const val1 = formGroup.get(campo1)?.value;
    const val2 = formGroup.get(campo2)?.value;
    return val1 === val2 ? null : { camposDiferentes: true };
  };
}

// Valida se é uma data válida
export function dataValidaValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valor = control.value;

    if (!valor) return null; // Campo vazio pode ser tratado por outro validador (como required)

    const data = new Date(valor);

    // Verifica se a data é inválida
    return isNaN(data.getTime()) ? { dataInvalida: true } : null;
  };
}
