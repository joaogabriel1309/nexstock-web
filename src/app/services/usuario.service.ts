import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { UsuarioResponse } from '../models/models';

@Injectable({ providedIn: 'root' })
export class UsuarioService {

  private url = `${environment.apiUrl}/api/usuarios`;

  constructor(private http: HttpClient) {}

  cadastrar(dados: any): Observable<UsuarioResponse> {
    return this.http.post<UsuarioResponse>(this.url, dados);
  }

  listarTodoPorEmpresa(empresaId: string): Observable<UsuarioResponse[]> {
    const params = new HttpParams().set('empresaId', empresaId);
    return this.http.get<UsuarioResponse[]>(this.url, { params });
  }

  buscarPorId(empresaId: string, id: string): Observable<UsuarioResponse> {
    const params = new HttpParams().set('empresaId', empresaId);
    return this.http.get<UsuarioResponse>(`${this.url}/${id}`, { params });
  }

  deletar(empresaId: string, id: string): Observable<void> {
    const params = new HttpParams().set('empresaId', empresaId);
    return this.http.delete<void>(`${this.url}/${id}`, { params });
  }
}