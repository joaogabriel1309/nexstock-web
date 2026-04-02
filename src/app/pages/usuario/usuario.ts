import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { UsuarioResponse } from '../../models/models';
import { TokenService } from '../../services/token.service';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatTooltipModule,
  ],
  templateUrl: './usuario.html',
  styleUrl: './usuario.scss',
})
export class Usuario implements OnInit {
  usuarios: UsuarioResponse[] = [];
  carregando = true;
  salvando = false;
  formularioVisivel = false;
  form: FormGroup;
  colunas: string[] = ['nome', 'email', 'role', 'acoes', 'dispositivos'];

  constructor(
    private usuarioService: UsuarioService,
    private tokenService: TokenService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private router: Router,
  ) {
    this.form = this.fb.group({
      nome: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      role: ['USER', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.carregar();
  }

  abrirFormulario(): void {
    this.formularioVisivel = true;
  }

  fecharFormulario(): void {
    this.formularioVisivel = false;
    this.form.reset({ role: 'USER' });
  }

  carregar(): void {
    const empresaId = this.tokenService.getEmpresaId();
    if (!empresaId) return;

    this.carregando = true;
    this.usuarioService.listarTodoPorEmpresa(empresaId).subscribe({
      next: (res) => {
        this.usuarios = res;
        this.carregando = false;
      },
      error: () => {
        this.snackBar.open('Erro ao carregar usuários', 'Fechar', { duration: 3000 });
        this.carregando = false;
      },
    });
  }

  salvar(): void {
    if (this.form.invalid) return;

    const empresaId = this.tokenService.getEmpresaId();
    if (!empresaId) return;

    this.salvando = true;

    const request = {
      nome: this.form.value.nome,
      email: this.form.value.email,
      senha: this.form.value.senha,
      role: this.form.value.role,
      empresaId: empresaId,
    };

    this.usuarioService.cadastrar(request).subscribe({
      next: () => {
        this.snackBar.open('Colaborador cadastrado com sucesso!', 'OK', { duration: 3000 });
        this.salvando = false;
        this.fecharFormulario();
        this.carregar();
      },
      error: (err) => {
        console.error('Erro ao cadastrar:', err);
        this.snackBar.open('Erro ao cadastrar usuário. Verifique as permissões.', 'Fechar', {
          duration: 3000,
        });
        this.salvando = false;
      },
    });
  }

  irParaDispositivos(usuario: UsuarioResponse): void {
    this.router.navigate(['/usuarios', usuario.id, 'dispositivos']);
  }

  deletar(usuario: UsuarioResponse): void {
    const empresaId = this.tokenService.getEmpresaId();
    if (!empresaId || !usuario.id) return;

    if (!confirm(`Deseja remover o acesso de "${usuario.nome}"?`)) return;

    this.usuarioService.deletar(empresaId, usuario.id).subscribe({
      next: () => {
        this.snackBar.open('Usuário removido com sucesso', 'OK', { duration: 3000 });
        this.carregar(); // Recarrega a lista
      },
      error: () => this.snackBar.open('Erro ao remover usuário', 'Fechar', { duration: 3000 }),
    });
  }
}
