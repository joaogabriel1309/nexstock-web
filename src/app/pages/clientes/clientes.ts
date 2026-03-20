import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ClienteResponse } from '../../models/models';
import { ClienteService } from '../../services/cliente.service';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatTooltipModule,
    MatChipsModule
  ],
  templateUrl: './clientes.html',
  styleUrl: './clientes.scss'
})
export class Clientes implements OnInit {

  clientes: ClienteResponse[] = [];
  carregando = true;
  colunas = ['nome', 'email', 'documento', 'telefone', 'status', 'acoes'];

  formularioVisivel = false;
  editando: ClienteResponse | null = null;
  form: FormGroup;
  salvando = false;

  constructor(
    private clienteService: ClienteService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      nome:      ['', [Validators.required, Validators.maxLength(200)]],
      email:     ['', [Validators.required, Validators.email]],
      documento: ['', Validators.maxLength(20)],
      telefone:  ['', Validators.maxLength(20)]
    });
  }

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.carregando = true;
    this.clienteService.listar().subscribe({
      next: (dados) => {
        this.clientes = dados;
        this.carregando = false;
      },
      error: () => { this.carregando = false; }
    });
  }

  abrirFormulario(cliente?: ClienteResponse): void {
    this.editando = cliente || null;
    this.formularioVisivel = true;

    if (cliente) {
      this.form.patchValue(cliente);
    } else {
      this.form.reset();
    }
  }

  fecharFormulario(): void {
    this.formularioVisivel = false;
    this.editando = null;
    this.form.reset();
  }

  salvar(): void {
    if (this.form.invalid) return;
    this.salvando = true;

    const operacao = this.editando
      ? this.clienteService.atualizar(this.editando.id, this.form.value)
      : this.clienteService.criar(this.form.value);

    operacao.subscribe({
      next: () => {
        this.snackBar.open(
          this.editando ? 'Cliente atualizado!' : 'Cliente criado!',
          'Fechar', { duration: 3000 }
        );
        this.fecharFormulario();
        this.carregar();
        this.salvando = false;
      },
      error: () => {
        this.snackBar.open('Erro ao salvar cliente.', 'Fechar', { duration: 3000 });
        this.salvando = false;
      }
    });
  }

  toggleStatus(cliente: ClienteResponse): void {
    const operacao = cliente.ativo
      ? this.clienteService.desativar(cliente.id)
      : this.clienteService.reativar(cliente.id);

    operacao.subscribe({
      next: () => {
        this.snackBar.open(
          cliente.ativo ? 'Cliente desativado.' : 'Cliente reativado.',
          'Fechar', { duration: 3000 }
        );
        this.carregar();
      },
      error: () => {
        this.snackBar.open('Erro ao alterar status.', 'Fechar', { duration: 3000 });
      }
    });
  }
}