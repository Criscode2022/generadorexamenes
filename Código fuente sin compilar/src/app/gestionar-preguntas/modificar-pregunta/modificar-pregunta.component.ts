import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Tema } from 'src/main';
import { Pregunta } from 'src/main';
import { Router } from '@angular/router';
import { ServicioDatosService } from 'src/app/servicio-datos.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-modificar-pregunta',
  templateUrl: './modificar-pregunta.component.html',
  styleUrls: ['./modificar-pregunta.component.css'],
})
export class ModificarPreguntaComponent implements OnInit {
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
  preguntasFiltradas: Pregunta[] = [];
  private todasLasRespuestas: any[] = [];

  constructor(
    private http: HttpClient,
    private router: Router,
    private ServicioDatosService: ServicioDatosService
  ) {
    this.obtenerTemas();
    this.obtenerPreguntas();
    this.obtenerRespuestas();
  }

  obtenerRespuestas() {
    this.http.get('https://api-examenes.onrender.com/respuestas').subscribe(
      (data: any) => {
        this.todasLasRespuestas = data;
      },
      (error) => {
        console.error('Error al obtener datos del servicio REST:', error);
      }
    );
  }

  ngOnInit(): void {
    this.preguntasFiltradas = this.ListaPreguntas;
  }

  setPreguntaSeleccionada(event: MatAutocompleteSelectedEvent): void {
    console.log(event.option.value.id_pregunta); // Verifica qué se está recibiendo aquí
    this.preguntaSeleccionadaModificar.setValue(event.option.value);
  }

  displayFn(pregunta: any): string {
    return pregunta && pregunta.pregunta ? pregunta.pregunta : '';
  }

  setRespuestaCorrecta(valor: string) {
    // Reiniciamos los valores por defecto
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

  filtrarPreguntas(texto: string): void {
    this.preguntasFiltradas = this.ListaPreguntas.filter((pregunta) =>
      pregunta.pregunta.toLowerCase().includes(texto.toLowerCase())
    );
  }

  async modificarPregunta() {
    console.log(`Respuesta 1: ${this.respuesta1}`);
    console.log(`Respuesta 2: ${this.respuesta2}`);
    console.log(`Respuesta 3: ${this.respuesta3}`);
    console.log(`Respuesta 4: ${this.respuesta4}`);
    // Actualizar la pregunta primero.
    const preguntaModificada = {
      id_tema: this.temas.value.id_tema,
      pregunta: this.enunciadoModificar,
      dificultad: this.dificultadSeleccionadaModificar,
    };

    console.log('Pregunta modificada:', preguntaModificada); // Nuevo console.log

    try {
      const preguntaRes = await this.http
        .put(
          `https://api-examenes.onrender.com/preguntas/${this.preguntaSeleccionadaModificar.value.id_pregunta}`,
          preguntaModificada
        )
        .toPromise();
      console.log('Pregunta modificada correctamente:', preguntaRes);
      this.mensajeModificar = 'Pregunta modificada correctamente';
      this.ServicioDatosService.actualizarPreguntas();

      // Recuperar las respuestas existentes para la pregunta.
      const respuestas = this.todasLasRespuestas.filter(
        (respuesta) =>
          respuesta.id_pregunta ===
          this.preguntaSeleccionadaModificar.value.id_pregunta
      );

      console.log('Respuestas recuperadas:', respuestas); // Nuevo console.log

      for (let i = 0; i < respuestas.length; i++) {
        const respuestaExistente = respuestas[i];
        const esCorrecta = i + 1 === this.respuestaCorrecta ? 'SI' : 'NO';
        let textoRespuesta;

        // Asignar el texto de la respuesta según el índice
        switch (i) {
          case 0:
            textoRespuesta = this.respuesta1;
            break;
          case 1:
            textoRespuesta = this.respuesta2;
            break;
          case 2:
            textoRespuesta = this.respuesta3;
            break;
          case 3:
            textoRespuesta = this.respuesta4;
            break;
          default:
            textoRespuesta = '';
        }

        const respuestaModificada = {
          id_pregunta: this.preguntaSeleccionadaModificar.value.id_pregunta,
          respuesta: textoRespuesta,
          es_correcta: esCorrecta,
        };
        console.log('Respuesta modificada:', respuestaModificada); // Nuevo console.log

        try {
          const respuestaRes = await this.http
            .put(
              `https://api-examenes.onrender.com/respuestas/${respuestaExistente.id_respuesta}`,
              respuestaModificada
            )
            .toPromise();
          console.log('Respuesta modificada correctamente:', respuestaRes);
          this.mensajeModificarRespuestas += ` Respuesta ${
            i + 1
          } modificada correctamente <br/>`;
        } catch (error: any) {
          console.error('Error modificando la respuesta:', error);
          this.mensajeModificarRespuestas += `Error modificando la respuesta ${
            i + 1
          }: ${error.message} <br/>`;
        }
      }

      // Actualizar las respuestas en el servicio
      this.ServicioDatosService.actualizarPreguntas();
    } catch (error: any) {
      console.error('Error modificando la pregunta:', error);
      this.mensajeModificar = `Error modificando la pregunta: ${error.message}`;
    }
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
}
