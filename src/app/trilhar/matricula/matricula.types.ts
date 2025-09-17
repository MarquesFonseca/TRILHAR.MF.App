export interface MatriculaEntity {
  codigo: number;
  codigoAluno: number;
  codigoTurma: number;
  ativo: boolean;
  codigoUsuarioLogado: number | null;
  dataAtualizacao: Date | null;
  dataCadastro: Date | null;
}

export interface MatriculaInput extends Partial<MatriculaEntity> { }

export interface MatriculaOutput extends Partial<MatriculaEntity> { }
