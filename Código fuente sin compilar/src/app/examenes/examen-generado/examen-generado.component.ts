import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { Pregunta } from 'src/main';
import { StorageService } from '../../core/services/storage-service/storage.service';

@Component({
  selector: 'app-examen-generado',
  templateUrl: './examen-generado.component.html',
  styleUrls: ['./examen-generado.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatRadioModule],
})
export class ExamenGeneradoComponent implements OnChanges {
  @Input() preguntas: Pregunta[] = [];
  @Input() respuestasUsuario = [] as string[];

  private storageService = inject(StorageService);

  protected show = false;
  protected completed = false;

  protected respuestasCorrectas = 0;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['preguntas']) {
      this.show = false;
      this.completed = false;
      this.respuestasUsuario = [] as string[];
    }
  }

  protected contarRespuestasCorrectas() {
    let respuestasCorrectasUsuario = 0;

    for (let i = 0; i < this.preguntas.length; i++) {
      const pregunta = this.preguntas[i];
      const respuestaUsuario = this.respuestasUsuario[i];

      for (const respuesta of pregunta.respuestas) {
        if (
          respuesta.respuesta === respuestaUsuario &&
          respuesta.es_correcta === 'SI'
        ) {
          respuestasCorrectasUsuario++;
        }
      }
    }

    const resultado = {
      respuestasCorrectas: respuestasCorrectasUsuario,
      totalPreguntas: this.preguntas.length,
      passed: respuestasCorrectasUsuario >= this.preguntas.length / 2,
    };

    this.respuestasCorrectas = respuestasCorrectasUsuario;

    const id = new Date().getTime().toString();

    this.storageService.saveResults(resultado, id);

    this.completed = true;
    this.show = true;

    return respuestasCorrectasUsuario;
  }
}
