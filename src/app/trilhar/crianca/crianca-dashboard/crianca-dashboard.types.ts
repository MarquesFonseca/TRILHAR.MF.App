export interface CriancaData {
  Codigo: number;
  CodigoCadastro: number;
  NomeCrianca: string;
  DataNascimento: string;
  NomeMae: string;
  NomePai: string;
  OutroResponsavel: string | null;
  Telefone: string;
  EnderecoEmail: string | null;
  Alergia: number;
  DescricaoAlergia: string | null;
  RestricaoAlimentar: number;
  DescricaoRestricaoAlimentar: string | null;
  DeficienciaOuSituacaoAtipica: number;
  DescricaoDeficiencia: string | null;
  Batizado: number;
  DataBatizado: string | null;
  IgrejaBatizado: string | null;
  Ativo: number;
  CodigoUsuarioLogado: number | null;
  DataAtualizacao: string;
  DataCadastro: string;
}

export interface ContagemGrafico {
  labels: string[];
  data: number[];
}

export interface FaixaEtaria {
  faixa: string;
  quantidade: number;
}
