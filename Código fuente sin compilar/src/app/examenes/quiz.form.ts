import { inject } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

export class QuizForm {
  private fb = inject(FormBuilder);

  private skeleton = {
    temas: [[], Validators.required],
    dificultad: ['', Validators.required],
    numeroPreguntas: [
      null,
      [Validators.required, Validators.min(1), Validators.max(100)],
    ],
  };

  protected form = this.fb.group(this.skeleton);

  get dificultad() {
    return this.form.get('dificultad');
  }

  get numeroPreguntas() {
    return this.form.get('numeroPreguntas');
  }

  get temas() {
    return this.form.get('temas') as FormControl;
  }
}
