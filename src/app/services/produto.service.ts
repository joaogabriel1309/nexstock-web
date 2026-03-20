import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ProdutoRequest, ProdutoResponse } from '../models/models';

@Injectable({ providedIn: 'root' })
export class ProdutoService {

  private url = `${environment.apiUrl}/api/produtos`;

  constructor(private http: HttpClient) {}

  listar(contratoId: string): Observable<ProdutoResponse[]> {
    return this.http.get<ProdutoResponse[]>(`${this.url}/contrato/${contratoId}`);
  }

  buscarPorId(contratoId: string, id: string): Observable<ProdutoResponse> {
    return this.http.get<ProdutoResponse>(`${this.url}/contrato/${contratoId}/${id}`);
  }

  criar(request: ProdutoRequest): Observable<ProdutoResponse> {
    return this.http.post<ProdutoResponse>(this.url, request);
  }

  atualizar(contratoId: string, id: string, request: ProdutoRequest): Observable<ProdutoResponse> {
    return this.http.put<ProdutoResponse>(`${this.url}/contrato/${contratoId}/${id}`, request);
  }

  deletar(contratoId: string, id: string, dispositivoId: string): Observable<void> {
    return this.http.delete<void>(
      `${this.url}/contrato/${contratoId}/${id}?dispositivoId=${dispositivoId}`
    );
  }
}