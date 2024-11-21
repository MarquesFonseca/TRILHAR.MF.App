import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TumaListarComponent } from './tuma-listar.component';

describe('TumaListarComponent', () => {
  let component: TumaListarComponent;
  let fixture: ComponentFixture<TumaListarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TumaListarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TumaListarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
