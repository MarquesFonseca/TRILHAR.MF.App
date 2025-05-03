// // src/app/shared/extensions/number-extensions.ts

// declare global {
//   interface Number {
//     /**
//      * Formata valor com casas decimais (específico).
//      * @returns String formatada
//      * @example (valor: "1234.56") --> "1234.56"
//      */
//     formatarValor(): string;

//     /**
//      * Formata valor para padrão brasileiro.
//      * @returns String formatada com vírgula
//      * @example (1234.56).formataValor() --> "1234,56"
//      */
//     formataValor(): string;

//     /**
//      * Formata número como moeda brasileira (Real).
//      * @returns String formatada como moeda
//      * @example (1234.56).toBRL() --> "R$ 1.234,56"
//      */
//     toBRL(): string;

//     /**
//      * Converte número para porcentagem.
//      * @param decimals - Número de casas decimais (padrão: 2)
//      * @returns String formatada como porcentagem
//      * @example (0.1234).toPercent() --> "12.34%"
//      */
//     toPercent(decimals?: number): string;

//     /**
//      * Verifica se o número é positivo.
//      * @returns true se for maior que zero
//      * @example (5).isPositive() --> true
//      */
//     isPositive(): boolean;

//     /**
//      * Verifica se o número é negativo.
//      * @returns true se for menor que zero
//      * @example (-5).isNegative() --> true
//      */
//     isNegative(): boolean;

//     /**
//      * Verifica se o número é zero.
//      * @returns true se for igual a zero
//      * @example (0).isZero() --> true
//      */
//     isZero(): boolean;

//     /**
//      * Verifica se o número é par.
//      * @returns true se for divisível por 2
//      * @example (4).isEven() --> true
//      */
//     isEven(): boolean;

//     /**
//      * Verifica se o número é ímpar.
//      * @returns true se não for divisível por 2
//      * @example (5).isOdd() --> true
//      */
//     isOdd(): boolean;

//     /**
//      * Limita o número entre um valor mínimo e máximo.
//      * @param min - Valor mínimo
//      * @param max - Valor máximo
//      * @returns Número limitado
//      * @example (15).clamp(0, 10) --> 10
//      */
//     clamp(min: number, max: number): number;

//     /**
//      * Arredonda o número com precisão.
//      * @param places - Número de casas decimais
//      * @returns Número arredondado
//      * @example (3.14159).round(2) --> 3.14
//      */
//     round(places?: number): number;

//     /**
//      * Arredonda para baixo com precisão.
//      * @param places - Número de casas decimais
//      * @returns Número arredondado para baixo
//      * @example (3.99).floor(1) --> 3.9
//      */
//     floor(places?: number): number;

//     /**
//      * Arredonda para cima com precisão.
//      * @param places - Número de casas decimais
//      * @returns Número arredondado para cima
//      * @example (3.01).ceil(1) --> 3.1
//      */
//     ceil(places?: number): number;

//     /**
//      * Abrevia números grandes.
//      * @returns String abreviada
//      * @example (1500000).abbreviate() --> "1.5M"
//      */
//     abbreviate(): string;

//     /**
//      * Converte número para numeral ordinal.
//      * @returns String com número ordinal
//      * @example (21).ordinal() --> "21st"
//      */
//     ordinal(): string;

//     /**
//      * Aplica forma plural baseado no número.
//      * @param singular - Forma singular
//      * @param plural - Forma plural
//      * @returns String com forma adequada
//      * @example (1).pluralize("pessoa", "pessoas") --> "pessoa"
//      */
//     pluralize(singular: string, plural: string): string;

//     /**
//      * Verifica se está dentro de um intervalo.
//      * @param min - Valor mínimo
//      * @param max - Valor máximo
//      * @returns true se estiver no intervalo
//      * @example (5).between(1, 10) --> true
//      */
//     between(min: number, max: number): boolean;

//     /**
//      * Converte número para palavras (simplificado).
//      * @returns String com número por extenso
//      * @example (5).toWords() --> "cinco"
//      */
//     toWords(): string;

//     /**
//      * Converte número para algarismos romanos.
//      * @returns String com número em romano
//      * @example (2024).toRoman() --> "MMXXIV"
//      */
//     toRoman(): string;

//     /**
//      * Calcula porcentagem do total.
//      * @param total - Valor total
//      * @returns Porcentagem
//      * @example (25).percentage(50) --> 50
//      */
//     percentage(total: number): number;

//     /**
//      * Calcula distância até outro número.
//      * @param target - Número alvo
//      * @returns Distância absoluta
//      * @example (10).distance(15) --> 5
//      */
//     distance(target: number): number;

//     /**
//      * Verifica se está dentro de uma faixa.
//      * @param min - Valor mínimo
//      * @param max - Valor máximo
//      * @returns true se estiver na faixa
//      * @example (5).inRange(1, 10) --> true
//      */
//     inRange(min: number, max: number): boolean;
//   }
// }

// // Implementações das funções existentes
// Number.prototype.formatarValor = function (): string {
//   const str = this.toString();
//   const centavos = str.substr(15, 2);
//   const valorReal = Number(str.substr(0, 15));
//   return `${valorReal}.${centavos}`;
// };

// Number.prototype.formataValor = function (): string {
//   if (this == 0) return '0,00';

//   let casas = this.toString().split('.');
//   const centavos = casas.length > 1 ? casas[1] : '00';
//   const valorReal = casas.length >= 1 ? casas[0] : '0';
//   return `${valorReal},${centavos}`;
// };

// // Novas extensões sugeridas
// Number.prototype.toBRL = function (): string {
//   return new Intl.NumberFormat('pt-BR', {
//     style: 'currency',
//     currency: 'BRL'
//   }).format(this.valueOf());
// };

// Number.prototype.toPercent = function (decimals: number = 2): string {
//   return (this.valueOf() * 100).toFixed(decimals) + '%';
// };

// Number.prototype.isPositive = function (): boolean {
//   return this.valueOf() > 0;
// };

// Number.prototype.isNegative = function (): boolean {
//   return this.valueOf() < 0;
// };

// Number.prototype.isZero = function (): boolean {
//   return this.valueOf() === 0;
// };

// Number.prototype.isEven = function (): boolean {
//   return this.valueOf() % 2 === 0;
// };

// Number.prototype.isOdd = function (): boolean {
//   return this.valueOf() % 2 !== 0;
// };

// Number.prototype.clamp = function (min: number, max: number): number {
//   return Math.min(Math.max(this.valueOf(), min), max);
// };

// Number.prototype.round = function (places: number = 0): number {
//   const factor = Math.pow(10, places);
//   return Math.round(this.valueOf() * factor) / factor;
// };

// Number.prototype.floor = function (places: number = 0): number {
//   const factor = Math.pow(10, places);
//   return Math.floor(this.valueOf() * factor) / factor;
// };

// Number.prototype.ceil = function (places: number = 0): number {
//   const factor = Math.pow(10, places);
//   return Math.ceil(this.valueOf() * factor) / factor;
// };

// Number.prototype.abbreviate = function (): string {
//   const num = this.valueOf();
//   const units = ['', 'K', 'M', 'B', 'T'];
//   let unitIndex = 0;
//   let value = num;

//   while (value >= 1000 && unitIndex < units.length - 1) {
//     value /= 1000;
//     unitIndex++;
//   }

//   return value.toFixed(1).replace(/\.0$/, '') + units[unitIndex];
// };

// Number.prototype.ordinal = function (): string {
//   const num = this.valueOf();
//   const s = ['th', 'st', 'nd', 'rd'];
//   const v = num % 100;
//   return num + (s[(v - 20) % 10] || s[v] || s[0]);
// };

// Number.prototype.pluralize = function (singular: string, plural: string): string {
//   return this.valueOf() === 1 ? singular : plural;
// };

// Number.prototype.between = function (min: number, max: number): boolean {
//   return this.valueOf() >= min && this.valueOf() <= max;
// };

// Number.prototype.toWords = function (): string {
//   const units = ['', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove'];
//   const teens = ['dez', 'onze', 'doze', 'treze', 'quatorze', 'quinze', 'dezesseis', 'dezessete', 'dezoito', 'dezenove'];
//   const tens = ['', '', 'vinte', 'trinta', 'quarenta', 'cinquenta', 'sessenta', 'setenta', 'oitenta', 'noventa'];

//   const numberToWords = (n: number): string => {
//     if (n === 0) return 'zero';
//     if (n < 10) return units[n];
//     if (n < 20) return teens[n - 10];
//     if (n < 100) {
//       const ten = Math.floor(n / 10);
//       const unit = n % 10;
//       return tens[ten] + (unit ? ' e ' + units[unit] : '');
//     }
//     // Implementação simplificada para números até 99
//     return n.toString();
//   };

//   return numberToWords(this.valueOf());
// };

// Number.prototype.toRoman = function (): string {
//   const num = this.valueOf();
//   if (num <= 0 || num >= 4000) return num.toString();

//   const romanNumerals: [string, number][] = [
//     ['M', 1000],
//     ['CM', 900],
//     ['D', 500],
//     ['CD', 400],
//     ['C', 100],
//     ['XC', 90],
//     ['L', 50],
//     ['XL', 40],
//     ['X', 10],
//     ['IX', 9],
//     ['V', 5],
//     ['IV', 4],
//     ['I', 1]
//   ];

//   let result = '';
//   let n = num;

//   for (const [roman, value] of romanNumerals) {
//     while (n >= value) {
//       result += roman;
//       n -= value;
//     }
//   }

//   return result;
// };

// Number.prototype.percentage = function (total: number): number {
//   return (this.valueOf() / total) * 100;
// };

// Number.prototype.distance = function (target: number): number {
//   return Math.abs(this.valueOf() - target);
// };

// Number.prototype.inRange = function (min: number, max: number): boolean {
//   return this.valueOf() >= min && this.valueOf() <= max;
// };

// export { };
