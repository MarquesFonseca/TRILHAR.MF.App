// auto-complete.component.ts
import { NgFor, AsyncPipe } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit, SimpleChanges, OnChanges, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, startWith, map, of } from 'rxjs';
import { MaterialModule } from '../../material.module';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

interface AutoCompleteOption {
  id: number;
  [key: string]: any; // Permite outras propriedades dinâmicas
}

@Component({
  selector: 'app-auto-complete',
  standalone: true,
  imports: [
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    AsyncPipe,
    NgFor
  ],
  templateUrl: './auto-complete.component.html',
  styleUrl: './auto-complete.component.scss'
})
export class AutoCompleteComponent implements OnInit, OnChanges, AfterViewInit {

  @Input() itens: any[] = [];
  @Input() propriedadeMostrar: string = 'nome';
  @Input() label: string = 'Selecione';
  @Input() placeholder: string = 'Digite para pesquisar';
  @Input() valorInicial: any = null;

  @Output() itemSelecionado = new EventEmitter<any>();

  formulario = new FormControl();
  itensFiltrados!: Observable<any[]>;

  private valorDefinido = false;

  ngOnInit() {
    //console.log('ngOnInit - valorInicial:', this.valorInicial);
    // Inicializa o filtro primeiro sem o valor inicial
    this.inicializarFiltro();
  }

  ngAfterViewInit() {
    // Após a renderização, configura o valor inicial com delay
    setTimeout(() => {
      if (this.valorInicial && !this.valorDefinido) {
        //console.log('ngAfterViewInit - Definindo valor:', this.valorInicial);
        this.formulario.setValue(this.valorInicial);
        this.valorDefinido = true;
        this.itemSelecionado.emit(this.valorInicial);
      }
    }, 100);
  }

  ngOnChanges(changes: SimpleChanges) {
    //console.log('ngOnChanges:', changes);

    // Se a lista de itens mudar
    if (changes['itens'] && !changes['itens'].firstChange) {
      //console.log('Itens mudaram, reinicializando filtro');
      this.inicializarFiltro();
    }

    // Se o valorInicial mudar e for não nulo
    if (changes['valorInicial'] && changes['valorInicial'].currentValue) {
      //console.log('Valor inicial mudou para:', changes['valorInicial'].currentValue);

      // Aguarda os itens estarem disponíveis
      if (this.itens && this.itens.length > 0) {
        const novoValor = changes['valorInicial'].currentValue;

        // Verifica se o objeto está na lista de itens
        let itemEncontrado = this.itens.find(item => item.id === novoValor.id);

        if (itemEncontrado) {
          //console.log('Item encontrado na lista:', itemEncontrado);
          this.formulario.setValue(itemEncontrado);
        } else {
          //console.log('Item não encontrado na lista, usando o valor direto');
          this.formulario.setValue(novoValor);
        }

        this.valorDefinido = true;
        this.itemSelecionado.emit(novoValor);
      } else {
        console.warn('Itens não disponíveis ainda, aguardando...');
      }
    }
  }

  private inicializarFiltro() {
    // Configura o observable de filtragem
    this.itensFiltrados = this.formulario.valueChanges.pipe(
      startWith(''),
      map(valor => this._filtrarItens(valor || ''))
    );
  }

  mostrarTexto = (item: any): string => {
    if (!item) return '';
    //console.log('mostrarTexto chamado com:', item);
    return item && item[this.propriedadeMostrar] ? item[this.propriedadeMostrar] : '';
  };

  private _filtrarItens(valor: string | any): any[] {
    if (!this.itens) return [];

    // Se o valor for um objeto, retorna todos os itens (para exibir todas as opções)
    if (typeof valor !== 'string') return this.itens;

    const filtro = valor.toLowerCase();
    return this.itens.filter(item =>
      item[this.propriedadeMostrar]?.toLowerCase().includes(filtro)
    );
  }

  selecionarItem(evento: MatAutocompleteSelectedEvent): void {
    //console.log('Item selecionado manualmente:', evento.option.value);
    this.itemSelecionado.emit(evento.option.value);
  }

  // Método para limpar o campo
  limpar(): void {
    this.formulario.setValue('');
    this.valorDefinido = false;
    this.itemSelecionado.emit(null);
  }
}
