import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { DispositivoResponse, DispositivoResquest } from '../models/models';

@Injectable({ providedIn: 'root' })
export class DispositivoService {
  private url = `${environment.apiUrl}/api/dispositivos`;

  constructor(private http: HttpClient) {}

  registrar(request: DispositivoResquest): Observable<DispositivoResponse> {
    return this.http.post<DispositivoResponse>(this.url, request);
  }

  listarPorUsuario(empresaId: string, usuarioId: string): Observable<DispositivoResponse[]> {
    return this.http.get<DispositivoResponse[]>(`${this.url}/${empresaId}/${usuarioId}`);
  }

  listarPorEmpresa(empresaId: string): Observable<DispositivoResponse[]> {
    return this.http.get<DispositivoResponse[]>(`${this.url}/empresa/${empresaId}`);
  }

  remover(empresaId: string, id: string): Observable<void> {
    const params = new HttpParams().set('empresaId', empresaId);
    return this.http.delete<void>(`${this.url}/${id}`, { params });
  }
}
