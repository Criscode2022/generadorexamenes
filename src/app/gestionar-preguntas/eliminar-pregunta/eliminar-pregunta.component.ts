import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DataService } from 'src/app/core/services/data-service/data.service';
import { Question } from 'src/app/shared/types/question';
import { Theme } from 'src/app/shared/types/theme';

@Component({
  selector: 'app-eliminar-pregunta',
  templateUrl: './eliminar-pregunta.component.html',
  styleUrls: ['./eliminar-pregunta.component.css'],
})
export class EliminarPreguntaComponent implements OnInit {
  mensajeEliminar = '';
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
  preguntaSeleccionadaEliminar = new FormControl();
  mensajeAgregar = '';
  mensajeAgregarRespuestas = '';
  mensajeModificar = '';
  mensajeModificarRespuestas = '';
  preguntasFiltradas: Question[] = [];

  private http = inject(HttpClient);
  private dataService = inject(DataService);

  ngOnInit() {
    this.obtenerTemas();
    this.obtenerPreguntas();
    this.preguntasFiltradas = this.ListaPreguntas;
  }

  protected filtrarPreguntas(texto: string) {
    this.preguntasFiltradas = this.ListaPreguntas.filter((pregunta) =>
      pregunta.pregunta.toLowerCase().includes(texto.toLowerCase())
    );
  }

  protected eliminarPregunta() {
    this.http
      .delete(
        'https://api-workspace-wczh.onrender.com/quizzes/preguntas/' +
          this.idPregunta
      )
      .subscribe(
        (res) => {
          if (res === false) {
            console.error('Error al eliminar la pregunta');
            this.mensajeEliminar = 'Error al eliminar la pregunta';
          } else {
            this.mensajeEliminar = 'Pregunta eliminada correctamente';
            this.dataService.loadPreguntas();
          }
        },
        (err) => {
          console.error('Error en la petición HTTP');
          this.mensajeEliminar = 'Error en la petición HTTP';
          console.error(err);
        }
      );
  }

  protected obtenerTemas() {
    this.dataService.temas$.subscribe(
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
    this.dataService.preguntas$.subscribe(
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
}
