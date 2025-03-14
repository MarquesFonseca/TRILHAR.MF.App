import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatriculaDashboardComponent } from './matricula-dashboard.component';

describe('MatriculaDashboardComponent', () => {
  let component: MatriculaDashboardComponent;
  let fixture: ComponentFixture<MatriculaDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatriculaDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatriculaDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
