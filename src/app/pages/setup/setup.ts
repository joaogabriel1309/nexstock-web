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
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { PlanoResponse, SetupRequest } from '../../models/models';

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
    MatSnackBarModule,
    MatRadioModule
  ],
  templateUrl: './setup.html',
  styleUrl: './setup.scss'
})
export class Setup {

  salvando = false;
  concluido = false;
  plano: PlanoResponse[] = [];

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
      documento: ['', Validators.required],
      telefone:  ['']
    });

    this.formPlano = this.fb.group({
      planoId: ['', Validators.required],
    });

    this.formUsuario = this.fb.group({
      nome:  ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    this.carregarPlanos();
    this.formCliente.get('email')?.valueChanges.subscribe(val => {
      this.formUsuario.patchValue({ email: val }, { emitEvent: false });
   });
  }

  carregarPlanos(): void {
    this.http.get<PlanoResponse[]>(`${environment.apiUrl}/api/planos`)
      .subscribe({
        next: (res) => this.plano = res,
        error: () => this.snackBar.open('Erro ao carregar planos', 'Fechar', { duration: 3000 })
      });
  }

  concluirSetup(): void {
  if (this.formCliente.invalid || this.formPlano.invalid || this.formUsuario.invalid) return;

  this.salvando = true;

    const payload: SetupRequest = {
      empresaNome: this.formCliente.value.nome,
      empresaEmail: this.formCliente.value.email,
      empresaCpfCnpj: this.formCliente.value.documento,
      empresaTelefone: this.formCliente.value.telefone,
      adminNome: this.formUsuario.value.nome,
      adminEmail: this.formUsuario.value.email,
      adminSenha: this.formUsuario.value.senha,
      planoId: this.formPlano.value.planoId
    };
    console.log(payload);
  this.http.post<void>(
  `${environment.apiUrl}/api/setup`,
  payload
).subscribe({
  next: () => {
    this.salvando = false;
    this.concluido = true;
    console.log('Setup realizado com sucesso (Status 201)');
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