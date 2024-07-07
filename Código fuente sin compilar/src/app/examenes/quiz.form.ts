import { inject } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

export class QuizForm {
  private fb = inject(FormBuilder);

  private skeleton = {
    temas: new FormControl([], Validators.required),
    dificultad: new FormControl('', Validators.required),
    numeroPreguntas: new FormControl(null, [
      Validators.required,
      Validators.min(1),
      Validators.max(100),
    ]),
  };

  protected form = this.fb.group(this.skeleton);
}
