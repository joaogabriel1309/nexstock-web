import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ClienteRequest, ClienteResponse } from '../models/models';

@Injectable({ providedIn: 'root' })
export class ClienteService {

  private url = `${environment.apiUrl}/api/clientes`;

  constructor(private http: HttpClient) {}

  listar(): Observable<ClienteResponse[]> {
    return this.http.get<ClienteResponse[]>(this.url);
  }

  buscarPorId(id: string): Observable<ClienteResponse> {
    return this.http.get<ClienteResponse>(`${this.url}/${id}`);
  }

  criar(request: ClienteRequest): Observable<ClienteResponse> {
    return this.http.post<ClienteResponse>(this.url, request);
  }

  atualizar(id: string, request: ClienteRequest): Observable<ClienteResponse> {
    return this.http.put<ClienteResponse>(`${this.url}/${id}`, request);
  }

  desativar(id: string): Observable<void> {
    return this.http.patch<void>(`${this.url}/${id}/desativar`, {});
  }

  reativar(id: string): Observable<void> {
    return this.http.patch<void>(`${this.url}/${id}/reativar`, {});
  }
}