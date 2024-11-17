import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerIntl } from '@angular/material/datepicker';
import { RouterLink } from '@angular/router';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { map, Observable, startWith } from 'rxjs';
import { BasicFormComponent } from '../../forms/basic-elements/basic-form/basic-form.component';
import { MaterialModule } from '../../material.module';
import { AlunoService } from '../aluno.service';
import { AutoCompleteComponent } from "../auto-complete/auto-complete.component";
import * as utils from '../../funcoes-comuns/utils';
import * as validar from '../../funcoes-comuns/validators/validator';
import * as types from './../aluno.types';


@Component({
    selector: 'app-alunos-formulario',
    standalone: true,
    imports: [
        CommonModule,
        RouterLink,
        ReactiveFormsModule,
        BasicFormComponent,
        MaterialModule,
        NgxMaskDirective,
        AutoCompleteComponent,
    ],
    providers: [
        provideNgxMask()
    ],

    templateUrl: './alunos-formulario.component.html',
    styleUrl: './alunos-formulario.component.scss',
})



export class AlunosFormularioComponent implements OnInit {

    formulario!: FormGroup;

    // Filter Autocomplete
    listaMatriculas!: MatriculaAutoComplete[];
    listaMatriculasFiltradas!: Observable<MatriculaAutoComplete[]>;

    constructor(
        private fb: FormBuilder,
        private alunoService: AlunoService,
        private _adapter: DateAdapter<any>,
        private _intl: MatDatepickerIntl,
        @Inject(MAT_DATE_LOCALE) private _locale: string
    ) {
        this._locale = 'pt-br';
        this._adapter.setLocale(this._locale);
        this._intl.closeCalendarLabel = 'Fechar calendário';
        this._intl.changes.next();
    }

    ngOnInit(): void {
        this.formulario = this.fb.group({
            NomeCrianca: ['', Validators.required],
            DataNascimento: ['', Validators.required],
            IdadeCrianca: [{ value: '', disabled: true }],
            TurmaMatricula: [null, Validators.required],
            NomeMae: [''],
            NomePai: [''],
            OutroResponsavel: [''],
            Telefone: [''], // validar telefone celular
            EnderecoEmail: [''], // Validador de email
            Alergia: [false],
            DescricaoAlergia: [{ value: '', disabled: true }],
            RestricaoAlimentar: [false],
            DescricaoRestricaoAlimentar: [{ value: '', disabled: true }],
            DeficienciaOuSituacaoAtipica: [false],
            DescricaoDeficiencia: [{ value: '', disabled: true }],
            Batizado: [false],
            DataBatizado: [{ value: '', disabled: true }],
            IgrejaBatizado: [{ value: '', disabled: true }],
            Ativo: [true],
        });

        this.handleConditionalFields();

        //auto complete
        // Observando o valueChanges e filtrando
        this.listaMatriculasFiltradas = this.formulario.get('TurmaMatricula')!.valueChanges.pipe(
            startWith(''),
            map(value => typeof value === 'string' ? value : value?.descricao),
            map(descricao => descricao ? this.filtrarAutoComplete(descricao) : this.listaMatriculas.slice())  // Usar slice no array original
        );

        this.listaMatriculas = [
          { id: 1, descricao: 'Branco/Rosa' },
          { id: 2, descricao: 'Lilas 2' },
          { id: 3, descricao: 'Lilas 3' },
        ];
    }

    //auto complete
    // Função de filtro
    private filtrarAutoComplete(value: string): MatriculaAutoComplete[] {
        const filterValue = value.toLowerCase();
        var retorno = this.listaMatriculas.filter(option => option.descricao.toLowerCase().includes(filterValue));
        return retorno;
    }

    opcaoSelecionada($event: MatAutocompleteSelectedEvent) {
        var evento = $event.option.value
        console.log('Selecionado:');
        console.log(evento);
    }

    // Função para exibir a descrição no campo de texto
    displayFn(value: MatriculaAutoComplete): string {
        var retorno = value && value.descricao ? value.descricao : '';
        return retorno;
    }

    get f() {
        return this.formulario.controls;
    }

    handleConditionalFields(): void {
        this.formulario
            .get('DataNascimento')
            ?.valueChanges.subscribe((value) => {
                const dataNascimento = this.formulario.get('DataNascimento');
                const idadeCrianca = this.formulario.get('IdadeCrianca');

                if (this.formulario.get('DataNascimento')?.errors) {
                    try {
                        //const erros = this.formulario.get('DataNascimento')?.errors;
                        var erros = dataNascimento?.errors;
                        var valorTextoCampoDigitado =
                            erros != null || erros != undefined
                                ? erros['matDatepickerParse'].text
                                : null;
                        if (valorTextoCampoDigitado) {
                            idadeCrianca?.setValue('');
                            if (utils.validarData(valorTextoCampoDigitado)) {
                                var data = utils.retornaDataByString(
                                    valorTextoCampoDigitado
                                );
                                const idadeFormatada =
                                    utils.preencheIdadeFormatada(
                                        data.toISOString()
                                    );
                                idadeCrianca?.setValue(idadeFormatada, {
                                    emitEvent: true,
                                });

                                this.formulario.
                                    get('TurmaMatricula')
                                    ?.setValue([{ id: 2, descricao: 'Lilas 2' }], { emitEvent: false });

                                this.formulario
                                    .get('DataNascimento')
                                    ?.setValue(data);
                                //dataNascimento?.setValue(data, { emitEvent: false });
                            }
                        }
                    } catch (error) {
                        idadeCrianca?.setValue('');
                    }
                }
                if (value) {
                    const idadeFormatada = utils.preencheIdadeFormatada(
                        value.toISOString()
                    );
                    idadeCrianca?.setValue(idadeFormatada, { emitEvent: true });
                    //idadeCrianca?.setValue(idadeFormatada);
                }
                // else {
                //     idadeCrianca?.setValue('');
                // }
            });

        this.formulario.get('Telefone')?.valueChanges.subscribe((value) => {
            const telefone = this.formulario.get('Telefone');
            if (value) {
                telefone?.setValidators([validar.telefoneValidator()]);
            } else {
                telefone?.clearValidators();
            }
            telefone?.updateValueAndValidity({ emitEvent: false });
        });

        this.formulario
            .get('EnderecoEmail')
            ?.valueChanges.subscribe((value) => {
                const enderecoEmail = this.formulario.get('EnderecoEmail');
                if (value) {
                    enderecoEmail?.setValidators([validar.emailValidator()]);
                } else {
                    enderecoEmail?.clearValidators();
                }
                enderecoEmail?.updateValueAndValidity({ emitEvent: false });
            });

        this.formulario.get('Alergia')?.valueChanges.subscribe((value) => {
            const descricaoAlergia = this.formulario.get('DescricaoAlergia');
            if (value) {
                descricaoAlergia?.setValidators([Validators.required]);
                descricaoAlergia?.enable();
            } else {
                descricaoAlergia?.clearValidators();
                descricaoAlergia?.disable();
            }
            descricaoAlergia?.updateValueAndValidity({ emitEvent: false });
        });

        this.formulario
            .get('RestricaoAlimentar')
            ?.valueChanges.subscribe((value) => {
                const descricaoRestricao = this.formulario.get(
                    'DescricaoRestricaoAlimentar'
                );
                if (value) {
                    descricaoRestricao?.setValidators([Validators.required]);
                    descricaoRestricao?.enable();
                } else {
                    descricaoRestricao?.clearValidators();
                    descricaoRestricao?.disable();
                }
                descricaoRestricao?.updateValueAndValidity({
                    emitEvent: false,
                });
            });

        this.formulario
            .get('DeficienciaOuSituacaoAtipica')
            ?.valueChanges.subscribe((value) => {
                const descricaoDeficiencia = this.formulario.get(
                    'DescricaoDeficiencia'
                );
                if (value) {
                    descricaoDeficiencia?.setValidators([Validators.required]);
                    descricaoDeficiencia?.enable();
                } else {
                    descricaoDeficiencia?.clearValidators();
                    descricaoDeficiencia?.disable();
                }
                descricaoDeficiencia?.updateValueAndValidity({
                    emitEvent: false,
                });
            });

        this.formulario.get('Batizado')?.valueChanges.subscribe((value) => {
            const dataBatizado = this.formulario.get('DataBatizado');
            const igrejaBatizado = this.formulario.get('IgrejaBatizado');
            if (value) {
                dataBatizado?.setValidators([Validators.required]);
                dataBatizado?.enable();
                igrejaBatizado?.setValidators([Validators.required]);
                igrejaBatizado?.enable();
            } else {
                dataBatizado?.clearValidators();
                dataBatizado?.disable();
                igrejaBatizado?.clearValidators();
                igrejaBatizado?.disable();
            }
            dataBatizado?.updateValueAndValidity({ emitEvent: false });
            igrejaBatizado?.updateValueAndValidity({ emitEvent: false });
        });
    }

    salvar(): void {
        if (!this.formulario.valid) {
            console.log(this.formulario.value);
            console.log('Formulário inválido');
            return;
        }

        const valoresForm = this.formulario.getRawValue();
        var filtro = {
          "codigo": 0,
          "codigoCadastro": '',
          "nomeCrianca": valoresForm.NomeCrianca,
          "dataNascimento": valoresForm.DataNascimento,
          "nomeMae": valoresForm.NomeMae,
          "nomePai": valoresForm.NomePai,
          "outroResponsavel": valoresForm.OutroResponsavel,
          "telefone": valoresForm.Telefone,
          "enderecoEmail": valoresForm.EnderecoEmail,
          "alergia": valoresForm.Alergia,
          "descricaoAlergia": valoresForm.DescricaoAlergia,
          "restricaoAlimentar": valoresForm.RestricaoAlimentar,
          "descricaoRestricaoAlimentar": valoresForm.DescricaoRestricaoAlimentar,
          "deficienciaOuSituacaoAtipica": valoresForm.DeficienciaOuSituacaoAtipica,
          "descricaoDeficiencia": valoresForm.DescricaoDeficiencia,
          "batizado": valoresForm.Batizado,
          "dataBatizado": valoresForm.DataBatizado,
          "igrejaBatizado": valoresForm.IgrejaBatizado,
          "ativo": valoresForm.Ativo,
          "codigoUsuarioLogado": 0,
          "dataAtualizacao": utils.obterDataHoraBrasileira(),
          "dataCadastro": utils.obterDataHoraBrasileira(),
        };


        //if (this.isNovo) {
          this.alunoService.Incluir(filtro, (res: any) => {
            if (res) {
              //this.finalizarAcao();
            }
          });
        //}
    }

    limpar(): void {
        this.formulario.reset();
    }
}

export interface MatriculaAutoComplete {
    id: number;
    descricao: string;
  }
