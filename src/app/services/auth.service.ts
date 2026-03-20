import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginRequest, LoginResponse } from '../models/models';
import { TokenService } from './token.service';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private url = `${environment.apiUrl}/api/auth`;

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private router: Router
  ) {}

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.url}/login`, request).pipe(
      tap(response => this.tokenService.salvar(response))
    );
  }

  logout(): void {
    this.tokenService.limpar();
    this.router.navigate(['/login']);
  }

  estaLogado(): boolean {
    return this.tokenService.estaLogado();
  }
}