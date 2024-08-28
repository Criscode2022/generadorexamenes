import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ServicioDatosService } from 'src/app/core/services/servicio-datos/servicio-datos.service';
import { Question } from 'src/app/shared/types/question';
import { Response } from 'src/app/shared/types/response';
import { Theme } from 'src/app/shared/types/theme';

@Component({
  selector: 'app-agregar-pregunta',
  templateUrl: './agregar-pregunta.component.html',
  styleUrls: ['./agregar-pregunta.component.css'],
})
export class AgregarPreguntaComponent implements OnInit {
  private http = inject(HttpClient);
  private servicioDatosService = inject(ServicioDatosService);

  protected temas = new FormControl();
  protected themesList: Theme[] = [];
  protected selectedTheme: Theme = this.themesList[0];

  protected difficulties: number[] = [1, 2, 3];
  protected selectedDifficulty: number = this.difficulties[0];

  protected enunciado = '';
  protected respuesta1 = '';
  protected respuesta2 = '';
  protected respuesta3 = '';
  protected respuesta4 = '';

  private idPreguntaInsertada: number | undefined = 0;
  private respuestaCorrecta = 0;
  protected idPregunta = 0;
  protected ListaPreguntas: Question[] = [];
  protected preguntaSeleccionada = new FormControl();

  protected mensajeAgregar = '';
  protected mensajeAgregarRespuestas = '';

  ngOnInit() {
    this.obtenerTemas();
    this.obtenerPreguntas();
  }

  protected setRespuestaCorrecta(valor: string) {
    this.respuestaCorrecta = parseInt(valor);
  }

  private obtenerTemas() {
    this.servicioDatosService.temas$.subscribe(
      (data) => {
        if (!data) {
          return;
        }

        this.themesList = data;
      },
      (error) => {
        console.error('Error al obtener datos del servicio REST:', error);
      }
    );
  }

  protected obtenerPreguntas() {
    this.servicioDatosService.preguntas$.subscribe(
      (data) => {
        if (!(data && data.length)) {
          return;
        }

        this.ListaPreguntas = data;
        this.idPreguntaInsertada = data[data.length - 1].id_pregunta;
      },
      (error) => {
        console.error('Error al obtener datos del servicio REST:', error);
      }
    );
  }

  protected agregarPregunta() {
    const data = {
      id_tema: this.temas.value.id_tema,
      pregunta: this.enunciado,
      dificultad: this.selectedDifficulty,
    };

    this.http
      .post('https://api-examenes.onrender.com/preguntas', data)
      .subscribe(
        () => {
          this.mensajeAgregar = 'Pregunta insertada correctamente';

          this.http
            .get<Question[]>('https://api-examenes.onrender.com/preguntas')
            .subscribe(
              (response) => {
                if (!(response && response.length)) {
                  return;
                }

                this.idPreguntaInsertada =
                  response[response.length - 1].id_pregunta;

                this.agregarRespuestas();
                this.servicioDatosService.actualizarPreguntas();
              },
              (error) => {
                console.error('Error al obtener las preguntas: ', error);
                (this.mensajeAgregar = 'Error al obtener las preguntas: '),
                  error;
              }
            );
        },
        (error) => {
          console.error('Error al agregar pregunta: ', error);
          (this.mensajeAgregar = 'Error al agregar pregunta: '), error;
        }
      );
  }

  private async agregarRespuestas() {
    const respuestasData: Response[] = [
      {
        id_pregunta: this.idPreguntaInsertada,
        respuesta: this.respuesta1,
      },
      {
        id_pregunta: this.idPreguntaInsertada,
        respuesta: this.respuesta2,
      },
      {
        id_pregunta: this.idPreguntaInsertada,
        respuesta: this.respuesta3,
      },
      {
        id_pregunta: this.idPreguntaInsertada,
        respuesta: this.respuesta4,
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
      await this.http
        .post('https://api-examenes.onrender.com/respuestas', {
          respuestas: respuestasData,
        })
        .toPromise();

      this.mensajeAgregarRespuestas = 'Respuestas insertadas correctamente';
    } catch (error) {
      console.error('Error al agregar respuestas: ', error);
      this.mensajeAgregarRespuestas = 'Error al insertar respuestas';
    }
  }
}
