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
import { finalize, of, switchMap } from 'rxjs';
import { ProdutoRequest, ProdutoResponse } from '../../models/models';
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
    MatTooltipModule,
  ],
  templateUrl: './produtos.html',
  styleUrl: './produtos.scss',
})
export class Produtos implements OnInit {
  produtos: ProdutoResponse[] = [];
  carregando = true;
  colunas = ['nome', 'codigoBarras', 'estoque', 'acoes'];

  formularioVisivel = false;
  editando: ProdutoResponse | null = null;
  form: FormGroup;
  salvando = false;
  arquivoImagem: File | null = null;
  previewImagemUrl: string | null = null;
  readonly tiposImagemAceitos = 'image/png,image/jpeg,image/webp';
  readonly tamanhoMaximoImagemMb = 5;

  constructor(
    private produtoService: ProdutoService,
    private tokenService: TokenService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
  ) {
    this.form = this.fb.group({
      nome: ['', [Validators.required, Validators.maxLength(255)]],
      codigoBarras: ['', Validators.maxLength(100)],
      estoque: [0, [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    const empresaId = this.tokenService.getEmpresaId();
    if (!empresaId) return;

    this.carregando = true;
    this.produtoService.listar(empresaId).subscribe({
      next: (res) => {
        this.produtos = res;
        this.carregando = false;
      },
      error: () => {
        this.snackBar.open('Erro ao carregar produtos', 'Fechar', { duration: 3000 });
        this.carregando = false;
      },
    });
  }

  abrirFormulario(produto?: ProdutoResponse): void {
    this.editando = produto || null;
    this.formularioVisivel = true;
    this.limparImagemSelecionada(false);

    if (produto) {
      this.form.patchValue({
        nome: produto.nome,
        codigoBarras: produto.codigoBarras,
        estoque: produto.estoque,
      });
      this.previewImagemUrl = produto.imagemUrl || null;
    } else {
      this.form.reset({ estoque: 0 });
    }
  }

  fecharFormulario(): void {
    this.formularioVisivel = false;
    this.editando = null;
    this.form.reset({ estoque: 0 });
    this.limparImagemSelecionada();
  }

  salvar(): void {
    if (this.form.invalid) return;

    const empresaId = this.tokenService.getEmpresaId();
    const dispositivoId = this.tokenService.getDispositivoId();
    if (!empresaId) return;

    this.salvando = true;

    const request: ProdutoRequest = {
      ...this.form.value,
      empresaId: empresaId,
      dispositivoId: dispositivoId || undefined,
    };

    const operacao = this.editando
      ? this.produtoService.atualizar(empresaId, this.editando.id, request)
      : this.produtoService.criar(request);

    operacao
      .pipe(
        switchMap((produto) => {
          if (!this.arquivoImagem) {
            return of(produto);
          }

          return this.produtoService.uploadImagem(empresaId, produto.id, this.arquivoImagem);
        }),
        finalize(() => {
          this.salvando = false;
        }),
      )
      .subscribe({
      next: () => {
        this.snackBar.open(
          `Produto ${this.editando ? 'atualizado' : 'criado'} com sucesso!`,
          'OK',
          { duration: 3000 },
        );
        this.carregar();
        this.fecharFormulario();
      },
      error: (err) => {
        console.error(err);
        const mensagem = err?.error?.erro || err?.error?.message || 'Erro ao salvar produto';
        this.snackBar.open(mensagem, 'Fechar', { duration: 4000 });
      },
    });
  }

  selecionarImagem(event: Event): void {
    const input = event.target as HTMLInputElement;
    const arquivo = input.files?.[0];

    if (!arquivo) {
      return;
    }

    if (!this.validarImagem(arquivo)) {
      input.value = '';
      return;
    }

    this.limparImagemSelecionada(false);
    this.arquivoImagem = arquivo;
    this.previewImagemUrl = URL.createObjectURL(arquivo);
  }

  removerImagemSelecionada(input?: HTMLInputElement): void {
    this.limparImagemSelecionada();

    if (this.editando?.imagemUrl) {
      this.previewImagemUrl = this.editando.imagemUrl;
    }

    if (input) {
      input.value = '';
    }
  }

  temNovaImagemSelecionada(): boolean {
    return !!this.arquivoImagem;
  }

  private validarImagem(arquivo: File): boolean {
    const tiposPermitidos = ['image/png', 'image/jpeg', 'image/webp'];
    const tamanhoMaximoBytes = this.tamanhoMaximoImagemMb * 1024 * 1024;

    if (!tiposPermitidos.includes(arquivo.type)) {
      this.snackBar.open('Use uma imagem PNG, JPG ou WEBP.', 'Fechar', { duration: 4000 });
      return false;
    }

    if (arquivo.size > tamanhoMaximoBytes) {
      this.snackBar.open(
        `A imagem deve ter no máximo ${this.tamanhoMaximoImagemMb}MB.`,
        'Fechar',
        { duration: 4000 },
      );
      return false;
    }

    return true;
  }

  private limparImagemSelecionada(limparPreview = true): void {
    if (this.arquivoImagem && this.previewImagemUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(this.previewImagemUrl);
    }

    this.arquivoImagem = null;

    if (limparPreview) {
      this.previewImagemUrl = null;
    }
  }

  deletar(produto: ProdutoResponse): void {
    const empresaId = this.tokenService.getEmpresaId();
    if (!empresaId) return;

    if (!confirm(`Deseja remover "${produto.nome}"?`)) return;

    this.produtoService.deletar(empresaId, produto.id).subscribe({
      next: () => {
        this.snackBar.open('Produto removido', 'OK', { duration: 3000 });
        this.carregar();
      },
      error: () => this.snackBar.open('Erro ao remover produto', 'Fechar', { duration: 3000 }),
    });
  }
}
