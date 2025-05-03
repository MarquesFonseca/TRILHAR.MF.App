// // src/app/shared/extensions/object-extensions.ts

// declare global {
//   interface Object {
//     /**
//      * Verifica se o objeto está vazio (sem chaves).
//      * @returns true se o objeto estiver vazio
//      * @example {}.isEmpty() --> true
//      */
//     isEmpty(): boolean;

//     /**
//      * Verifica se o objeto não está vazio (possui chaves).
//      * @returns true se o objeto não estiver vazio
//      * @example { nome: "João" }.isNotEmpty() --> true
//      */
//     isNotEmpty(): boolean;

//     /**
//      * Verifica se o objeto possui uma chave específica.
//      * @param key - Chave a ser verificada
//      * @returns true se a chave existir
//      * @example { nome: "João" }.hasKey("nome") --> true
//      */
//     hasKey(key: string): boolean;

//     /**
//      * Obtém um valor através de um caminho de propriedades.
//      * @param path - Caminho das propriedades separado por pontos
//      * @returns O valor encontrado ou undefined
//      * @example { usuario: { nome: "João" } }.getValueByPath("usuario.nome") --> "João"
//      */
//     getValueByPath(path: string): any;

//     /**
//      * Define um valor através de um caminho de propriedades.
//      * @param path - Caminho das propriedades separado por pontos
//      * @param value - Valor a ser definido
//      * @returns O próprio objeto
//      * @example { usuario: {} }.setValueByPath("usuario.nome", "João") --> { usuario: { nome: "João" } }
//      */
//     setValueByPath(path: string, value: any): this;

//     /**
//      * Cria uma cópia profunda do objeto.
//      * @returns Uma nova instância com os mesmos dados
//      * @example { a: 1, b: { c: 2 } }.clone() --> { a: 1, b: { c: 2 } }
//      */
//     clone(): this;

//     /**
//      * Mescla o objeto atual com outro objeto.
//      * @param source - Objeto a ser mesclado
//      * @returns Novo objeto com as propriedades combinadas
//      * @example { a: 1 }.mergeWith({ b: 2 }) --> { a: 1, b: 2 }
//      */
//     mergeWith<T>(source: T): this & T;

//     /**
//      * Seleciona apenas as chaves especificadas do objeto.
//      * @param keys - Array com as chaves a serem selecionadas
//      * @returns Novo objeto com apenas as chaves selecionadas
//      * @example { a: 1, b: 2, c: 3 }.pick(["a", "c"]) --> { a: 1, c: 3 }
//      */
//     pick(keys: string[]): Record<string, any>;

//     /**
//      * Remove as chaves especificadas do objeto.
//      * @param keys - Array com as chaves a serem removidas
//      * @returns Novo objeto sem as chaves especificadas
//      * @example { a: 1, b: 2, c: 3 }.omit(["b"]) --> { a: 1, c: 3 }
//      */
//     omit(keys: string[]): Record<string, any>;

//     /**
//      * Transforma o objeto usando uma função de mapeamento.
//      * @param mapper - Função que recebe chave e valor e retorna [novaChave, novoValor]
//      * @returns Novo objeto transformado
//      * @example { a: 1, b: 2 }.transform((k, v) => [k.toUpperCase(), v * 2]) --> { A: 2, B: 4 }
//      */
//     transform<T>(mapper: (key: string, value: any) => [string, any]): T;

//     /**
//      * Congela o objeto, tornando-o imutável.
//      * @returns O objeto congelado
//      * @example obj.freeze() não permite mais modificações
//      */
//     freeze(): Readonly<this>;

//     /**
//      * Sela o objeto, impedindo adição de novas propriedades.
//      * @returns O objeto selado
//      * @example obj.seal() permite modificar propriedades existentes, mas não adicionar novas
//      */
//     seal(): this;

//     /**
//      * Converte o objeto para uma query string.
//      * @returns String formatada como query params
//      * @example { nome: "João", idade: 30 }.toQueryString() --> "nome=Jo%C3%A3o&idade=30"
//      */
//     toQueryString(): string;

//     /**
//      * Converte o objeto para variáveis CSS.
//      * @returns String com variáveis CSS
//      * @example { primaryColor: "#007bff", fontSize: "16px" }.toCSSVariables() --> "--primary-color: #007bff;\n--font-size: 16px;"
//      */
//     toCSSVariables(): string;

//     /**
//      * Compara com outro objeto e retorna as diferenças.
//      * @param other - Objeto para comparação
//      * @returns Objeto com as diferenças encontradas
//      * @example { a: 1, b: 2 }.diff({ a: 1, b: 3 }) --> { b: { oldValue: 2, newValue: 3 } }
//      */
//     diff(other: object): { [key: string]: { oldValue: any; newValue: any } };
//   }
// }

// // Implementações
// Object.prototype.isEmpty = function (): boolean {
//   return Object.keys(this).length === 0;
// };

// Object.prototype.isNotEmpty = function (): boolean {
//   return Object.keys(this).length > 0;
// };

// Object.prototype.hasKey = function (key: string): boolean {
//   return key in this;
// };

// Object.prototype.getValueByPath = function (path: string): any {
//   return path.split('.').reduce((obj, key) => obj && (obj as any)[key], this);
// };

// Object.prototype.setValueByPath = function (path: string, value: any): object {
//   const keys = path.split('.');
//   const lastKey = keys.pop()!;
//   const target = keys.reduce((obj, key) => {
//     const castedObj = obj as any;
//     if (!(key in castedObj)) {
//       castedObj[key] = {};
//     }
//     return castedObj[key];
//   }, this as any);

//   target[lastKey] = value;
//   return this;
// };

// Object.prototype.clone = function <T>(): T {
//   return JSON.parse(JSON.stringify(this)) as T;
// };

// Object.prototype.mergeWith = function <T>(source: T): object & T {
//   return Object.assign({}, this, source);
// };

// Object.prototype.pick = function (keys: string[]): Record<string, any> {
//   const result: Record<string, any> = {};
//   const obj = this as Record<string, any>;
//   keys.forEach(key => {
//     if (key in obj) {
//       result[key] = obj[key];
//     }
//   });
//   return result;
// };

// Object.prototype.omit = function (keys: string[]): Record<string, any> {
//   const result = { ...this } as Record<string, any>;
//   keys.forEach(key => {
//     delete result[key];
//   });
//   return result;
// };

// Object.prototype.transform = function <T>(mapper: (key: string, value: any) => [string, any]): T {
//   const result = {} as T;
//   Object.entries(this).forEach(([key, value]) => {
//     const [newKey, newValue] = mapper(key, value);
//     (result as any)[newKey] = newValue;
//   });
//   return result;
// };

// Object.prototype.freeze = function <T>(): Readonly<T> {
//   return Object.freeze(this) as Readonly<T>;
// };

// Object.prototype.seal = function <T>(): T {
//   return Object.seal(this) as T;
// };

// Object.prototype.toQueryString = function (): string {
//   return Object.entries(this)
//     .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
//     .join('&');
// };

// Object.prototype.toCSSVariables = function (): string {
//   return Object.entries(this)
//     .map(([key, value]) => `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value};`)
//     .join('\n');
// };

// Object.prototype.diff = function (other: object): { [key: string]: { oldValue: any; newValue: any } } {
//   const diff: { [key: string]: { oldValue: any; newValue: any } } = {};
//   const thisObj = this as Record<string, any>;
//   const otherObj = other as Record<string, any>;
//   const allKeys = new Set([...Object.keys(thisObj), ...Object.keys(otherObj)]);

//   allKeys.forEach(key => {
//     if (thisObj[key] !== otherObj[key]) {
//       diff[key] = {
//         oldValue: thisObj[key],
//         newValue: otherObj[key]
//       };
//     }
//   });

//   return diff;
// };

// export { };
