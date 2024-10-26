import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamenGeneradoComponent } from './examen-generado.component';

describe('ExamenGeneradoComponent', () => {
  let component: ExamenGeneradoComponent;
  let fixture: ComponentFixture<ExamenGeneradoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExamenGeneradoComponent]
    });
    fixture = TestBed.createComponent(ExamenGeneradoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
