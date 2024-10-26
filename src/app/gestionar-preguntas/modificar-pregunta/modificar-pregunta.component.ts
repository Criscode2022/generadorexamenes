import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { DataService } from 'src/app/core/services/data-service/data.service';
import { Question } from 'src/app/shared/types/question';
import { Theme } from 'src/app/shared/types/theme';

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
  ListaPreguntas: Question[] = [];
  preguntaSeleccionada = new FormControl();
  preguntaSeleccionadaModificar = new FormControl();
  message = '';
  respuestas: string[] = ['', '', '', ''];
  preguntasFiltradas: Question[] = [];
  private todasLasRespuestas: any[] = [];

  private http = inject(HttpClient);
  private dataService = inject(DataService);

  private obtenerRespuestas() {
    this.http
      .get('https://api-workspace-wczh.onrender.com/quizzes/respuestas')
      .subscribe(
        (data: any) => {
          this.todasLasRespuestas = data;
        },
        (error) => {
          console.error('Error al obtener datos del servicio REST:', error);
        }
      );
  }

  ngOnInit() {
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
          `https://api-workspace-wczh.onrender.com/quizzes/preguntas/${this.preguntaSeleccionadaModificar.value.id_pregunta}`,
          preguntaModificada
        )
        .toPromise();
      this.message = 'Pregunta modificada correctamente';
      this.dataService.loadPreguntas();

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
              `https://api-workspace-wczh.onrender.com/quizzes/respuestas/${respuestaExistente.id_respuesta}`,
              respuestaModificada
            )
            .toPromise();
          this.message += ` Respuesta ${i + 1} modificada correctamente`;
        } catch (error: any) {
          console.error('Error modificando la respuesta:', error);
          this.message += `Error modificando la respuesta ${i + 1}: ${
            error.message
          }`;
        }
      }

      this.dataService.loadPreguntas();
    } catch (error: any) {
      console.error('Error modificando la pregunta:', error);
      this.message = `Error modificando la pregunta: ${error.message}`;
    }
  }

  private obtenerPreguntas() {
    this.dataService.preguntas$.subscribe(
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
