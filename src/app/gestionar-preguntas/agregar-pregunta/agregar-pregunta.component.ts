import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { DataService } from 'src/app/core/services/data-service/data.service';
import { Response } from 'src/app/shared/types/response';

@Component({
  selector: 'app-agregar-pregunta',
  templateUrl: './agregar-pregunta.component.html',
  styleUrls: ['./agregar-pregunta.component.css'],
})
export class AgregarPreguntaComponent implements OnInit {
  private http = inject(HttpClient);
  private dataService = inject(DataService);

  protected theme = new FormControl();
  protected themes$ = this.dataService.temas$;

  protected difficulties = [1, 2, 3];
  protected selectedDifficulty = this.difficulties[0];

  protected questionText = '';
  protected answer1 = '';
  protected answer2 = '';
  protected answer3 = '';
  protected answer4 = '';

  private idPreguntaInsertada: number | undefined = 0;
  protected respuestaCorrecta = 0;
  protected preguntaSeleccionada = new FormControl();

  protected message = '';
  protected load = false;

  ngOnInit() {
    this.dataService.numPreguntas$.subscribe(
      (numPreguntas) => {
        this.idPreguntaInsertada = numPreguntas + 1;
      },
      (error) => {
        console.error('Error al obtener el número de preguntas: ', error);
      }
    );
  }

  protected setRespuestaCorrecta(valor: string) {
    this.respuestaCorrecta = parseInt(valor);
  }

  protected agregarPregunta() {
    this.load = true;
    const data = {
      id_tema: this.theme.value.id_tema,
      pregunta: this.questionText,
      dificultad: this.selectedDifficulty,
    };

    this.http
      .post('https://api-workspace-wczh.onrender.com/quizzes/preguntas', data)
      .subscribe(
        async () => {
          await this.agregarRespuestas();
          this.dataService.loadPreguntas();
        },
        (error) => {
          console.error('Error al agregar pregunta: ', error);
        }
      );
  }

  private async agregarRespuestas() {
    const respuestasData: Response[] = [
      {
        id_pregunta: this.idPreguntaInsertada,
        respuesta: this.answer1,
      },
      {
        id_pregunta: this.idPreguntaInsertada,
        respuesta: this.answer2,
      },
      {
        id_pregunta: this.idPreguntaInsertada,
        respuesta: this.answer3,
      },
      {
        id_pregunta: this.idPreguntaInsertada,
        respuesta: this.answer4,
      },
    ];

    respuestasData.map((respuesta, index) => {
      if (index + 1 === this.respuestaCorrecta) {
        respuesta.es_correcta = 'SI';
      } else {
        respuesta.es_correcta = 'NO';
      }
    });

    respuestasData.sort((a) => (a.es_correcta === 'SI' ? -1 : 1));

    try {
      await firstValueFrom(
        this.http.post(
          'https://api-workspace-wczh.onrender.com/quizzes/respuestas',
          {
            respuestas: respuestasData,
          }
        )
      );

      this.message = 'Pregunta y respuestas insertadas correctamente';
      this.load = false;
    } catch (error) {
      console.error('Error al agregar respuestas: ', error);
      this.message = 'Error al insertar respuestas';
    }
  }
}
