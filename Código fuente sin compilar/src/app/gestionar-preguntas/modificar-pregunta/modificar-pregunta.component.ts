import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ServicioDatosService } from 'src/app/core/services/servicio-datos/servicio-datos.service';
import { Theme } from 'src/app/shared/types/theme';
import { Pregunta } from 'src/main';

@Component({
  selector: 'app-modificar-pregunta',
  templateUrl: './modificar-pregunta.component.html',
  styleUrls: ['./modificar-pregunta.component.css'],
})
export class ModificarPreguntaComponent implements OnInit {
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

  private http = inject(HttpClient);
  private servicioDatosService = inject(ServicioDatosService);

  private obtenerRespuestas() {
    this.http.get('https://api-examenes.onrender.com/respuestas').subscribe(
      (data: any) => {
        this.todasLasRespuestas = data;
      },
      (error) => {
        console.error('Error al obtener datos del servicio REST:', error);
      }
    );
  }

  ngOnInit() {
    this.obtenerTemas();
    this.obtenerPreguntas();
    this.obtenerRespuestas();

    this.preguntasFiltradas = this.ListaPreguntas;
  }

  protected setPreguntaSeleccionada(event: MatAutocompleteSelectedEvent) {
    this.preguntaSeleccionadaModificar.setValue(event.option.value);
  }

  protected displayFn(pregunta: any): string {
    return pregunta && pregunta.pregunta ? pregunta.pregunta : '';
  }

  protected setRespuestaCorrecta(valor: string) {
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
  }

  protected filtrarPreguntas(texto: string) {
    this.preguntasFiltradas = this.ListaPreguntas.filter((pregunta) =>
      pregunta.pregunta.toLowerCase().includes(texto.toLowerCase())
    );
  }

  protected async modificarPregunta() {
    const preguntaModificada = {
      id_tema: this.temas.value.id_tema,
      pregunta: this.enunciadoModificar,
      dificultad: this.dificultadSeleccionadaModificar,
    };

    try {
      await this.http
        .put(
          `https://api-examenes.onrender.com/preguntas/${this.preguntaSeleccionadaModificar.value.id_pregunta}`,
          preguntaModificada
        )
        .toPromise();
      this.mensajeModificar = 'Pregunta modificada correctamente';
      this.servicioDatosService.actualizarPreguntas();

      const respuestas = this.todasLasRespuestas.filter(
        (respuesta) =>
          respuesta.id_pregunta ===
          this.preguntaSeleccionadaModificar.value.id_pregunta
      );

      for (let i = 0; i < respuestas.length; i++) {
        const respuestaExistente = respuestas[i];
        const esCorrecta = i + 1 === this.respuestaCorrecta ? 'SI' : 'NO';
        let textoRespuesta;

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

        try {
          await this.http
            .put(
              `https://api-examenes.onrender.com/respuestas/${respuestaExistente.id_respuesta}`,
              respuestaModificada
            )
            .toPromise();
          this.mensajeModificarRespuestas += ` Respuesta ${
            i + 1
          } modificada correctamente`;
        } catch (error: any) {
          console.error('Error modificando la respuesta:', error);
          this.mensajeModificarRespuestas += `Error modificando la respuesta ${
            i + 1
          }: ${error.message}`;
        }
      }

      this.servicioDatosService.actualizarPreguntas();
    } catch (error: any) {
      console.error('Error modificando la pregunta:', error);
      this.mensajeModificar = `Error modificando la pregunta: ${error.message}`;
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

  private obtenerPreguntas() {
    this.servicioDatosService.preguntas$.subscribe(
      (data) => {
        if (!(data && data.length)) {
          return;
        }

        this.ListaPreguntas = data;
        this.idPreguntaInsertada = data[data.length - 1].id_pregunta;
      },
      (error: any) => {
        console.error('Error al obtener datos del servicio REST:', error);
      }
    );
  }
}
