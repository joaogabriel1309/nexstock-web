import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute } from '@angular/router';

import { DispositivoResponse, DispositivoResquest } from '../../models/models';
import { DispositivoService } from '../../services/dispositivo.service';
import { TokenService } from '../../services/token.service';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-dispositivos',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatCardModule,
    MatDividerModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './dispositivo.html',
  styleUrl: './dispositivo.scss',
})
export class Dispositivos implements OnInit {
  usuarioId: string | null = null;
  nomeUsuario: string = 'Usuário';
  dispositivos: DispositivoResponse[] = [];
  carregando = true;

  formularioVisivel = false;
  salvando = false;
  form: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private dispositivoService: DispositivoService,
    private usuarioService: UsuarioService,
    private tokenService: TokenService,
    private snackBar: MatSnackBar,
    private location: Location,
    private fb: FormBuilder,
  ) {
    this.form = this.fb.group({
      nome: ['', [Validators.required]],
      tipo: ['WEB', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.usuarioId = this.route.snapshot.paramMap.get('id');
    if (this.usuarioId) {
      this.carregarDados();
    }
  }

  abrirModalAdicionar(): void {
    this.formularioVisivel = true;
  }

  fecharFormulario(): void {
    this.formularioVisivel = false;
    this.form.reset({ tipo: 'WEB' });
  }

  carregarDados(): void {
    const empresaId = this.tokenService.getEmpresaId();
    if (!empresaId || !this.usuarioId) return;

    this.carregando = true;

    this.dispositivoService.listarPorUsuario(empresaId, this.usuarioId).subscribe({
      next: (res) => {
        this.dispositivos = res;
        this.carregando = false;
      },
      error: () => {
        this.snackBar.open('Erro ao carregar dispositivos', 'Fechar');
        this.carregando = false;
      },
    });

    this.dispositivoService.listarPorEmpresa(empresaId).subscribe({
      next: (res) => {
        this.dispositivos = res.filter((d) => d.usuarioId === this.usuarioId);
        this.carregando = false;
      },

      error: () => {
        this.snackBar.open('Erro ao carregar dispositivos', 'Fechar');
        this.carregando = false;
      },
    });
  }

  salvarDispositivo(): void {
    if (this.form.invalid || !this.usuarioId) return;

    const empresaId = this.tokenService.getEmpresaId();
    if (!empresaId) return;

    this.salvando = true;

    const request: DispositivoResquest = {
      nome: this.form.value.nome,
      sistema: btoa(Math.random().toString()).substring(0, 15),
      empresaId: empresaId,
      usuarioId: this.usuarioId,
    };

    this.dispositivoService.registrar(request).subscribe({
      next: () => {
        this.snackBar.open('Dispositivo vinculado com sucesso!', 'OK');
        this.fecharFormulario();
        this.carregarDados();
        this.salvando = false;
      },
      error: () => {
        this.snackBar.open('Erro ao salvar dispositivo', 'Fechar');
        this.salvando = false;
      },
    });
  }

  remover(id: string): void {
    const empresaId = this.tokenService.getEmpresaId();
    if (!empresaId) return;

    if (!confirm('Deseja realmente revogar o acesso deste dispositivo?')) return;

    this.dispositivoService.remover(empresaId, id).subscribe({
      next: () => {
        this.snackBar.open('Acesso removido', 'OK');
        this.carregarDados();
      },
      error: () => this.snackBar.open('Erro ao remover dispositivo', 'Fechar'),
    });
  }

  voltar(): void {
    this.location.back();
  }
}
