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
