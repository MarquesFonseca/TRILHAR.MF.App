// // src/app/shared/extensions/boolean-extensions.ts

// declare global {
//   interface Boolean {
//     /**
//      * Verifica se o valor booleano é falso.
//      * @returns true se for falso
//      * @example false.isFalse() --> true
//      */
//     isFalse(): boolean;

//     /**
//      * Verifica se o valor booleano é verdadeiro.
//      * @returns true se for verdadeiro
//      * @example true.isTrue() --> true
//      */
//     isTrue(): boolean;

//     /**
//      * Inverte o valor booleano (operação NOT).
//      * @returns Valor invertido
//      * @example true.not() --> false
//      */
//     not(): boolean;

//     /**
//      * Operação lógica AND.
//      * @param other - Valor booleano para comparação
//      * @returns Resultado da operação AND
//      * @example true.and(false) --> false
//      */
//     and(other: boolean): boolean;

//     /**
//      * Operação lógica OR.
//      * @param other - Valor booleano para comparação
//      * @returns Resultado da operação OR
//      * @example true.or(false) --> true
//      */
//     or(other: boolean): boolean;

//     /**
//      * Operação lógica XOR (OU exclusivo).
//      * @param other - Valor booleano para comparação
//      * @returns Resultado da operação XOR
//      * @example true.xor(false) --> true
//      */
//     xor(other: boolean): boolean;

//     /**
//      * Operação lógica NAND (NOT AND).
//      * @param other - Valor booleano para comparação
//      * @returns Resultado da operação NAND
//      * @example true.nand(false) --> true
//      */
//     nand(other: boolean): boolean;

//     /**
//      * Operação lógica NOR (NOT OR).
//      * @param other - Valor booleano para comparação
//      * @returns Resultado da operação NOR
//      * @example true.nor(false) --> false
//      */
//     nor(other: boolean): boolean;

//     /**
//      * Alterna o valor booleano.
//      * @returns Valor alternado
//      * @example true.toggle() --> false
//      */
//     toggle(): boolean;

//     /**
//      * Executa callback se verdadeiro.
//      * @param callback - Função a ser executada
//      * @returns Resultado do callback ou undefined
//      * @example true.ifTrue(() => "Executado") --> "Executado"
//      */
//     ifTrue<T>(callback: () => T): T | undefined;

//     /**
//      * Executa callback se falso.
//      * @param callback - Função a ser executada
//      * @returns Resultado do callback ou undefined
//      * @example false.ifFalse(() => "Executado") --> "Executado"
//      */
//     ifFalse<T>(callback: () => T): T | undefined;

//     /**
//      * Converte booleano para inteiro.
//      * @returns 1 se verdadeiro, 0 se falso
//      * @example true.toInteger() --> 1
//      */
//     toInteger(): number;

//     /**
//      * Verifica igualdade com outro booleano.
//      * @param other - Valor booleano para comparação
//      * @returns true se forem iguais
//      * @example true.equals(true) --> true
//      */
//     equals(other: boolean): boolean;

//     /**
//      * Operação de implicação lógica (A → B).
//      * @param other - Valor booleano para implicação
//      * @returns Resultado da implicação
//      * @example true.implies(false) --> false
//      */
//     implies(other: boolean): boolean;
//   }
// }

// // Implementações
// Boolean.prototype.isFalse = function (): boolean {
//   return this.valueOf() === false;
// };

// Boolean.prototype.isTrue = function (): boolean {
//   return this.valueOf() === true;
// };

// Boolean.prototype.not = function (): boolean {
//   return !this.valueOf();
// };

// Boolean.prototype.and = function (other: boolean): boolean {
//   return this.valueOf() && other;
// };

// Boolean.prototype.or = function (other: boolean): boolean {
//   return this.valueOf() || other;
// };

// Boolean.prototype.xor = function (other: boolean): boolean {
//   return this.valueOf() !== other;
// };

// Boolean.prototype.nand = function (other: boolean): boolean {
//   return !(this.valueOf() && other);
// };

// Boolean.prototype.nor = function (other: boolean): boolean {
//   return !(this.valueOf() || other);
// };

// Boolean.prototype.toggle = function (): boolean {
//   return !this.valueOf();
// };

// Boolean.prototype.ifTrue = function <T>(callback: () => T): T | undefined {
//   if (this.valueOf()) {
//     return callback();
//   }
//   return undefined;
// };

// Boolean.prototype.ifFalse = function <T>(callback: () => T): T | undefined {
//   if (!this.valueOf()) {
//     return callback();
//   }
//   return undefined;
// };

// Boolean.prototype.toInteger = function (): number {
//   return this.valueOf() ? 1 : 0;
// };

// Boolean.prototype.equals = function (other: boolean): boolean {
//   return this.valueOf() === other;
// };

// Boolean.prototype.implies = function (other: boolean): boolean {
//   return !this.valueOf() || other;
// };

// export { };
