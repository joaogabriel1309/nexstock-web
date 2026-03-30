import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.scss'
})
export class LayoutComponent {

  menuAberto = true;

  menuItems = [
    { label: 'Dashboard',  icon: 'dashboard',   rota: '/dashboard' },
    { label: 'Produtos',   icon: 'inventory_2',  rota: '/produtos'  },
    { label: 'Usuários',   icon: 'people',       rota: '/usuario'  },
  ];

  constructor(
    private authService: AuthService,
    public tokenService: TokenService
  ) {}

  sair(): void {
    this.authService.logout();
  }
}