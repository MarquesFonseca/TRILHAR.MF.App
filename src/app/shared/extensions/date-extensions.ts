// src/app/extensions/date-extensions.ts

declare global {
  interface Date {
    /**
     * Formata data no padrão brasileiro dd/MM/yyyy.
     * @returns String formatada
     * @example new Date("2024-12-31").formatarData() --> "31/12/2024"
     */
    formatarData(): string;

    /**
     * Formata data com pontos (dd.MM.yyyy).
     * @returns String formatada
     * @example new Date("2024-12-31").formatarDataComPontos() --> "31.12.2024"
     */
    formatarDataComPontos(): string;

    /**
     * Converte data para string (dd/MM/yyyy).
     * @returns String formatada
     * @example new Date("2024-12-31").dataString() --> "31/12/2024"
     */
    dataString(): string;

    /**
     * Formata data no formato brasileiro.
     * @returns String formatada ou vazia se inválida
     * @example new Date("2024-12-31").formatarDataBrasileira() --> "31/12/2024"
     */
    formatarDataBrasileira(): string;

    /**
     * Retorna idade formatada em anos, meses e dias.
     * @returns String com idade formatada
     * @example new Date("2000-01-01").retornaIdadeFormatadaAnoMesDia() --> "24 anos 0 meses e 0 dias"
     */
    retornaIdadeFormatadaAnoMesDia(): string;

    /**
     * Adiciona dias à data.
     * @param days - Número de dias
     * @returns Nova data
     * @example date.addDays(5) --> Nova data com 5 dias depois
     */
    addDays(days: number): Date;

    /**
     * Subtrai dias da data.
     * @param days - Número de dias
     * @returns Nova data
     * @example date.subtractDays(5) --> Nova data com 5 dias antes
     */
    subtractDays(days: number): Date;

    /**
     * Adiciona meses à data.
     * @param months - Número de meses
     * @returns Nova data
     * @example date.addMonths(3) --> Nova data com 3 meses depois
     */
    addMonths(months: number): Date;

    /**
     * Adiciona anos à data.
     * @param years - Número de anos
     * @returns Nova data
     * @example date.addYears(1) --> Nova data com 1 ano depois
     */
    addYears(years: number): Date;

    /**
     * Início do dia (00:00:00).
     * @returns Nova data
     * @example date.startOfDay() --> Data às 00:00:00
     */
    startOfDay(): Date;

    /**
     * Final do dia (23:59:59).
     * @returns Nova data
     * @example date.endOfDay() --> Data às 23:59:59
     */
    endOfDay(): Date;

    /**
     * Primeiro dia do mês.
     * @returns Nova data
     * @example date.startOfMonth() --> Primeiro dia do mês às 00:00:00
     */
    startOfMonth(): Date;

    /**
     * Último dia do mês.
     * @returns Nova data
     * @example date.endOfMonth() --> Último dia do mês às 23:59:59
     */
    endOfMonth(): Date;

    /**
     * Primeiro dia do ano.
     * @returns Nova data
     * @example date.startOfYear() --> 01/01 às 00:00:00
     */
    startOfYear(): Date;

    /**
     * Último dia do ano.
     * @returns Nova data
     * @example date.endOfYear() --> 31/12 às 23:59:59
     */
    endOfYear(): Date;

    /**
     * Verifica se é futura.
     * @returns true se for maior que a data atual
     * @example date.isFuture() --> true/false
     */
    isFuture(): boolean;

    /**
     * Verifica se é passada.
     * @returns true se for menor que a data atual
     * @example date.isPast() --> true/false
     */
    isPast(): boolean;

    /**
     * Verifica se é hoje.
     * @returns true se for a data de hoje
     * @example date.isToday() --> true/false
     */
    isToday(): boolean;

    /**
     * Verifica se é o mesmo dia.
     * @param date - Data para comparação
     * @returns true se for o mesmo dia
     * @example date1.isSameDay(date2) --> true/false
     */
    isSameDay(date: Date): boolean;

    /**
     * Verifica se é o mesmo mês.
     * @param date - Data para comparação
     * @returns true se for o mesmo mês e ano
     * @example date1.isSameMonth(date2) --> true/false
     */
    isSameMonth(date: Date): boolean;

    /**
     * Verifica se é o mesmo ano.
     * @param date - Data para comparação
     * @returns true se for o mesmo ano
     * @example date1.isSameYear(date2) --> true/false
     */
    isSameYear(date: Date): boolean;

    /**
     * Verifica se é fim de semana.
     * @returns true se for sábado ou domingo
     * @example date.isWeekend() --> true/false
     */
    isWeekend(): boolean;

    /**
     * Verifica se é dia útil.
     * @returns true se for de segunda a sexta
     * @example date.isWeekday() --> true/false
     */
    isWeekday(): boolean;

    /**
     * Calcula idade completa.
     * @returns Idade em anos
     * @example birthDate.toAge() --> 25
     */
    toAge(): number;

    /**
     * Dia do ano (1-366).
     * @returns Número do dia no ano
     * @example date.toDayOfYear() --> 365
     */
    toDayOfYear(): number;

    /**
     * Semana do ano.
     * @returns Número da semana
     * @example date.toWeekOfYear() --> 52
     */
    toWeekOfYear(): number;

    /**
     * Trimestre do ano (1-4).
     * @returns Número do trimestre
     * @example date.getQuarter() --> 4
     */
    getQuarter(): number;

    /**
     * Verifica se está em uma faixa.
     * @param start - Data inicial
     * @param end - Data final
     * @returns true se estiver no intervalo
     * @example date.isInRange(start, end) --> true/false
     */
    isInRange(start: Date, end: Date): boolean;

    /**
     * Formata data com padrão personalizado.
     * @param pattern - Padrão de formatação
     * @returns String formatada
     * @example date.format("dd/MM/yyyy") --> "25/12/2024"
     */
    format(pattern: string): string;

    /**
     * Converte para horário brasileiro (UTC-3).
     * @returns Data no fuso horário brasileiro
     * @example date.toBrazilianTime() --> Date
     */
    toBrazilianTime(): Date;
  }
}

// Implementações das funções existentes
Date.prototype.formatarData = function (): string {
  let dia = this.getDate().toString().padStart(2, '0');
  let mes = (this.getMonth() + 1).toString().padStart(2, '0');
  let ano = this.getFullYear();
  return dia + '/' + mes + '/' + ano;
};

Date.prototype.formatarDataComPontos = function (): string {
  let dia = this.getDate().toString().padStart(2, '0');
  let mes = (this.getMonth() + 1).toString().padStart(2, '0');
  let ano = this.getFullYear();
  return dia + '.' + mes + '.' + ano;
};

Date.prototype.dataString = function (): string {
  let dia = this.getDate().toString().padStart(2, '0');
  let mes = (this.getMonth() + 1).toString().padStart(2, '0');
  let ano = this.getFullYear();
  return dia + '/' + mes + '/' + ano;
};

Date.prototype.formatarDataBrasileira = function (): string {
  if (isNaN(this.getTime())) return '';

  const dia = String(this.getDate()).padStart(2, '0');
  const mes = String(this.getMonth() + 1).padStart(2, '0');
  const ano = this.getFullYear();

  return `${dia}/${mes}/${ano}`;
};

Date.prototype.retornaIdadeFormatadaAnoMesDia = function (): string {
  try {
    if (!isNaN(this.getTime())) {
      const dataAtual = new Date();

      const diferenca = dataAtual.getTime() - this.getTime();
      const diasTotais = diferenca / (1000 * 3600 * 24);

      const anos = Math.floor(diasTotais / 365.25);
      const meses = Math.floor((diasTotais % 365.25) / 30.44);
      const dias = Math.floor(diasTotais % 30.44);

      let resultado = `${anos} ano${anos !== 1 ? 's' : ''} `;
      resultado += `${meses} ${meses <= 1 ? 'mês' : meses > 1 ? 'meses' : ''} e `;
      resultado += `${dias} dia${dias !== 1 ? 's' : ''}`;

      return resultado;
    } else {
      return '';
    }
  } catch (error) {
    return '';
  }
};

// Novas extensões sugeridas
Date.prototype.addDays = function (days: number): Date {
  const date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
};

Date.prototype.subtractDays = function (days: number): Date {
  return this.addDays(-days);
};

Date.prototype.addMonths = function (months: number): Date {
  const date = new Date(this.valueOf());
  date.setMonth(date.getMonth() + months);
  return date;
};

Date.prototype.addYears = function (years: number): Date {
  const date = new Date(this.valueOf());
  date.setFullYear(date.getFullYear() + years);
  return date;
};

Date.prototype.startOfDay = function (): Date {
  const date = new Date(this.valueOf());
  date.setHours(0, 0, 0, 0);
  return date;
};

Date.prototype.endOfDay = function (): Date {
  const date = new Date(this.valueOf());
  date.setHours(23, 59, 59, 999);
  return date;
};

Date.prototype.startOfMonth = function (): Date {
  const date = new Date(this.valueOf());
  date.setDate(1);
  date.setHours(0, 0, 0, 0);
  return date;
};

Date.prototype.endOfMonth = function (): Date {
  const date = new Date(this.valueOf());
  date.setMonth(date.getMonth() + 1, 0);
  date.setHours(23, 59, 59, 999);
  return date;
};

Date.prototype.startOfYear = function (): Date {
  const date = new Date(this.valueOf());
  date.setMonth(0, 1);
  date.setHours(0, 0, 0, 0);
  return date;
};

Date.prototype.endOfYear = function (): Date {
  const date = new Date(this.valueOf());
  date.setMonth(11, 31);
  date.setHours(23, 59, 59, 999);
  return date;
};

Date.prototype.isFuture = function (): boolean {
  return this > new Date();
};

Date.prototype.isPast = function (): boolean {
  return this < new Date();
};

Date.prototype.isToday = function (): boolean {
  const today = new Date();
  return this.isSameDay(today);
};

Date.prototype.isSameDay = function (date: Date): boolean {
  return this.getDate() === date.getDate() &&
    this.getMonth() === date.getMonth() &&
    this.getFullYear() === date.getFullYear();
};

Date.prototype.isSameMonth = function (date: Date): boolean {
  return this.getMonth() === date.getMonth() &&
    this.getFullYear() === date.getFullYear();
};

Date.prototype.isSameYear = function (date: Date): boolean {
  return this.getFullYear() === date.getFullYear();
};

Date.prototype.isWeekend = function (): boolean {
  const day = this.getDay();
  return day === 0 || day === 6;
};

Date.prototype.isWeekday = function (): boolean {
  return !this.isWeekend();
};

Date.prototype.toAge = function (): number {
  const today = new Date();
  let age = today.getFullYear() - this.getFullYear();
  const m = today.getMonth() - this.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < this.getDate())) {
    age--;
  }
  return age;
};

Date.prototype.toDayOfYear = function (): number {
  const start = new Date(this.getFullYear(), 0, 0);
  const diff = this.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
};

Date.prototype.toWeekOfYear = function (): number {
  const startOfYear = new Date(this.getFullYear(), 0, 1);
  const days = Math.floor((this.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
  return Math.floor(days / 7) + 1;
};

Date.prototype.getQuarter = function (): number {
  return Math.floor(this.getMonth() / 3) + 1;
};

Date.prototype.isInRange = function (start: Date, end: Date): boolean {
  return this >= start && this <= end;
};

Date.prototype.format = function (pattern: string): string {
  const o: any = {
    'M+': this.getMonth() + 1,
    'd+': this.getDate(),
    'h+': this.getHours(),
    'm+': this.getMinutes(),
    's+': this.getSeconds(),
    'q+': this.getQuarter(),
    'S': this.getMilliseconds()
  };

  if (/(y+)/.test(pattern)) {
    pattern = pattern.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
  }

  for (const k in o) {
    if (new RegExp('(' + k + ')').test(pattern)) {
      pattern = pattern.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
    }
  }

  return pattern;
};

Date.prototype.toBrazilianTime = function (): Date {
  const dataAgora = new Date(this.valueOf());
  const fusoHorarioBrasilia = -3;

  const dataBrasileira = new Date(
    dataAgora.getUTCFullYear(),
    dataAgora.getUTCMonth(),
    dataAgora.getUTCDate(),
    dataAgora.getUTCHours() + fusoHorarioBrasilia,
    dataAgora.getUTCMinutes(),
    dataAgora.getUTCSeconds(),
    dataAgora.getUTCMilliseconds()
  );

  return dataBrasileira;
};

export { };
