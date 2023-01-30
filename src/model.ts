export enum HTTP_ERRORS {
  ERRO_BANCO = 402,
  ACESSO_NAO_AUTORIZADO = 401,
  ROTA_NAO_ENCONTRADA = 404,
  SOLICITACAO = 550, // Error in the request sent by the app
  ERRO_INTERNO = 500, // Unmapped error
  ERRO_API_EXTERNA = 403, // Error when performing an external request
}

export enum TypeTransaction {
  DEPOSITO = 1,
  SAQUE = 2,
  TRANSFERENCIA = 3,
}

export interface UserCPFModel {
  id: string;
  email: string;
  password: string;
  cpf: string;
}

export interface UserCNPJModel {
  id: string;
  email: string;
  password: string;
  cnpj: string;
}

export interface AccountCPFModel {
  id: string;
  id_usuario: number;
  cpf: string;
  saldo: number;
}

export interface AccountCNPJModel {
  id: string;
  id_usuario: number;
  cnpj: string;
  saldo: number;
}

export type AccountModel = AccountCNPJModel | AccountCPFModel

export type TransactionPayload = Omit<TransactionModel, "id" | "created_at">

export interface TransactionModel {
  id: string;
  id_conta: string;
  id_tipo: TypeTransaction;
  valor: number;
  id_conta_destino: string; 
  created_at: Date;
}

export enum ErrosBDModel {
  UNIQUE_VIOLATION = 23505,
}
