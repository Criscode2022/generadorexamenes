import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ServicioDatosService } from 'src/app/core/services/servicio-datos/servicio-datos.service';
import { Pregunta, Tema } from 'src/main';

@Component({
  selector: 'app-eliminar-pregunta',
  templateUrl: './eliminar-pregunta.component.html',
  styleUrls: ['./eliminar-pregunta.component.css'],
})
export class EliminarPreguntaComponent implements OnInit {
  mensajeEliminar = '';
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
  idPregunta: number = 0;
  ListaPreguntas: Pregunta[] = [];
  preguntaSeleccionada = new FormControl();
  preguntaSeleccionadaEliminar = new FormControl();
  mensajeAgregar = '';
  mensajeAgregarRespuestas = '';
  mensajeModificar = '';
  mensajeModificarRespuestas = '';
  preguntasFiltradas: Pregunta[] = [];

  private http = inject(HttpClient);
  private servicioDatosService = inject(ServicioDatosService);

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
      .delete('https://api-examenes.onrender.com/preguntas/' + this.idPregunta)
      .subscribe(
        (res) => {
          if (res === false) {
            console.error('Error al eliminar la pregunta');
            this.mensajeEliminar = 'Error al eliminar la pregunta';
          } else {
            this.mensajeEliminar = 'Pregunta eliminada correctamente';
            this.servicioDatosService.actualizarPreguntas();
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
      (error) => {
        console.error('Error al obtener datos del servicio REST:', error);
      }
    );
  }
}
