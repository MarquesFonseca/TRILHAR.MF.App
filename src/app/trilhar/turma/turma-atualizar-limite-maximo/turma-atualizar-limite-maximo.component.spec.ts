import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TurmaAtualizarLimiteMaximoComponent } from './turma-atualizar-limite-maximo.component';

describe('TurmaAtualizarLimiteMaximoComponent', () => {
  let component: TurmaAtualizarLimiteMaximoComponent;
  let fixture: ComponentFixture<TurmaAtualizarLimiteMaximoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TurmaAtualizarLimiteMaximoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TurmaAtualizarLimiteMaximoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
