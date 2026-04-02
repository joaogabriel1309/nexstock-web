// Auth
export interface LoginRequest {
  email: string;
  senha: string;
}
export interface LoginResponse {
  token: string;
  usuarioId: string;
  dispositivoId: string;
  email: string;
  nome: string;
  role: string;
  expiracaoMs: number;
  empresaId: string;
}

// Produto
export interface ProdutoResponse {
  id: string;
  empresaId: string;
  nome: string;
  codigoBarras?: string;
  estoque: number;
  atualizadoEm: string;
  versao: number;
  dispositivoUltimaAlteracaoId?: string;
  deletado: boolean;
}
export interface ProdutoRequest {
  nome: string;
  codigoBarras?: string;
  estoque: number;
  empresaId: string;
  dispositivoId: string;
}

// Contrato
export interface ContratoResponse {
  id: string;
  empresaId: string;
  empresaNome: string;
  planoId: string;
  planoNome: string;
  dataInicio: string;
  dataFim: string;
  status: 'ATIVO' | 'SUSPENSO' | 'CANCELADO' | 'EXPIRADO';
  renovadoDeId?: string;
  criadoEm: string;
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

//Dispositivo
export interface DispositivoResquest {
  empresaId: string;
  usuarioId: string;
  nome: string;
  sistema: string;
}
export interface DispositivoResponse {
  id: string;
  empresaId: string;
  usuarioId: string;
  nome: string;
  sistema: string;
  ultimaSync: string;
}

// Empresa
export interface EmpresaResquest {
  planoId: string;
  nome: string;
  razaoSocial: string;
  cpfCnpj: string;
  email: string;
  telefone: string;
}
export interface EmpresaResponse {
  id: string;
  contratoId: string;
  nome: string;
  razaoSocial: string;
  cpfCnpj: string;
  email: string;
  telefone: string;
  ativo: boolean;
  criadoEm: string;
}

export interface MovimentacaoResquest {
  empresaId: string;
  produtoId: string;
  tipo: string;
  quantidade: BigInteger;
}

// Usuario
export interface UsuarioResponse {
  id: string;
  empresaId: string;
  nome: string;
  email: string;
  senha: string;
  role: string;
}
export interface UsuarioResquest {
  id: string;
  empresaId: string;
}

// Seput
export interface SetupRequest {
  empresaNome: string;
  empresaEmail: string;
  empresaCpfCnpj: string;
  empresaTelefone: string;
  adminNome: string;
  adminEmail: string;
  adminSenha: string;
  planoId: string;
}
