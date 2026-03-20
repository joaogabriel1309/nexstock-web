import { Injectable } from '@angular/core';
import { LoginResponse } from '../models/models';

const TOKEN_KEY = 'nexstock_token';
const USER_KEY  = 'nexstock_user';

@Injectable({ providedIn: 'root' })
export class TokenService {

  salvar(response: LoginResponse): void {
    localStorage.setItem(TOKEN_KEY, response.token);
    localStorage.setItem(USER_KEY, JSON.stringify(response));
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  getUsuario(): LoginResponse | null {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  getContratoId(): string | null {
    return this.getUsuario()?.contratoId ?? null;
  }

  limpar(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  estaLogado(): boolean {
    return !!this.getToken();
  }
}