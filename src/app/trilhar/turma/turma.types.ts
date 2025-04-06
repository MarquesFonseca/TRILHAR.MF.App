export interface TurmaModel {
  codigo: string;
  descricao: string;
  idadeInicialAluno: string;
  idadeFinalAluno: string;
  anoLetivo: number;
  semestreLetivo: number;
  limiteMaximo: number;
  ativo: boolean;
  codigoUsuarioLogado: string | null;
  dataAtualizacao: string | null;
  dataCadastro: string | null;
  }

  export interface TurmaView {
    codigo: string;
    descricao: string;
    idadeInicialAluno: string;
    idadeFinalAluno: string;
    anoLetivo: number;
    semestreLetivo: number;
    limiteMaximo: number;
    ativo: boolean;
    codigoUsuarioLogado: string | null;
    dataAtualizacao: string;
    dataCadastro: string;
    Action: any;
}
export interface TurmaOutput {
  codigo: string | null;
  descricao: string | null;
  descricaoAnoSemestreLetivo: string | null;
  idadeInicialAluno: string | null;
  idadeFinalAluno: string | null;
  anoLetivo: string | null;
  semestreLetivo: string | null;
  limiteMaximo: string | null;
  ativo: string | null;
  codigoUsuarioLogado: string | null;
  dataAtualizacao: string | null;
  dataCadastro: string | null;
}
