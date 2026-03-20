import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-setup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './setup.html',
  styleUrl: './setup.scss'
})
export class Setup {

  salvando = false;
  concluido = false;
  contratoIdGerado = '';

  formCliente: FormGroup;
  formPlano: FormGroup;
  formUsuario: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.formCliente = this.fb.group({
      nome:      ['', Validators.required],
      email:     ['', [Validators.required, Validators.email]],
      documento: [''],
      telefone:  ['']
    });

    this.formPlano = this.fb.group({
      nome:            ['Plano Básico', Validators.required],
      preco:           [99.90, [Validators.required, Validators.min(0)]],
      duracaoDias:     [30, [Validators.required, Validators.min(1)]],
      maxDispositivos: [5, [Validators.required, Validators.min(1)]]
    });

    this.formUsuario = this.fb.group({
      nome:  ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  concluirSetup(): void {
  if (this.formCliente.invalid || this.formPlano.invalid || this.formUsuario.invalid) return;

  this.salvando = true;

  const payload = {
    empresaNome:         this.formCliente.value.nome,
    empresaEmail:        this.formCliente.value.email,
    empresaDocumento:    this.formCliente.value.documento,
    empresaTelefone:     this.formCliente.value.telefone,
    planoNome:           this.formPlano.value.nome,
    planoPreco:          this.formPlano.value.preco,
    planoDias:           this.formPlano.value.duracaoDias,
    planoMaxDispositivos: this.formPlano.value.maxDispositivos,
    usuarioNome:         this.formUsuario.value.nome,
    usuarioEmail:        this.formUsuario.value.email,
    usuarioSenha:        this.formUsuario.value.senha
  };

  this.http.post<{ contratoId: string }>(
    `${environment.apiUrl}/api/setup`, payload
  ).subscribe({
    next: (res) => {
      this.salvando = false;
      this.concluido = true;
      this.contratoIdGerado = res.contratoId;
    },
    error: (err) => {
      this.salvando = false;
      const msg = err?.error?.message || 'Erro ao configurar. Verifique os dados.';
      this.snackBar.open(msg, 'Fechar', { duration: 5000 });
    }
  });
}

  irParaLogin(): void {
    this.router.navigate(['/login']);
  }
}