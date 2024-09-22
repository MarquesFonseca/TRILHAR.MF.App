export interface AlunoModel {
    Codigo: number;
    CodigoCadastro: string;
    NomeCrianca: string;
    DataNascimento: string; // Pode ser string ou Date, dependendo de como você manipula datas
    NomeMae: string;
    NomePai: string;
    OutroResponsavel: string;
    Telefone: string;
    EnderecoEmail: string | null;
    Alergia: boolean;
    DescricaoAlergia: string | null;
    RestricaoAlimentar: boolean;
    DescricaoRestricaoAlimentar: string | null;
    DeficienciaOuSituacaoAtipica: boolean;
    DescricaoDeficiencia: string | null;
    Batizado: boolean;
    DataBatizado: string | null; // Pode ser string ou Date
    IgrejaBatizado: string | null;
    Ativo: boolean;
    CodigoUsuarioLogado: string | null;
    DataAtualizacao: string; // Pode ser string ou Date
    DataCadastro: string; // Pode ser string ou Date
  }

  export interface AlunoView {
    Codigo: string;
    CodigoCadastro: string;
    NomeCrianca: string;
    DataNascimento: string;
    NomeMae: string;
    NomePai: string;
    OutroResponsavel: string;
    Telefone: string;
    EnderecoEmail: string | null;
    Alergia: boolean;
    DescricaoAlergia: String | null;
    RestricaoAlimentar: boolean;
    DescricaoRestricaoAlimentar: string | null;
    DeficienciaOuSituacaoAtipica: boolean;
    DescricaoDeficiencia: string | null;
    Batizado: boolean;
    DataBatizado: string | null;
    IgrejaBatizado: string | null;
    Ativo: boolean;
    CodigoUsuarioLogado: string | null;
    DataAtualizacao: string;
    DataCadastro: string;
    Action: any;
}
