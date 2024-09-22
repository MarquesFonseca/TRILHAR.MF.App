import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function telefoneValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value ? control.value.replace(/\D+/g, '') : ''; // Remove tudo que não for número
        const pattern = /^\d{11}$/; // Valida 11 dígitos (sem máscara)

        return pattern.test(value) ? null : { telefoneInvalid: true };
    };
}

export function emailValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value ? control.value.trim() : '';
        const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        return pattern.test(value) ? null : { emailInvalid: true };
    };
}
