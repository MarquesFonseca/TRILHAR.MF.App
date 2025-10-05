import { DataOutPut } from "../calendario/calendario.component";

//#region Data

export function converterParaDataOutput(dataString: string): DataOutPut {
  const data = new Date(dataString);

  const dia = data.getDate().toString().padStart(2, '0');
  const mes = (data.getMonth() + 1).toString().padStart(2, '0');
  const ano = data.getFullYear().toString();
  const dataFormatada = `${dia}/${mes}/${ano}`;

  return {
    dia,
    mes,
    ano,
    data,
    dataFormatada
  };
}

export function formatDataToFormatoAnoMesDia(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // meses começam em 0
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatarDataBrasileira(data: string | Date): string {
  const date = new Date(data);

  if (isNaN(date.getTime())) return ''; // Verifica se a data é inválida

  const dia = String(date.getDate()).padStart(2, '0');
  const mes = String(date.getMonth() + 1).padStart(2, '0');
  const ano = date.getFullYear();

  return `${dia}/${mes}/${ano}`;
}

export function formatarData(data: Date): string {
  let dia = data.getDate().toString().padStart(2, '0');
  let mes = (data.getMonth() + 1).toString().padStart(2, '0'); //+1 pois no getMonth Janeiro começa com zero.
  let ano = data.getFullYear();
  return dia + '/' + mes + '/' + ano;
}

export function parseDataLocal(yyyyMmDd: string): Date {
  const [ano, mes, dia] = yyyyMmDd.split('-').map(Number);
  // mês -1 porque o Date usa 0 = janeiro
  return new Date(ano, mes - 1, dia);
}

export function parseDataLocalToString(yyyyMmDd: string): string {
  const [ano, mes, dia] = yyyyMmDd.split('-').map(Number);
  // mês -1 porque o Date usa 0 = janeiro
  return formatarData(new Date(ano, mes - 1, dia));
}

export function formatarDataComPontos(data: Date): string {
  let dia = data.getDate().toString().padStart(2, '0');
  let mes = (data.getMonth() + 1).toString().padStart(2, '0'); //+1 pois no getMonth Janeiro começa com zero.
  let ano = data.getFullYear();
  return dia + '.' + mes + '.' + ano;
}

export function dataString(data: Date): string {
  let dia = data.getDate().toString().padStart(2, '0');
  let mes = (data.getMonth() + 1).toString().padStart(2, '0');
  let ano = data.getFullYear();
  return dia + '/' + mes + '/' + ano;
}

export function extrairData(dataStr: string): { dia: number; mes: number; ano: number; } {
  // Divide a string em partes usando '/'
  const partes = dataStr.split('/');

  // Extrai o dia, mês e ano do array de partes
  const dia = parseInt(partes[0], 10);
  const mes = parseInt(partes[1], 10);
  const ano = parseInt(partes[2], 10);

  return { dia, mes, ano };
}

export function retornaDataByString(ataStr: string): Date {
  var retorno = new Date(extrairData(ataStr).ano, extrairData(ataStr).mes - 1, extrairData(ataStr).dia);
  return retorno;
}

export function retornaDataMaximaAteMesAnoAtual() {
  let data = new Date();
  let mes = data.getMonth();
  let ano = data.getFullYear();
  let dataMaxima = new Date(Number(ano), mes, 1);
  return dataMaxima;
}

export function obterDataHoraBrasileira(): Date {
  const dataAgora = new Date();
  const fusoHorarioBrasilia = -3; // Fuso horário de Brasília (UTC-3)

  // Converte a data atual para o fuso horário de Brasília
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
}

export function isDate(value: any): boolean {
  return value instanceof Date && !isNaN(value.getTime());
}

export function validarData(data: string): boolean {
  // Verifica se o formato é dd/MM/yyyy (com exatamente 4 dígitos para o ano)
  const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  const match = data.match(regex);

  if (!match) {
    return false; // Formato inválido (ano com menos ou mais de 4 dígitos, por exemplo)
  }

  const dia = parseInt(match[1], 10);
  const mes = parseInt(match[2], 10) - 1; // Meses em JavaScript são baseados em zero
  const ano = parseInt(match[3], 10);

  const dataConvertida = new Date(ano, mes, dia);

  // Verifica se a data gerada é válida e corresponde ao que foi fornecido
  return (
    dataConvertida.getDate() === dia &&
    dataConvertida.getMonth() === mes &&
    dataConvertida.getFullYear() === ano
  );
}

export function retornaPeriodoApuracaoDataAnoMesEDataFormatada(periodoApuracao: any) {
  var dataFormatada = dataString(
    isDate(periodoApuracao)
      ? periodoApuracao
      : new Date(periodoApuracao + '-01T00:00:00')
  );
  var dataAnoMes = periodoApuracao
    ? `${extrairData(dataFormatada).ano}-${extrairData(dataFormatada)
      .mes.toString()
      .padStart(2, '0')}`
    : '';
  return { dataAnoMes, dataFormatada };
}

export function retornaIdadeFormatadaAnoMesDia(dataNascimento: Date): string {
  try {
    if (!isNaN(dataNascimento.getTime())) {
      const dataAtual = new Date();

      // Calcula a diferença em milissegundos entre as datas
      const diferenca = dataAtual.getTime() - dataNascimento.getTime();
      const diasTotais = diferenca / (1000 * 3600 * 24); // Convertendo para dias

      const anos = Math.floor(diasTotais / 365.25); // Considerando anos bissextos
      const meses = Math.floor((diasTotais % 365.25) / 30.44); // Média de dias por mês
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
}

/**
 * Verifica se a pessoa faz aniversário em uma data específica
 * @param dataNascimento - Data de nascimento
 * @param dataReferencia - Data para verificar (opcional, padrão é hoje)
 * @returns true se for aniversário na data de referência, false caso contrário
*/
export function ehAniversarioNaData(
  dataNascimento: string | Date,
  dataReferencia: string | Date = new Date()
): boolean {
  try {
    const nascimento = typeof dataNascimento === 'string' ? new Date(dataNascimento) : dataNascimento;
    const referencia = typeof dataReferencia === 'string' ? new Date(dataReferencia) : dataReferencia;

    // Validações
    if (isNaN(nascimento.getTime()) || isNaN(referencia.getTime())) {
      return false;
    }

    return nascimento.getMonth() === referencia.getMonth() &&
      nascimento.getDate() === referencia.getDate();
  } catch (error) {
    console.error('Erro ao verificar aniversário:', error);
    return false;
  }
}
//#endregion


//#region Valor
export function formatarValor(valor: string) {
  const centavos = valor.substr(15, 2);
  const valorReal = Number(valor.substr(0, 15));
  return `${valorReal}.${centavos}`;
}

export function isNumeric(n: string | number) {
  if (n == '') return true;
  return !isNaN(Number(n));
}

export function formataValor(valor: string) {
  if (valor == '') return '0,00';

  let casas = valor.split('.');
  const centavos = casas.length > 1 ? casas[1] : '00';
  const valorReal = casas.length >= 1 ? casas[0] : '0';
  return `${valorReal},${centavos}`;
}

export function numberOnly(event: { which: any; keyCode: any }): boolean {
  const charCode = event.which ? event.which : event.keyCode;
  if (charCode > 31 && (charCode < 48 || charCode > 57)) {
    return false;
  }
  return true;
}

export function compararNumeros(a: any, b: any) {
  return a.id - b.id;
}
//#endregion


//#region String
export function isNullOrEmpty(value: any): boolean {
  let retorno =
    value == null || value == undefined || value.toString().trim() == '';
  return retorno;
}

export function pad(str: string, max: number) {
  str = str.toString();
  str = str.length < max ? pad('0' + str, max) : str; // zero à esquerda
  str = str.length > max ? str.substr(0, max) : str; // máximo de caracteres
  return str;
}

export function formatarEspacoDireita(str: string, max: number) {
  str = str.toString();
  str = str.length < max ? formatarEspacoDireita(str + ' ', max) : str; // espaço à direita
  str = str.length > max ? str.substr(0, max) : str; // máximo de caracteres
  return str;
}

export function retirarFormatacao(campoTexto: string) {
  if (!campoTexto) return '';

  // Remove todos os caracteres que não sejam números
  campoTexto = campoTexto.replace(/[^0-9]/g, '');

  return campoTexto;
}

export function mascaraProcessoJuridico(valor: string) {
  if (valor) {
    valor = valor.replace(
      /(\d{7})(\d{2})(\d{4})(\d{1})(\d{2})(\d{4})/g,
      '$1-$2.$3.$4.$5.$6'
    );
  }
  return valor;
}

export function mascaraCnpj(valor: string) {
  if (valor) {
    valor = valor.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g,
      '$1.$2.$3/$4-$5'
    );
  }
  return valor;
}

export function mascaraCpf(valor: string) {
  if (valor) {
    valor = valor.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, '$1.$2.$3-$4');
  }
  return valor;
}

export function removeAcento(text: string): string {
  return text.replace(new RegExp('[áàâã]', 'gi'), 'a')
    .replace(new RegExp('[éèê]', 'gi'), 'e')
    .replace(new RegExp('[íìî]', 'gi'), 'i')
    .replace(new RegExp('[óòôõ]', 'gi'), 'o')
    .replace(new RegExp('[úùû]', 'gi'), 'u')
    .replace(new RegExp('[ç]', 'gi'), 'c')
    .replace(new RegExp('[ÁÀÂÃ]', 'gi'), 'A')
    .replace(new RegExp('[ÉÈÊ]', 'gi'), 'E')
    .replace(new RegExp('[ÍÌÎ]', 'gi'), 'I')
    .replace(new RegExp('[ÓÒÔÕ]', 'gi'), 'O')
    .replace(new RegExp('[ÚÙÛ]', 'gi'), 'U')
    .replace(new RegExp('[Ç]', 'gi'), 'C');
}
//#endregion
