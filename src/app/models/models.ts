// Auth
export interface LoginRequest {
  email: string;
  senha: string;
  contratoId: string;
}

export interface LoginResponse {
  token: string;
  usuarioId: string;
  email: string;
  nome: string;
  role: string;
  contratoId: string;
  expiracaoMs: number;
}

// Produto
export interface ProdutoResponse {
  id: string;
  contratoId: string;
  nome: string;
  codigoBarras?: string;
  estoque: number;
  atualizadoEm: string;
  versao: number;
  dispositivoUltimaAlteracaoId?: string;
  deletado: boolean;
}

export interface ProdutoRequest {
  contratoId: string;
  dispositivoId: string;
  nome: string;
  codigoBarras?: string;
  estoque: number;
}

// Contrato
export interface ContratoResponse {
  id: string;
  planoId: string;
  planoNome: string;
  dataInicio: string;
  dataFim: string;
  status: 'ATIVO' | 'SUSPENSO' | 'CANCELADO' | 'EXPIRADO';
  renovadoDeId?: string;
  criadoEm: string;
}

export interface ContratoRequest {
  planoId: string;
}

// Plano
export interface PlanoResponse {
  id: string;
  nome: string;
  preco: number;
  duracaoDias: number;
  maxDispositivos: number;
  ativo: boolean;
}