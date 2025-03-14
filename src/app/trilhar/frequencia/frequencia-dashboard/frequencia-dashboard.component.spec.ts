import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrequenciaDashboardComponent } from './frequencia-dashboard.component';

describe('FrequenciaDashboardComponent', () => {
  let component: FrequenciaDashboardComponent;
  let fixture: ComponentFixture<FrequenciaDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FrequenciaDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FrequenciaDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
