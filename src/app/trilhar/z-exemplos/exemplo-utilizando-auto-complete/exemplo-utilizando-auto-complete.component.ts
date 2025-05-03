import { Component, OnInit, ViewChild } from '@angular/core';
import { MaterialModule } from '../../../material.module';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe, CommonModule, NgFor, NgIf } from '@angular/common';
import { AutoCompleteComponent } from '../../../shared/auto-complete/auto-complete.component';
import { RouterLink } from '@angular/router';

interface Usuario {
  id: number;
  nome: string;
  nomeFormatado: string;
  email: string;
}

interface Produto {
  id: number;
  nome: string;
  preco: number;
}

@Component({
  selector: 'app-auto-complete',
  standalone: true,
  imports: [
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    AutoCompleteComponent,
    CommonModule,
    //RouterLink,
    //NgIf,
  ],
  templateUrl: './exemplo-utilizando-auto-complete.component.html',
  styleUrl: './exemplo-utilizando-auto-complete.component.scss'
})
export class ExemploUtilizandoAutoCompleteComponent implements OnInit {
  @ViewChild(AutoCompleteComponent) childAutoCompleteComponent!: AutoCompleteComponent;

  formulario!: FormGroup;

  usuarios: Usuario[] = [];
  produtos: Produto[] = [];

  // Usuario e produto pré-selecionados
  usuarioSelecionado: Usuario | null = null;
  produtoSelecionado: Produto | null = null;

  constructor(private fb: FormBuilder) {
    this.inicializarFormulario();
  }

  ngOnInit() {
    // Primeiro carregamos os dados necessários
    //this.carregarDados();

    // Depois, com um pequeno delay, definimos os valores iniciais
    setTimeout(() => {
      //this.definirValorUsuario();
      //this.definirValorProduto();
    }, 0);
  }

  private inicializarFormulario() {
    this.formulario = this.fb.group({
      usuarioId: [null],
      usuario: [null],
      produtoId: [null],
      produto: [null]
    });
  }

  private carregarDados() {
    // Simulando carregamento de dados de um serviço
    this.usuarios = [
      { id: 1, nome: 'João Silva', nomeFormatado: '1 - João Silva', email: 'joao@exemplo.com' },
      { id: 2, nome: 'Maria Santos', nomeFormatado: '2 - Maria Santos', email: 'maria@exemplo.com' },
      { id: 3, nome: 'Pedro Oliveira', nomeFormatado: '3 - Pedro Oliveira', email: 'pedro@exemplo.com' },
    ];

    this.produtos = [
      { id: 1, nome: '1 - Notebook', preco: 3500 },
      { id: 2, nome: '2 - Smartphone', preco: 1800 },
      { id: 3, nome: '3 - Monitor', preco: 1200 },
    ];

    console.log('Dados carregados:', this.usuarios, this.produtos);
  }

  private definirValorUsuario() {
    // Seleciona Maria Santos (id: 2)
    this.usuarioSelecionado = this.usuarios.find(u => u.id === 2) || null;
    console.log('Usuário selecionado:', this.usuarioSelecionado);

    // Preenche o formulário com os valores iniciais
    if (this.usuarioSelecionado) {
      this.formulario.patchValue({
        usuarioId: this.usuarioSelecionado.id,
        usuario: this.usuarioSelecionado
      });
    }

    console.log('Formulário após definir valores iniciais:', this.formulario.value);
  }

  private definirValorProduto() {
    // Seleciona Monitor (id: 3)
    this.produtoSelecionado = this.produtos.find(p => p.id === 3) || null;
    console.log('Produto selecionado:', this.produtoSelecionado);

    // Preenche o formulário com os valores iniciais
    if (this.produtoSelecionado) {
      this.formulario.patchValue({
        produtoId: this.produtoSelecionado.id,
        produto: this.produtoSelecionado
      });
    }

    console.log('Formulário após definir valores iniciais:', this.formulario.value);
  }

  onUsuarioSelecionado(usuario: Usuario): void {
    console.log('Usuário selecionado do autocomplete:', usuario);
    if (usuario) {
      this.formulario.patchValue({
        usuarioId: usuario.id,
        usuario: usuario
      });
    }
  }

  onProdutoSelecionado(produto: Produto): void {
    console.log('Produto selecionado do autocomplete:', produto);
    if (produto) {
      this.formulario.patchValue({
        produtoId: produto.id,
        produto: produto
      });
    }
  }
}
