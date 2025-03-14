import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CriancaDashboardComponent } from './crianca-dashboard.component';

describe('CriancaDashboardComponent', () => {
  let component: CriancaDashboardComponent;
  let fixture: ComponentFixture<CriancaDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CriancaDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CriancaDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
