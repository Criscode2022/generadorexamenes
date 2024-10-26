import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificarPreguntaComponent } from './modificar-pregunta.component';

describe('ModificarPreguntaComponent', () => {
  let component: ModificarPreguntaComponent;
  let fixture: ComponentFixture<ModificarPreguntaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModificarPreguntaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModificarPreguntaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
