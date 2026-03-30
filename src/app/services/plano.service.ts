import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PlanoResponse } from '../models/models';

export interface PlanoRequest {
  nome: string;
  preco: number;
  duracaoDias: number;
  maxDispositivos: number;
}

@Injectable({ providedIn: 'root' })
export class PlanoService {

  private url = `${environment.apiUrl}/api/planos`;

  constructor(private http: HttpClient) {}

  listar(): Observable<PlanoResponse[]> {
    return this.http.get<PlanoResponse[]>(this.url);
  }
}