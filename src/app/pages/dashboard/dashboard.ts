import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { ClienteResponse, ProdutoResponse } from '../../models/models';
import { ClienteService } from '../../services/cliente.service';
import { ProdutoService } from '../../services/produto.service';
import { TokenService } from '../../services/token.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    RouterLink
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {

  carregando = true;
  produtos: ProdutoResponse[] = [];
  clientes: ClienteResponse[] = [];

  constructor(
    private produtoService: ProdutoService,
    private clienteService: ClienteService,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    const contratoId = this.tokenService.getContratoId();
    if (!contratoId) return;

    this.produtoService.listar(contratoId).subscribe({
      next: (dados) => {
        this.produtos = dados;
        this.carregando = false;
      },
      error: () => { this.carregando = false; }
    });

    this.clienteService.listar().subscribe({
      next: (dados) => { this.clientes = dados; }
    });
  }

  get totalProdutos(): number {
    return this.produtos.length;
  }

  get estoqueTotal(): number {
    return this.produtos.reduce((acc, p) => acc + Number(p.estoque), 0);
  }

  get totalClientes(): number {
    return this.clientes.length;
  }

  get clientesAtivos(): number {
    return this.clientes.filter(c => c.ativo).length;
  }

  get produtosBaixoEstoque(): ProdutoResponse[] {
    return this.produtos.filter(p => Number(p.estoque) < 10).slice(0, 5);
  }
}