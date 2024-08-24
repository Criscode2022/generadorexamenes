import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Pregunta } from 'src/main';
import { ServicioDatosService } from '../core/services/servicio-datos/servicio-datos.service';
import { Theme } from '../shared/types/theme';

@Component({
  selector: 'app-gestionar-preguntas',
  templateUrl: './gestionar-preguntas.component.html',
  styleUrls: ['./gestionar-preguntas.component.css'],
})
export class GestionarPreguntasComponent implements OnInit {
  temas = new FormControl();
  themesList: Theme[] = [];
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
  temaSeleccionado: Theme = this.themesList[0];
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
  respuestas: string[] = ['', '', '', ''];

  constructor(
    private http: HttpClient,
    private router: Router,
    private ServicioDatosService: ServicioDatosService
  ) {
    this.obtenerTemas();
  }

  ngOnInit(): void {
    this.obtenerTemas();
    this.obtenerPreguntas();
  }

  obtenerTemas() {
    this.ServicioDatosService.temas$.subscribe(
      (data) => {
        if (data) {
          this.themesList = data;
        }
      },
      (error) => {
        console.error('Error al obtener datos del servicio REST:', error);
      }
    );
  }

  obtenerPreguntas() {
    this.ServicioDatosService.preguntas$.subscribe(
      (data) => {
        if (data && data.length > 0) {
          this.ListaPreguntas = data;
          // La última pregunta en la base de datos es la que acabamos de insertar
          this.idPreguntaInsertada = data[data.length - 1].id_pregunta;
          console.log(
            'El Id de la pregunta insertada es ' + this.idPreguntaInsertada
          );
        }
      },
      (error) => {
        console.error('Error al obtener datos del servicio REST:', error);
      }
    );
  }

  agregarPregunta() {
    const temaSeleccionado = this.temas.value;
    const data = {
      tema: temaSeleccionado,
      texto: this.enunciado,
      dificultad: this.dificultadSeleccionadaAgregar,
    };

    console.log(data);

    this.http
      .post('https://api-examenes.onrender.com/preguntas', data)
      .subscribe(
        (res) => {
          console.log(res);
          console.log('Pregunta insertada correctamente');
          this.mensajeAgregar = 'Pregunta insertada correctamente';

          // Obtener todas las preguntas de la base de datos
          this.http
            .get<Pregunta[]>('https://api-examenes.onrender.com/preguntas')
            .subscribe(
              (response) => {
                if (response && response.length > 0) {
                  //La última pregunta en la base de datos es la que acabamos de insertar
                  this.idPreguntaInsertada =
                    response[response.length - 1].id_pregunta;
                  console.log(
                    'El Id de la pregunta insertada es ' +
                      this.idPreguntaInsertada
                  );
                  this.agregarRespuestas();

                  //Llamada al servicio para actualizar la lista de preguntas después de insertar una nueva
                  this.ServicioDatosService.actualizarPreguntas();
                }
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

  async agregarRespuestas() {
    const respuestasData = [
      {
        esCorrecta: this.respuesta1Correcta === 'SI' ? 'SI' : 'NO',
        pregunta: { id: this.idPreguntaInsertada },
        texto: this.respuesta1,
      },
      {
        esCorrecta: this.respuesta2Correcta === 'SI' ? 'SI' : 'NO',
        pregunta: { id: this.idPreguntaInsertada },
        texto: this.respuesta2,
      },
      {
        esCorrecta: this.respuesta3Correcta === 'SI' ? 'SI' : 'NO',
        pregunta: { id: this.idPreguntaInsertada },
        texto: this.respuesta3,
      },
      {
        esCorrecta: this.respuesta4Correcta === 'SI' ? 'SI' : 'NO',
        pregunta: { id: this.idPreguntaInsertada },
        texto: this.respuesta4,
      },
    ];

    // Filtro para respuesta correcta
    const respuestaCorrecta = respuestasData.filter(
      (respuesta) => respuesta.esCorrecta === 'SI'
    );

    //POST de la respuesta correcta
    console.log(
      'Enviando respuesta correcta al servidor: ',
      respuestaCorrecta[0]
    );
    try {
      const res = await this.http
        .post(
          'https://api-examenes.onrender.com/respuesta',
          respuestaCorrecta[0]
        )
        .toPromise();
      console.log('Respuesta del servidor: ', res);
      console.log('Respuesta correcta insertada correctamente');
    } catch (error) {
      console.error('Error al agregar respuesta correcta: ', error);
    }

    // Filtro para respuestas incorrectas
    const respuestasIncorrectas = respuestasData.filter(
      (respuesta) => respuesta.esCorrecta === 'NO'
    );

    // POST de cada respuesta incorrecta
    for (const respuesta of respuestasIncorrectas) {
      console.log('Enviando respuesta incorrecta al servidor: ', respuesta);
      try {
        const res = await this.http
          .post('https://api-examenes.onrender.com/respuesta', respuesta)
          .toPromise();
        console.log('Respuesta del servidor: ', res);
        console.log('Respuesta incorrecta insertada correctamente');
        this.mensajeAgregarRespuestas = 'Respuestas insertadas correctamente';
      } catch (error) {
        console.error('Error al agregar respuesta incorrecta: ', error);
        this.mensajeAgregarRespuestas = 'Error al insertar respuestas';
      }
    }
  }
}
