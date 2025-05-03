// src/app/shared/extensions/array-extensions.ts

declare global {
  interface Array<T> {
    /**
     * Retorna o primeiro elemento do array.
     * @returns Primeiro elemento ou undefined se vazio
     * @example [1, 2, 3].first() --> 1
     */
    first(): T | undefined;

    /**
     * Retorna o último elemento do array.
     * @returns Último elemento ou undefined se vazio
     * @example [1, 2, 3].last() --> 3
     */
    last(): T | undefined;

    /**
     * Verifica se o array está vazio.
     * @returns true se não tiver elementos
     * @example [].isEmpty() --> true
     */
    isEmpty(): boolean;

    /**
     * Verifica se o array não está vazio.
     * @returns true se tiver elementos
     * @example [1].isNotEmpty() --> true
     */
    isNotEmpty(): boolean;

    /**
     * Divide o array em grupos menores.
     * @param size - Tamanho de cada grupo
     * @returns Array de arrays com o tamanho especificado
     * @example [1, 2, 3, 4, 5].chunk(2) --> [[1, 2], [3, 4], [5]]
     */
    chunk(size: number): T[][];

    /**
     * Remove duplicatas do array.
     * @returns Novo array sem duplicatas
     * @example [1, 2, 2, 3].unique() --> [1, 2, 3]
     */
    unique(): T[];

    /**
     * Remove duplicatas baseado em uma propriedade.
     * @param keySelector - Função que seleciona a chave para comparação
     * @returns Novo array sem duplicatas
     * @example [{id:1}, {id:2}, {id:1}].uniqueBy(x => x.id) --> [{id:1}, {id:2}]
     */
    uniqueBy<K>(keySelector: (item: T) => K): T[];

    /**
     * Agrupa elementos por uma chave.
     * @param keySelector - Função que seleciona a chave para agrupamento
     * @returns Objeto com arrays agrupados
     * @example [{type:'a', val:1}, {type:'b', val:2}].groupBy(x => x.type) --> {a: [{...}], b: [{...}]}
     */
    groupBy<K>(keySelector: (item: T) => K): { [key: string]: T[] };

    /**
     * Ordena o array por uma propriedade.
     * @param keySelector - Função que seleciona a chave para ordenação
     * @param direction - Direção da ordenação ('asc' ou 'desc')
     * @returns Novo array ordenado
     * @example [{age:30}, {age:20}].orderBy(x => x.age) --> [{age:20}, {age:30}]
     */
    orderBy<K>(keySelector: (item: T) => K, direction?: 'asc' | 'desc'): T[];

    /**
     * Calcula a soma dos elementos.
     * @param keySelector - Função opcional para selecionar valor numérico
     * @returns Soma dos valores
     * @example [1, 2, 3].sum() --> 6
     * @example [{val:1}, {val:2}].sum(x => x.val) --> 3
     */
    sum(keySelector?: (item: T) => number): number;

    /**
     * Calcula a média dos elementos.
     * @param keySelector - Função opcional para selecionar valor numérico
     * @returns Média dos valores
     * @example [2, 4, 6].average() --> 4
     */
    average(keySelector?: (item: T) => number): number;

    /**
     * Encontra o elemento com valor máximo.
     * @param keySelector - Função que seleciona o valor para comparação
     * @returns Elemento com maior valor
     * @example [{val:1}, {val:3}, {val:2}].maxBy(x => x.val) --> {val:3}
     */
    maxBy<K>(keySelector: (item: T) => K): T | undefined;

    /**
     * Encontra o elemento com valor mínimo.
     * @param keySelector - Função que seleciona o valor para comparação
     * @returns Elemento com menor valor
     * @example [{val:1}, {val:3}, {val:2}].minBy(x => x.val) --> {val:1}
     */
    minBy<K>(keySelector: (item: T) => K): T | undefined;

    /**
     * Verifica se contém um elemento.
     * @param item - Elemento a ser procurado
     * @returns true se o elemento existir
     * @example [1, 2, 3].contains(2) --> true
     */
    contains(item: T): boolean;

    /**
     * Remove a primeira ocorrência de um elemento.
     * @param item - Elemento a ser removido
     * @returns Novo array sem o elemento
     * @example [1, 2, 2, 3].remove(2) --> [1, 2, 3]
     */
    remove(item: T): T[];

    /**
     * Remove elemento em uma posição específica.
     * @param index - Índice do elemento a ser removido
     * @returns Novo array sem o elemento
     * @example [1, 2, 3].removeAt(1) --> [1, 3]
     */
    removeAt(index: number): T[];

    /**
     * Substitui todas as ocorrências de um elemento.
     * @param oldItem - Elemento a ser substituído
     * @param newItem - Novo elemento
     * @returns Novo array com substituições
     * @example [1, 2, 1, 3].replace(1, 9) --> [9, 2, 9, 3]
     */
    replace(oldItem: T, newItem: T): T[];

    /**
     * Limpa o array.
     * @returns Array vazio
     * @example [1, 2, 3].clear() --> []
     */
    clear(): T[];

    /**
     * Conta elementos que atendem uma condição.
     * @param predicate - Função de condição
     * @returns Número de elementos
     * @example [1, 2, 3, 4].count(x => x % 2 === 0) --> 2
     */
    count(predicate?: (item: T) => boolean): number;

    /**
     * Verifica se algum elemento atende a condição.
     * @param predicate - Função de condição
     * @returns true se algum elemento atender
     * @example [1, 2, 3].any(x => x > 2) --> true
     */
    any(predicate?: (item: T) => boolean): boolean;

    /**
     * Verifica se todos os elementos atendem a condição.
     * @param predicate - Função de condição
     * @returns true se todos atenderem
     * @example [2, 4, 6].all(x => x % 2 === 0) --> true
     */
    all(predicate?: (item: T) => boolean): boolean;

    /**
     * Embaralha os elementos aleatoriamente.
     * @returns Novo array embaralhado
     * @example [1, 2, 3].shuffle() --> [3, 1, 2] (ordem aleatória)
     */
    shuffle(): T[];

    /**
     * Seleciona um elemento aleatório.
     * @returns Elemento aleatório ou undefined se vazio
     * @example [1, 2, 3].random() --> 2 (valor aleatório)
     */
    random(): T | undefined;

    /**
     * Retorna os primeiros N elementos.
     * @param count - Quantidade de elementos
     * @returns Novo array com os primeiros elementos
     * @example [1, 2, 3, 4, 5].takeFirst(3) --> [1, 2, 3]
     */
    takeFirst(count: number): T[];

    /**
     * Retorna os últimos N elementos.
     * @param count - Quantidade de elementos
     * @returns Novo array com os últimos elementos
     * @example [1, 2, 3, 4, 5].takeLast(3) --> [3, 4, 5]
     */
    takeLast(count: number): T[];

    /**
     * Pula os primeiros N elementos.
     * @param count - Quantidade de elementos para pular
     * @returns Novo array sem os primeiros elementos
     * @example [1, 2, 3, 4, 5].skipFirst(2) --> [3, 4, 5]
     */
    skipFirst(count: number): T[];

    /**
     * Pula os últimos N elementos.
     * @param count - Quantidade de elementos para pular
     * @returns Novo array sem os últimos elementos
     * @example [1, 2, 3, 4, 5].skipLast(2) --> [1, 2, 3]
     */
    skipLast(count: number): T[];

    /**
     * Encontra o índice baseado em uma condição.
     * @param predicate - Função de condição
     * @returns Índice encontrado ou -1
     * @example [1, 2, 3].customFindIndex(x => x > 1) --> 1
     */
    customFindIndex(predicate: (item: T) => boolean): number;

    /**
     * Separa o array em duas partes baseado em uma condição.
     * @param predicate - Função de condição
     * @returns Tupla com dois arrays [passaram, não passaram]
     * @example [1, 2, 3, 4].partition(x => x % 2 === 0) --> [[2, 4], [1, 3]]
     */
    partition(predicate: (item: T) => boolean): [T[], T[]];

    /**
     * Cria um array com sequência numérica.
     * @param start - Número inicial
     * @param end - Número final
     * @returns Array com sequência
     * @example [].range(1, 5) --> [1, 2, 3, 4, 5]
     */
    range(start: number, end: number): number[];
  }
}

// ... implmentações permanecem iguais

export { };
