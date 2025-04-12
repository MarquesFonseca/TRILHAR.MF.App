export interface IAlunoEntity {
  codigo: number;
  codigoCadastro: string;
  nomeCrianca: string;
  dataNascimento: Date | null;
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
  dataBatizado: Date | null;
  igrejaBatizado: string | null;
  ativo: boolean;
  codigoUsuarioLogado: number | null;
  dataAtualizacao: Date | null;
  dataCadastro: Date | null; // Pode ser string ou Date
}

export class IAlunoInput implements IAlunoEntity {
  codigo: number = 0;
  codigoCadastro: string = '';
  nomeCrianca: string = '';
  dataNascimento: Date | null = null;
  nomeMae: string = '';
  nomePai: string = '';
  outroResponsavel: string = '';
  telefone: string = '';
  enderecoEmail: string | null = null;
  alergia: boolean = false;
  descricaoAlergia: string | null = '';
  restricaoAlimentar: boolean = false;
  descricaoRestricaoAlimentar: string | null = '';
  deficienciaOuSituacaoAtipica: boolean = false;
  descricaoDeficiencia: string | null = '';
  batizado: boolean = false;
  dataBatizado: Date | null = null;
  igrejaBatizado: string | null = '';
  ativo: boolean = true; // Definido como true por padrão
  codigoUsuarioLogado: number | null = 0; // Pode ser nulo
  dataAtualizacao: Date | null = null; // Pode ser nulo
  dataCadastro: Date | null = null; // Data atual por padrão

  dataNascimentoInicial: Date | null = null;
  dataNascimentoFinal: Date | null = null;
  dataBatizadoInicial: Date | null = null;
  dataBatizadoFinal: Date | null = null;
  dataAtualizacaoInicial: Date | null = null;
  dataAtualizacaoFinal: Date | null = null;
  dataCadastroInicial: Date | null = null;
  dataCadastroFinal: Date | null = null;
  page: Number = 1;
  pageSize: number = 10;
  isPaginacao: boolean = true;
}

export class IAlunoOutput implements IAlunoEntity {
  codigo: number = 0;
  codigoCadastro: string = '';
  nomeCrianca: string = '';
  dataNascimento: Date | null = null;
  nomeMae: string = '';
  nomePai: string = '';
  outroResponsavel: string = '';
  telefone: string = '';
  enderecoEmail: string | null = null;
  alergia: boolean = false;
  descricaoAlergia: string | null = '';
  restricaoAlimentar: boolean = false;
  descricaoRestricaoAlimentar: string | null = '';
  deficienciaOuSituacaoAtipica: boolean = false;
  descricaoDeficiencia: string | null = '';
  batizado: boolean = false;
  dataBatizado: Date | null = null;
  igrejaBatizado: string | null = '';
  ativo: boolean = true; // Definido como true por padrão
  codigoUsuarioLogado: number | null = 0; // Pode ser nulo
  dataAtualizacao: Date | null = new Date(); // Pode ser nulo
  dataCadastro: Date | null = new Date(); // Data atual por padrão

  Action: any;
}
