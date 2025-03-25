export interface FrequenciaData {
  Codigo: number;
  DataFrequencia: string;
  Presenca: number | boolean;
  CodigoUsuarioLogado: number | null;
  DataAtualizacao: string;
  DataCadastro: string;
  CodigoAluno: number;
  AlunoCodigoCadastro: number;
  AlunoNomeCrianca: string;
  AlunoDataNascimento: string;
  AlunoNomeMae: string;
  AlunoNomePai: string;
  AlunoOutroResponsavel: string | null;
  AlunoTelefone: string;
  AlunoEnderecoEmail: string | null;
  AlunoAlergia: number;
  AlunoDescricaoAlergia: string | null;
  AlunoRestricaoAlimentar: number;
  AlunoDescricaoRestricaoAlimentar: string | null;
  AlunoDeficienciaOuSituacaoAtipica: number;
  AlunoDescricaoDeficiencia: string | null;
  AlunoBatizado: number;
  AlunoDataBatizado: string | null;
  AlunoIgrejaBatizado: string | null;
  AlunoAtivo: number;
  CodigoTurma: number;
  TurmaDescricao: string;
  TurmaIdadeInicialAluno: string;
  TurmaIdadeFinalAluno: string;
  TurmaAnoLetivo: number;
  TurmaSemestreLetivo: number;
  TurmaLimiteMaximo: number;
  TurmaAtivo: number;
}

export interface FrequenciaStats {
  presentes: number;
  ausentes: number;
  total: number;
  taxaPresenca: number;
}

export interface FrequenciaTurma {
  turma: string;
  presentes: number;
  ausentes: number;
  total: number;
  taxaPresenca: number;
}

export interface FrequenciaPeriodo {
  periodo: string;
  presentes: number;
  ausentes: number;
  total: number;
  taxaPresenca: number;
}

export interface FiltroFrequencia {
  dataInicio?: string;
  dataFim?: string;
  turma?: string;
  apenasAtivas?: boolean;
}

export interface FrequenciaDiaria {
  data: string;
  turma: string;
  totalAlunos: number;
  presentes: number;
  ausentes: number;
  taxaPresenca: number;
}
