import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ContratoRequest, ContratoResponse } from '../models/models';

@Injectable({ providedIn: 'root' })
export class ContratoService {

  private url = `${environment.apiUrl}/api/contratos`;

  constructor(private http: HttpClient) {}

  criar(request: ContratoRequest): Observable<ContratoResponse> {
    return this.http.post<ContratoResponse>(this.url, request);
  }

  listarPorCliente(clienteId: string): Observable<ContratoResponse[]> {
    return this.http.get<ContratoResponse[]>(`${this.url}/cliente/${clienteId}`);
  }
}