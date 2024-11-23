export interface CriancaModel {
    codigo: number;
    codigoCadastro: string;
    nomeCrianca: string;
    dataNascimento: Date | null; // Pode ser string ou Date, dependendo de como você manipula datas
    nomeMae: string;
    nomePai: string;
    outroResponsavel: string;
    telefone: string;
    enderecoEmail: string | null;
    alergia: boolean;
    descricaoAlergia: string | null;
    restricaoAlimentar: boolean;
    descricaoRestricaoAlimentar: string | null;
    deficienciaOuSituacaoAtipica: boolean;
    descricaoDeficiencia: string | null;
    batizado: boolean;
    dataBatizado: Date | null; // Pode ser string ou Date
    igrejaBatizado: string | null;
    ativo: boolean;
    codigoUsuarioLogado: number | null;
    dataAtualizacao: Date | null; // Pode ser string ou Date
    dataCadastro: Date | null; // Pode ser string ou Date
  }

  export interface CriancaView {
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
