import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ProdutoResponse, UsuarioResponse } from '../../models/models';
import { ProdutoService } from '../../services/produto.service';
import { TokenService } from '../../services/token.service';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    RouterLink,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  carregando = true;
  produtos: ProdutoResponse[] = [];
  usuarios: UsuarioResponse[] = [];

  constructor(
    private produtoService: ProdutoService,
    private usuarioService: UsuarioService,
    private tokenService: TokenService,
  ) {}

  ngOnInit(): void {
    const empresaId = this.tokenService.getEmpresaId();

    if (!empresaId) {
      this.carregando = false;
      return;
    }

    forkJoin({
      produtos: this.produtoService.listar(empresaId),
      usuarios: this.usuarioService.listarTodoPorEmpresa(empresaId),
    }).subscribe({
      next: (res) => {
        this.produtos = res.produtos;
        this.usuarios = res.usuarios;
        this.carregando = false;
      },
      error: (err) => {
        console.error('Erro ao carregar dashboard', err);
        this.carregando = false;
      },
    });
  }

  get totalUsuarios(): number {
    return this.usuarios.length;
  }

  get totalProdutos(): number {
    return this.produtos.length;
  }

  get estoqueTotal(): number {
    return this.produtos.reduce((acc, p) => acc + (p.estoqueAtual || 0), 0);
  }

  get produtosBaixoEstoque(): ProdutoResponse[] {
    return this.produtos
      .filter((p) => p.ativo && (p.estoqueAtual || 0) <= (p.estoqueMinimo || 0))
      .slice(0, 5);
  }
}
