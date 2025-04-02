import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
    selector: 'app-filter-options-matriculas',
    standalone: true,
    imports: [
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatAutocompleteModule,
        ReactiveFormsModule,
        AsyncPipe,
        MatCardModule
    ],
    templateUrl: './auto-complete.component.html',
    styleUrl: './auto-complete.component.scss'
})
export class AutoCompleteComponent {

    // Filter Autocomplete
    myControl = new FormControl('');
    options: string[] = ['One', 'Two', 'Three'];
    filteredOptions!: Observable<string[]>;

    ngOnInit() {
        this.filteredOptions = this.myControl.valueChanges.pipe(
            startWith(''),
            map(value => this._filter(value || '')),
        );
    }

    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();
        return this.options.filter(option => option.toLowerCase().includes(filterValue));
    }

    opcaoSelecionada($event: any) {
        var evento = $event.option.value;
        //console.log('Selecionado:');
        //console.log(evento);
      }

      // Função para exibir a descrição no campo de texto
      displayFn(value: any): string {
        var retorno = value && value.descricao ? value.descricao : '';
        return retorno;
      }

}
