import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appDateMask]',
  standalone: true
})
export class DateMaskDirective {

  constructor(private el: ElementRef) { }

  @HostListener('keydown', ['$event']) onKeyDown(event: KeyboardEvent) {
    const input = this.el.nativeElement;
    const value = input.value;

    // Permite backspace, delete, tab, escape, enter
    if ([8, 9, 27, 13, 110].indexOf(event.keyCode) !== -1 ||
      // Permite home, end, left, right
      (event.keyCode >= 35 && event.keyCode <= 39)) {
      return;
    }

    // Permite Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
    if ((event.keyCode === 65 || event.keyCode === 67 || event.keyCode === 86 || event.keyCode === 88) && event.ctrlKey === true) {
      return;
    }

    // Só permite números
    if ((event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105)) {
      event.preventDefault();
      return;
    }

    // Adiciona as barras automaticamente
    if (value.length === 2 || value.length === 5) {
      input.value += '/';
    }

    // Limita o comprimento para 10 caracteres (DD/MM/YYYY)
    if (value.length >= 10) {
      event.preventDefault();
    }
  }

  @HostListener('paste', ['$event']) onPaste(event: ClipboardEvent) {
    event.preventDefault();
    const paste = (event.clipboardData || (window as any).clipboardData).getData('text');

    // Remove caracteres não numéricos exceto /
    const cleaned = paste.replace(/[^0-9/]/g, '');

    // Se já tem formato de data, insere diretamente
    if (cleaned.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
      this.el.nativeElement.value = cleaned;
    }
    // Se tem números suficientes, formata
    else if (cleaned.length >= 8) {
      const numeros = cleaned.replace(/\//g, '');
      const dia = numeros.substr(0, 2);
      const mes = numeros.substr(2, 2);
      const ano = numeros.substr(4, 4);
      this.el.nativeElement.value = `${dia}/${mes}/${ano}`;
    }
  }
}
