import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ServicioDatosService } from 'src/app/core/services/servicio-datos/servicio-datos.service';
import { Pregunta, Tema } from 'src/main';

@Component({
  selector: 'app-agregar-pregunta',
  templateUrl: './agregar-pregunta.component.html',
  styleUrls: ['./agregar-pregunta.component.css'],
})
export class AgregarPreguntaComponent implements OnInit {
  temas = new FormControl();
  themesList: Tema[] = [];
  difficulties: number[] = [1, 2, 3];
  dificultadSeleccionadaAgregar: number = this.difficulties[0];
  dificultadSeleccionadaModificar: number = this.difficulties[0];
  enunciado: string = '';
  enunciadoModificar: string = '';
  respuesta1: string = '';
  respuesta2: string = '';
  respuesta3: string = '';
  respuesta4: string = '';
  respuesta1Correcta: string = 'NO';
  respuesta2Correcta: string = 'NO';
  respuesta3Correcta: string = 'NO';
  respuesta4Correcta: string = 'NO';
  temaSeleccionado: Tema = this.themesList[0];
  idPreguntaInsertada: number | undefined = 0;
  respuestaCorrecta: number = 0;
  rutaCambiada = false;
  idPregunta: number = 0;
  ListaPreguntas: Pregunta[] = [];
  preguntaSeleccionada = new FormControl();
  preguntaSeleccionadaModificar = new FormControl();
  mensajeEliminar = '';
  mensajeAgregar = '';
  mensajeAgregarRespuestas = '';
  mensajeModificar = '';
  mensajeModificarRespuestas = '';

  private http = inject(HttpClient);
  private servicioDatosService = inject(ServicioDatosService);

  ngOnInit() {
    this.obtenerTemas();
    this.obtenerPreguntas();
  }

  protected setRespuestaCorrecta(valor: string) {
    switch (valor) {
      case '1':
        this.respuesta1Correcta = 'SI';
        this.respuestaCorrecta = 1;
        break;
      case '2':
        this.respuesta2Correcta = 'SI';
        this.respuestaCorrecta = 2;
        break;
      case '3':
        this.respuesta3Correcta = 'SI';
        this.respuestaCorrecta = 3;
        break;
      case '4':
        this.respuesta4Correcta = 'SI';
        this.respuestaCorrecta = 4;
        break;
    }
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
    const temaSeleccionado = this.temas.value.id_tema;
    const data = {
      id_tema: '' + temaSeleccionado,
      pregunta: this.enunciado,
      dificultad: '' + this.dificultadSeleccionadaAgregar,
    };

    this.http
      .post('https://api-examenes.onrender.com/preguntas', data)
      .subscribe(
        () => {
          this.mensajeAgregar = 'Pregunta insertada correctamente';

          this.http
            .get<Pregunta[]>('https://api-examenes.onrender.com/preguntas')
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
    const respuestasData = [
      {
        es_correcta: this.respuesta1Correcta === 'SI' ? 'SI' : 'NO',
        id_pregunta: this.idPreguntaInsertada,
        respuesta: this.respuesta1,
      },
      {
        es_correcta: this.respuesta2Correcta === 'SI' ? 'SI' : 'NO',
        id_pregunta: this.idPreguntaInsertada,
        respuesta: this.respuesta2,
      },
      {
        es_correcta: this.respuesta3Correcta === 'SI' ? 'SI' : 'NO',
        id_pregunta: this.idPreguntaInsertada,
        respuesta: this.respuesta3,
      },
      {
        es_correcta: this.respuesta4Correcta === 'SI' ? 'SI' : 'NO',
        id_pregunta: this.idPreguntaInsertada,
        respuesta: this.respuesta4,
      },
    ];

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
