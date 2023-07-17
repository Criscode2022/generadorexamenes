import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Tema } from 'src/main';
import { Pregunta } from 'src/main';
import { MatRadioGroup } from '@angular/material/radio';
import { MatSelect } from '@angular/material/select';
import { HttpClient } from '@angular/common/http';
import { MatFormField } from '@angular/material/form-field';
import { Router } from '@angular/router';
import { Respuesta } from 'src/main';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { RespuestaServidor } from 'src/main';
import { saveAs } from 'file-saver';
import { MatButtonModule } from '@angular/material/button';
import * as XLSX from 'xlsx';
import { ServicioDatosService } from 'src/app/servicio-datos.service';

@Component({
  selector: 'app-agregar-pregunta',
  templateUrl: './agregar-pregunta.component.html',
  styleUrls: ['./agregar-pregunta.component.css'],
})
export class AgregarPreguntaComponent implements OnInit {
  temas = new FormControl();
  ListaTemas: Tema[] = [];
  dificultades: number[] = [1, 2, 3];
  dificultadSeleccionadaAgregar: number = this.dificultades[0];
  dificultadSeleccionadaModificar: number = this.dificultades[0];
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
  temaSeleccionado: Tema = this.ListaTemas[0];
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
    private ServicioDatosService: ServicioDatosService
  ) {
    this.obtenerTemas();
  }

  ngOnInit(): void {
    this.obtenerTemas();
    this.obtenerPreguntas();
  }

  setRespuestaCorrecta(valor: string) {
    //Reiniciamos los valores por defecto
    this.respuesta1Correcta = 'NO';
    this.respuesta2Correcta = 'NO';
    this.respuesta3Correcta = 'NO';
    this.respuesta4Correcta = 'NO';
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

    console.log('La respuesta correcta es ' + valor);
    console.log(this.respuesta1Correcta);
    console.log(this.respuesta2Correcta);
    console.log(this.respuesta3Correcta);
    console.log(this.respuesta4Correcta);
  }
  obtenerTemas() {
    this.ServicioDatosService.temas$.subscribe(
      (data) => {
        if (data) {
          this.ListaTemas = data;
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
    const temaSeleccionado = this.temas.value.id_tema;
    const data = {
      id_tema: '' + temaSeleccionado,
      pregunta: this.enunciado,
      dificultad: '' + this.dificultadSeleccionadaAgregar,
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

    // Filtro para respuesta correcta
    const respuestaCorrecta = respuestasData.filter(
      (respuesta) => respuesta.es_correcta === 'SI'
    );

    // POST de la respuesta correcta
    console.log(
      'Enviando respuesta correcta al servidor: ',
      respuestaCorrecta[0]
    );
    try {
      const res = await this.http
        .post(
          'https://api-examenes.onrender.com/respuestas',
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
      (respuesta) => respuesta.es_correcta === 'NO'
    );

    // POST de cada respuesta incorrecta
    for (const respuesta of respuestasIncorrectas) {
      console.log('Enviando respuesta incorrecta al servidor: ', respuesta);
      try {
        const res = await this.http
          .post('https://api-examenes.onrender.com/respuestas', respuesta)
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
