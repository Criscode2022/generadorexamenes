import { Component, OnInit } from '@angular/core';
import { Tema } from 'src/main';
import { Pregunta } from 'src/main';
import { FormControl } from '@angular/forms';
import { ServicioDatosService } from 'src/app/servicio-datos.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-eliminar-pregunta',
  templateUrl: './eliminar-pregunta.component.html',
  styleUrls: ['./eliminar-pregunta.component.css'],
})
export class EliminarPreguntaComponent implements OnInit {
  mensajeEliminar = '';
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
  preguntaSeleccionadaEliminar = new FormControl();
  mensajeAgregar = '';
  mensajeAgregarRespuestas = '';
  mensajeModificar = '';
  mensajeModificarRespuestas = '';
  respuestas: string[] = ['', '', '', ''];
  preguntasFiltradas: Pregunta[] = [];

  constructor(
    private http: HttpClient,
    private ServicioDatosService: ServicioDatosService
  ) {
    this.obtenerTemas();
  }

  ngOnInit(): void {
    this.obtenerTemas();
    this.obtenerPreguntas();
    this.preguntasFiltradas = this.ListaPreguntas;
  }

  filtrarPreguntas(texto: string): void {
    this.preguntasFiltradas = this.ListaPreguntas.filter((pregunta) =>
      pregunta.pregunta.toLowerCase().includes(texto.toLowerCase())
    );
  }

  eliminarPregunta() {
    this.http
      .delete('https://api-examenes.onrender.com/preguntas/' + this.idPregunta)
      .subscribe(
        (res) => {
          console.log(
            'https://api-examenes.onrender.com/preguntas/' + this.idPregunta
          );
          if (res === false) {
            console.error('Error al eliminar la pregunta');
            this.mensajeEliminar = 'Error al eliminar la pregunta';
          } else {
            console.log(res);
            console.log('Pregunta eliminada correctamente');
            this.mensajeEliminar = 'Pregunta eliminada correctamente';
            this.ServicioDatosService.actualizarPreguntas();
          }
        },
        (err) => {
          console.error('Error en la petición HTTP');
          this.mensajeEliminar = 'Error en la petición HTTP';
          console.error(err);
        }
      );
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
