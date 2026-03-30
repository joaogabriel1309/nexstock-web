import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ProdutoRequest, ProdutoResponse } from '../models/models';

@Injectable({ providedIn: 'root' })
export class ProdutoService {

  private url = `${environment.apiUrl}/api/produtos`;

  constructor(private http: HttpClient) {}

  listar(empresaId: string): Observable<ProdutoResponse[]> {
    const params = new HttpParams().set('empresaId', empresaId);
    return this.http.get<ProdutoResponse[]>(this.url, { params });
  }

  buscarPorId(empresaId: string, id: string): Observable<ProdutoResponse> {
    const params = new HttpParams().set('empresaId', empresaId);
    return this.http.get<ProdutoResponse>(`${this.url}/${id}`, { params });
  }

  criar(request: ProdutoRequest): Observable<ProdutoResponse> {
    return this.http.post<ProdutoResponse>(this.url, request);
  }

  atualizar(empresaId: string, id: string, request: ProdutoRequest): Observable<ProdutoResponse> {
    const params = new HttpParams().set('empresaId', empresaId);
    return this.http.put<ProdutoResponse>(`${this.url}/${id}`, request, { params });
  }

  deletar(empresaId: string, id: string, dispositivoId: string): Observable<void> {
    const params = new HttpParams()
      .set('empresaId', empresaId)
      .set('dispositivoId', dispositivoId);
      
    return this.http.delete<void>(`${this.url}/${id}`, { params });
  }
}