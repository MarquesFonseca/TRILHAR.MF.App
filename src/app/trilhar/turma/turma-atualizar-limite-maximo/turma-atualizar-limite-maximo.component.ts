import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../material.module';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-turma-atualizar-limite-maximo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
  ],
  templateUrl: './turma-atualizar-limite-maximo.component.html',
  styleUrl: './turma-atualizar-limite-maximo.component.scss'
})
export class TurmaAtualizarLimiteMaximoComponent implements OnInit {

  formulario!: FormGroup;

  constructor(private fb: FormBuilder) {
    this.formulario = this.fb.group({
      usuarioId: [null],
      usuario: [null],
      produtoId: [null],
      produto: [null]
    });
  }

  ngOnInit() {

    setTimeout(() => {

    }, 0);
  }
}
