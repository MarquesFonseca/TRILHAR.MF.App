import { IVMatriculaOutput } from "../matricula/vMatricula.types";

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

export class IAlunoInput {
  codigo: number = 0;
  codigoCadastro: string = '';
  nomeCrianca: string = '';
  dataNascimento: Date | null = null;
  nomeMae: string = '';
  nomePai: string = '';
  outroResponsavel: string = '';
  telefone: string = '';
  enderecoEmail: string | null = null;
  alergia?: boolean | null;
  descricaoAlergia: string | null = '';
  restricaoAlimentar?: boolean | null;
  descricaoRestricaoAlimentar: string | null = '';
  deficienciaOuSituacaoAtipica?: boolean | null;
  descricaoDeficiencia: string | null = '';
  batizado?: boolean | null;
  dataBatizado: Date | null = null;
  igrejaBatizado: string | null = '';
  ativo?: boolean | null;
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

export class IAlunoOutput {
  codigo: number = 0;
  codigoCadastro: string = '';
  nomeCrianca: string = '';
  dataNascimento: Date | null = null;
  nomeMae: string = '';
  nomePai: string = '';
  outroResponsavel: string = '';
  telefone: string = '';
  enderecoEmail: string | null = null;
  alergia: boolean | null = null;
  descricaoAlergia: string | null = '';
  restricaoAlimentar: boolean | null = null;
  descricaoRestricaoAlimentar: string | null = '';
  deficienciaOuSituacaoAtipica: boolean | null = null;
  descricaoDeficiencia: string | null = '';
  batizado: boolean | null = null;
  dataBatizado: Date | null = null;
  igrejaBatizado: string | null = '';
  ativo: boolean | null = null;
  codigoUsuarioLogado: number | null = 0; // Pode ser nulo
  dataAtualizacao: Date | null = null;
  dataCadastro: Date | null = null;
  matricula?: IVMatriculaOutput[] = [];

  Action: any;
}
