// // src/app/shared/extensions/string-extensions.ts

// declare global {
//   interface String {
//     /**
//      * Remove formatação de CPF e CNPJ.
//      * @example "123.456.789-00" --> "12345678900"
//      */
//     retirarFormatacao(): string;

//     /**
//      * Remove formatação de telefone.
//      * @example "(11) 98765-4321" --> "11987654321"
//      */
//     retirarFormatacaoTelefone(): string;

//     /**
//      * Remove acentos da string.
//      * @example "João Pérez" --> "Joao Perez"
//      */
//     removeAcento(): string;

//     /**
//      * Formata string numerica como CNPJ.
//      * @example "12345678000195" --> "12.345.678/0001-95"
//      */
//     mascaraCnpj(): string;

//     /**
//      * Formata string numerica como CPF.
//      * @example "12345678900" --> "123.456.789-00"
//      */
//     mascaraCpf(): string;

//     /**
//      * Formata string como número de processo jurídico.
//      * @example "12345678901234567890" --> "1234567-89.012345.67890"
//      */
//     mascaraProcessoJuridico(): string;

//     // Padding e formatação
//     /**
//      * Adiciona zeros à esquerda até atingir o comprimento especificado.
//      * @param max - Comprimento desejado
//      * @example "123".pad(5) --> "00123"
//      */
//     pad(max: number): string;

//     /**
//      * Adiciona espaços à direita até atingir o comprimento especificado.
//      * @param max - Comprimento desejado
//      * @example "123".formatarEspacoDireita(5) --> "123  "
//      */
//     formatarEspacoDireita(max: number): string;

//     // Validações e transformações
//     /**
//      * Verifica se a string é nula ou vazia.
//      * @returns true se for nulo ou vazio
//      */
//     isNullOrEmpty(): boolean;

//     /**
//      * Verifica se a string representa um número.
//      * @returns true se for numérico
//      */
//     isNumeric(): boolean;

//     // Novas extensões sugeridas
//     /**
//      * Capitaliza a primeira letra da string.
//      * @example "hello" --> "Hello"
//      */
//     capitalize(): string;

//     /**
//      * Trunca a string para o comprimento especificado.
//      * @param maxLength - Comprimento máximo
//      * @param ellipsis - Texto a ser adicionado no final (padrão: '...')
//      * @example "Hello World!".truncate(7) --> "Hello..."
//      */
//     truncate(maxLength: number, ellipsis?: string): string;

//     /**
//      * Inverte a string.
//      * @example "abc".reverse() --> "cba"
//      */
//     reverse(): string;

//     /**
//      * Verifica se é um email válido.
//      * @returns true se for um email válido
//      */
//     isEmail(): boolean;

//     /**
//      * Verifica se é um CPF válido.
//      * @returns true se for um CPF válido
//      */
//     isCpf(): boolean;

//     /**
//      * Verifica se é um CNPJ válido.
//      * @returns true se for um CNPJ válido
//      */
//     isCnpj(): boolean;

//     /**
//      * Verifica se é uma data válida no formato brasileiro.
//      * @returns true se for uma data válida no formato dd/mm/yyyy
//      * @example "25/12/2023" --> true, "31/02/2023" --> false
//      */
//     isDate(): boolean;

//     /**
//      * Converte uma string para formato de slug.
//      * @example "Olá Mundo!" --> "ola-mundo"
//      */
//     slug(): string;

//     /**
//      * Extrai partes da string com base em um padrão regex.
//      * @param pattern - Expressão regular para extração
//      * @returns Array com as partes extraídas
//      */
//     extract(pattern: RegExp): string[];

//     /**
//      * Substitui chaves na string por valores de um objeto.
//      * @param data - Objeto com os valores para substituição
//      * @example "{{name}} tem {{age}} anos".template({ name: "João", age: 30 }) --> "João tem 30 anos"
//      */
//     template(data: Record<string, any>): string;

//     /**
//      * Remove todos os caracteres não numéricos.
//      * @example "123.456.789" --> "123456789"
//      */
//     numberOnly(): string;

//     /**
//      * Converte para camelCase.
//      * @example "hello-world" --> "helloWorld"
//      */
//     camelCase(): string;

//     /**
//      * Converte para kebab-case.
//      * @example "HelloWorld" --> "hello-world"
//      */
//     kebabCase(): string;

//     /**
//      * Converte para snake_case.
//      * @example "HelloWorld" --> "hello_world"
//      */
//     snakeCase(): string;

//     /**
//      * Converte para PascalCase.
//      * @example "hello world" --> "HelloWorld"
//      */
//     pascalCase(): string;

//     /**
//      * Repete a string 'count' vezes.
//      * @param count - Número de repetições
//      * @example "abc".repeat(3) --> "abcabcabc"
//      */
//     repeat(count: number): string;
//   }
// }

// // Implementações das funções existentes
// String.prototype.retirarFormatacao = function (): string {
//   if (!this) return '';
//   return this.replace(/[^0-9]/g, '');
// };

// String.prototype.retirarFormatacaoTelefone = function (): string {
//   if (!this) return '';
//   return this.replace(/[^0-9]/g, '');
// };

// String.prototype.removeAcento = function (): string {
//   return this.replace(new RegExp('[áàâã]', 'gi'), 'a')
//     .replace(new RegExp('[éèê]', 'gi'), 'e')
//     .replace(new RegExp('[íìî]', 'gi'), 'i')
//     .replace(new RegExp('[óòôõ]', 'gi'), 'o')
//     .replace(new RegExp('[úùû]', 'gi'), 'u')
//     .replace(new RegExp('[ç]', 'gi'), 'c')
//     .replace(new RegExp('[ÁÀÂÃ]', 'gi'), 'A')
//     .replace(new RegExp('[ÉÈÊ]', 'gi'), 'E')
//     .replace(new RegExp('[ÍÌÎ]', 'gi'), 'I')
//     .replace(new RegExp('[ÓÒÔÕ]', 'gi'), 'O')
//     .replace(new RegExp('[ÚÙÛ]', 'gi'), 'U')
//     .replace(new RegExp('[Ç]', 'gi'), 'C');
// };

// String.prototype.mascaraCnpj = function (): string {
//   const value = this.retirarFormatacao();
//   if (value) {
//     return value.replace(
//       /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g,
//       '$1.$2.$3/$4-$5'
//     );
//   }
//   return this.toString();
// };

// String.prototype.mascaraCpf = function (): string {
//   const value = this.retirarFormatacao();
//   if (value) {
//     return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, '$1.$2.$3-$4');
//   }
//   return this.toString();
// };

// String.prototype.mascaraProcessoJuridico = function (): string {
//   const value = this.retirarFormatacao();
//   if (value) {
//     return value.replace(
//       /(\d{7})(\d{2})(\d{4})(\d{1})(\d{2})(\d{4})/g,
//       '$1-$2.$3.$4.$5.$6'
//     );
//   }
//   return this.toString();
// };

// String.prototype.pad = function (max: number): string {
//   let str = this.toString();
//   while (str.length < max) {
//     str = '0' + str;
//   }
//   return str.length > max ? str.substr(0, max) : str;
// };

// String.prototype.formatarEspacoDireita = function (max: number): string {
//   let str = this.toString();
//   while (str.length < max) {
//     str = str + ' ';
//   }
//   return str.length > max ? str.substr(0, max) : str;
// };

// String.prototype.isNullOrEmpty = function (): boolean {
//   return this == null || this == undefined || this.toString().trim() == '';
// };

// String.prototype.isNumeric = function (): boolean {
//   if (this == '') return true;
//   return !isNaN(Number(this));
// };

// // Novas extensões sugeridas
// String.prototype.capitalize = function (): string {
//   return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
// };

// String.prototype.truncate = function (maxLength: number, ellipsis: string = '...'): string {
//   if (this.length <= maxLength) return this.toString();
//   return this.slice(0, maxLength - ellipsis.length) + ellipsis;
// };

// String.prototype.reverse = function (): string {
//   return this.split('').reverse().join('');
// };

// String.prototype.isEmail = function (): boolean {
//   const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//   return emailRegex.test(this.toString());
// };

// String.prototype.isCpf = function (): boolean {
//   const cpf = this.retirarFormatacao();
//   if (cpf.length !== 11) return false;

//   if (/^(\d)\1+$/.test(cpf)) return false;

//   let soma = 0;
//   for (let i = 0; i < 9; i++) {
//     soma += parseInt(cpf.charAt(i)) * (10 - i);
//   }
//   let resto = 11 - (soma % 11);
//   let dv1 = resto > 9 ? 0 : resto;

//   if (parseInt(cpf.charAt(9)) !== dv1) return false;

//   soma = 0;
//   for (let i = 0; i < 10; i++) {
//     soma += parseInt(cpf.charAt(i)) * (11 - i);
//   }
//   resto = 11 - (soma % 11);
//   let dv2 = resto > 9 ? 0 : resto;

//   return parseInt(cpf.charAt(10)) === dv2;
// };

// String.prototype.isCnpj = function (): boolean {
//   const cnpj = this.retirarFormatacao();
//   if (cnpj.length !== 14) return false;

//   if (/^(\d)\1+$/.test(cnpj)) return false;

//   let tamanho = cnpj.length - 2;
//   let numeros = cnpj.substring(0, tamanho);
//   let digitos = cnpj.substring(tamanho);
//   let soma = 0;
//   let pos = tamanho - 7;

//   for (let i = tamanho; i >= 1; i--) {
//     soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
//     if (pos < 2) pos = 9;
//   }

//   let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
//   if (resultado !== parseInt(digitos.charAt(0))) return false;

//   tamanho += 1;
//   numeros = cnpj.substring(0, tamanho);
//   soma = 0;
//   pos = tamanho - 7;

//   for (let i = tamanho; i >= 1; i--) {
//     soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
//     if (pos < 2) pos = 9;
//   }

//   resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
//   return resultado === parseInt(digitos.charAt(1));
// };

// String.prototype.isDate = function (): boolean {
//   const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
//   const match = this.match(regex);

//   if (!match) return false;

//   const dia = parseInt(match[1], 10);
//   const mes = parseInt(match[2], 10) - 1;
//   const ano = parseInt(match[3], 10);

//   const data = new Date(ano, mes, dia);

//   return (
//     data.getDate() === dia &&
//     data.getMonth() === mes &&
//     data.getFullYear() === ano
//   );
// };

// String.prototype.slug = function (): string {
//   return this.toLowerCase()
//     .removeAcento()
//     .replace(/[^a-z0-9]+/g, '-')
//     .replace(/(^-|-$)/g, '');
// };

// String.prototype.extract = function (pattern: RegExp): string[] {
//   const matches = this.match(pattern);
//   return matches ? Array.from(matches) : [];
// };

// String.prototype.template = function (data: Record<string, any>): string {
//   return this.replace(/\{\{(\w+)\}\}/g, (match, key) => {
//     return data[key] !== undefined ? data[key] : match;
//   });
// };

// String.prototype.numberOnly = function (): string {
//   return this.replace(/[^0-9]/g, '');
// };

// String.prototype.camelCase = function (): string {
//   return this.toLowerCase()
//     .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
// };

// String.prototype.kebabCase = function (): string {
//   return this.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2')
//     .toLowerCase()
//     .replace(/[^a-z0-9-]/g, '');
// };

// String.prototype.snakeCase = function (): string {
//   return this.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1_$2')
//     .toLowerCase()
//     .replace(/[^a-z0-9_]/g, '');
// };

// String.prototype.pascalCase = function (): string {
//   return this.toLowerCase()
//     .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
//     .replace(/^(.)/, match => match.toUpperCase());
// };

// String.prototype.repeat = function (count: number): string {
//   if (count < 1) return '';
//   let result = '';
//   for (let i = 0; i < count; i++) {
//     result += this;
//   }
//   return result;
// };

// export { };
// //export default String.prototype; // Para evitar erro de exportação em módulos ES6
// // Se você estiver usando módulos ES6, remova esta linha e use exportações nomeadas
// // ou exportações padrão conforme necessário.
