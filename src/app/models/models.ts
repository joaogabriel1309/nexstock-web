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

// Cliente
export interface ClienteResponse {
  id: string;
  nome: string;
  email: string;
  documento?: string;
  telefone?: string;
  criadoEm: string;
  ativo: boolean;
}

export interface ClienteRequest {
  nome: string;
  email: string;
  documento?: string;
  telefone?: string;
}

// Contrato
export interface ContratoResponse {
  id: string;
  clienteId: string;
  clienteNome: string;
  planoId: string;
  planoNome: string;
  dataInicio: string;
  dataFim: string;
  status: 'ATIVO' | 'SUSPENSO' | 'CANCELADO' | 'EXPIRADO';
  renovadoDeId?: string;
  criadoEm: string;
}

export interface ContratoRequest {
  clienteId: string;
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