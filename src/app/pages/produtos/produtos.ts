import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ProdutoResponse } from '../../models/models';
import { ProdutoService } from '../../services/produto.service';
import { TokenService } from '../../services/token.service';

@Component({
  selector: 'app-produtos',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatTooltipModule
  ],
  templateUrl: './produtos.html',
  styleUrl: './produtos.scss'
})
export class Produtos implements OnInit {

  produtos: ProdutoResponse[] = [];
  carregando = true;
  colunas = ['nome', 'codigoBarras', 'estoque', 'versao', 'acoes'];

  formularioVisivel = false;
  editando: ProdutoResponse | null = null;
  form: FormGroup;
  salvando = false;

  // ID fixo de dispositivo para operações — em produção viria do dispositivo cadastrado
  dispositivoId = '00000000-0000-0000-0000-000000000001';

  constructor(
    private produtoService: ProdutoService,
    private tokenService: TokenService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      nome:         ['', [Validators.required, Validators.maxLength(255)]],
      codigoBarras: ['', Validators.maxLength(100)],
      estoque:      [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
   
  }

  abrirFormulario(produto?: ProdutoResponse): void {
    this.editando = produto || null;
    this.formularioVisivel = true;

    if (produto) {
      this.form.patchValue({
        nome: produto.nome,
        codigoBarras: produto.codigoBarras,
        estoque: produto.estoque
      });
    } else {
      this.form.reset({ estoque: 0 });
    }
  }

  fecharFormulario(): void {
    this.formularioVisivel = false;
    this.editando = null;
    this.form.reset({ estoque: 0 });
  }

  salvar(): void {
    if (this.form.invalid) return;

    
    this.salvando = true;

    const request = {
      ...this.form.value,
      dispositivoId: this.dispositivoId
    };

    const operacao = this.editando
      
    
  }

  deletar(produto: ProdutoResponse): void {
    if (!confirm(`Deseja remover "${produto.nome}"?`)) return;

    
  }
}