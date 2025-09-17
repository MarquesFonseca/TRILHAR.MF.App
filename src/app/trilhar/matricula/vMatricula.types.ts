export interface IVMatriculaEntity {
  codigo: number;
  codigoAluno: number;
  codigoTurma: number;
  ativo: boolean;
  codigoUsuarioLogado: number;
  dataAtualizacao: Date | null;
  dataCadastro: Date | null;

  alunoCodigoCadastro: string;
  alunoNomeCrianca: string;
  alunoDataNascimento: Date | null;
  alunoNomeMae: string | null;
  alunoNomePai: string | null;
  alunoOutroResponsavel: string | null;
  alunoTelefone: string | null;
  alunoEnderecoEmail: string | null;

  alunoAlergia: boolean;
  alunoDescricaoAlergia: string | null;
  alunoRestricaoAlimentar: boolean;
  alunoDescricaoRestricaoAlimentar: string | null;
  alunoDeficienciaOuSituacaoAtipica: boolean;
  alunoDescricaoDeficiencia: string | null;
  alunoBatizado: boolean;
  alunoDataBatizado: Date | null;
  alunoIgrejaBatizado: string | null;
  alunoAtivo: boolean;

  turmaDescricao: string;
  turmaIdadeInicialAluno: Date | null;
  turmaIdadeFinalAluno: Date | null;
  turmaAnoLetivo: number;
  turmaSemestreLetivo: number;
  turmaAtivo: boolean;
}

export interface IVMatriculaInput {
  codigo?: number;
  codigoAluno?: number;
  codigoTurma?: number;
  ativo?: boolean;
  codigoUsuarioLogado?: number;
  dataAtualizacao?: Date | null;
  dataCadastro?: Date | null;

  alunoCodigoCadastro: string;
  alunoNomeCrianca: string;
  alunoDataNascimento?: Date | null;
  alunoNomeMae?: string;
  alunoNomePai?: string;
  alunoOutroResponsavel?: string;
  alunoTelefone?: string;
  alunoEnderecoEmail?: string;

  alunoAlergia?: boolean;
  alunoDescricaoAlergia?: string;
  alunoRestricaoAlimentar?: boolean;
  alunoDescricaoRestricaoAlimentar?: string;
  alunoDeficienciaOuSituacaoAtipica?: boolean;
  alunoDescricaoDeficiencia?: string;
  alunoBatizado?: boolean;
  alunoDataBatizado?: Date | null;
  alunoIgrejaBatizado?: string;
  alunoAtivo?: boolean;

  turmaDescricao: string;
  turmaIdadeInicialAluno?: Date | null;
  turmaIdadeFinalAluno?: Date | null;
  turmaAnoLetivo?: number;
  turmaSemestreLetivo?: number;
  turmaAtivo?: boolean;

  // Campos adicionais para filtros
  dataNascimentoInicial?: Date | null;
  dataNascimentoFinal?: Date | null;
  dataBatizadoInicial?: Date | null;
  dataBatizadoFinal?: Date | null;
  dataAtualizacaoInicial?: Date | null;
  dataAtualizacaoFinal?: Date | null;
  dataCadastroInicial?: Date | null;
  dataCadastroFinal?: Date | null;

  // Campos de paginação
  page: number;
  pageSize: number;
  isPaginacao: boolean;
}

export interface IVMatriculaOutput extends Partial<IVMatriculaEntity> {
  Action: any;
}
