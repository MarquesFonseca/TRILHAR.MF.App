// auto-complete.component.ts
import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit, SimpleChanges, OnChanges, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, startWith, map, Subject, takeUntil } from 'rxjs';
import { MaterialModule } from '../../material.module';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import * as utils from "../funcoes-comuns/utils";

@Component({
  selector: 'app-auto-complete',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    AsyncPipe,
  ],
  templateUrl: './auto-complete.component.html',
  styleUrl: './auto-complete.component.scss'
})
export class AutoCompleteComponent implements OnInit, OnChanges, AfterViewInit {

  //@Input() formGroup = new FormGroup('');
  @Input() formGroup!: FormGroup;
  @Input() field: string = '';
  @Input() label: string = 'Selecione...';
  @Input() disabled: boolean = false;
  @Input() itens: any[] = [];
  @Input() propriedadeMostrar: string = 'nome';
  @Input() placeholder: string = 'Digite para pesquisar';
  @Input() valorInicial: any = null;

  @Output() itemSelecionado = new EventEmitter<any>();

  private destroy$ = new Subject<void>();

  get controle(): FormControl {
    return this.formGroup?.get(this.field) as FormControl;
  }
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
      // if (this.valorInicial && !this.valorDefinido) {
      if (this.valorInicial) {
        //console.log('ngAfterViewInit - Definindo valor:', this.valorInicial);
        this.controle?.setValue(this.valorInicial);
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
          this.controle?.setValue(itemEncontrado);
        } else {
          //console.log('Item não encontrado na lista, usando o valor direto');
          this.controle?.setValue(novoValor);
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
    this.itensFiltrados = this.controle?.valueChanges.pipe(
      takeUntil(this.destroy$),
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

    const filtro = utils.removeAcento(valor.toLowerCase());
    return this.itens.filter(item =>
      utils.removeAcento(item[this.propriedadeMostrar]?.toLowerCase()).includes(filtro)
    );
  }

  selecionarItem(evento: MatAutocompleteSelectedEvent): void {
    //console.log('Item selecionado manualmente:', evento.option.value);
    this.itemSelecionado.emit(evento.option.value);
  }

  // Método para limpar o campo
  limpar(): void {
    this.controle?.setValue('');
    this.valorDefinido = false;
    this.itemSelecionado.emit(null);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
