import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { saveAs } from 'file-saver';
import { Observable, of } from 'rxjs';
import { Pregunta, RespuestaServidor, Tema } from 'src/main';
import * as XLSX from 'xlsx';
import { ServicioDatosService } from '../servicio-datos.service';
import { QuizForm } from './quiz.form';

@Component({
  selector: 'app-examenes',
  templateUrl: './examenes.component.html',
  styleUrls: ['./examenes.component.css'],
})
export class ExamenesComponent extends QuizForm implements OnInit {
  protected difficulties = [1, 2, 3];
  protected preguntas: Pregunta[] = [];
  protected examenGenerado = false;
  protected respuestasUsuario: any[] = [];
  protected resultadosExamenes: any[] = [];
  protected respuestasCorrectas = 0;

  protected themesList$: Observable<Tema[]> = of([]);

  protected show = false;
  protected loading = false;
  protected submitted = false;

  private http = inject(HttpClient);
  private ServicioDatosService = inject(ServicioDatosService);

  ngOnInit() {
    this.cargarResultados();
    this.themesList$ = this.ServicioDatosService.temas$;
  }

  protected contarRespuestasCorrectasEscritorio() {
    let respuestasCorrectasUsuario = 0;

    for (let i = 0; i < this.preguntas.length; i++) {
      const pregunta = this.preguntas[i];
      const respuestaUsuario = this.respuestasUsuario[i];

      for (const respuesta of pregunta.respuestas) {
        if (
          respuesta.respuesta === respuestaUsuario &&
          respuesta.es_correcta === 'SI'
        ) {
          respuestasCorrectasUsuario++;
        }
      }
    }

    const resultado = {
      respuestasCorrectas: respuestasCorrectasUsuario,
      totalPreguntas: this.preguntas.length,
    };
    this.respuestasCorrectas = respuestasCorrectasUsuario;

    const id = new Date().getTime().toString();
    localStorage.setItem(id, JSON.stringify(resultado));
    this.cargarResultados();

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });

    return respuestasCorrectasUsuario;
  }

  protected contarRespuestasCorrectasMobile() {
    let respuestasCorrectasUsuario = 0;

    for (let i = 0; i < this.preguntas.length; i++) {
      let pregunta = this.preguntas[i];
      const respuestaUsuario = this.respuestasUsuario[i];

      for (const respuesta of pregunta.respuestas) {
        if (
          respuesta.respuesta === respuestaUsuario &&
          respuesta.es_correcta === 'SI'
        ) {
          respuestasCorrectasUsuario++;
        }
      }
    }

    const resultado = {
      respuestasCorrectas: respuestasCorrectasUsuario,
      totalPreguntas: this.preguntas.length,
    };
    this.respuestasCorrectas = respuestasCorrectasUsuario;

    const id = new Date().getTime().toString();
    localStorage.setItem(id, JSON.stringify(resultado));
    this.cargarResultados();

    return respuestasCorrectasUsuario;
  }

  protected descargarPreguntas() {
    let html =
      '<html><head><title>Preguntas</title></head><body> <h2>Nombre y apellidos:________________________________________________</h2><h2>Fecha: _____/_____/_________';

    for (let i = 0; i < this.preguntas.length; i++) {
      html += `<h1>${i + 1}. ${this.preguntas[i].pregunta}</h1> `;

      for (const respuesta of this.preguntas[i].respuestas) {
        html += `<p style="font-weight: normal;">  &#9634; ${respuesta.respuesta}</p>`; //UTF-8 character for a checkbox to print
      }

      html += `<br>`;
    }

    html += '</body></html>';

    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });

    saveAs(blob, 'preguntas.odt');
  }

  protected devolverpreguntas(): void {
    this.submitted = true;
    if (this.form.valid) {
      const data = {
        nombresTemas: this.form.get('temas')?.value,
        dificultad: this.form.get('dificultad')?.value,
        limite: this.form.get('numeroPreguntas')?.value,
      };

      this.http
        .post<RespuestaServidor>(
          'https://api-examenes.onrender.com/examen',
          data
        )
        .subscribe(
          (response) => {
            this.preguntas = response.preguntas;
          },
          (error) => {
            console.error(error);
          }
        );
    }
  }

  protected cargarResultados() {
    this.resultadosExamenes = [];
    for (const key in localStorage) {
      const resultado = localStorage.getItem(key);
      if (resultado) {
        this.resultadosExamenes.push(JSON.parse(resultado));
      }
    }
  }

  protected descargarRespuestas() {
    const respuestas = [];

    for (let i = 0; i < this.preguntas.length; i++) {
      const respuestaCorrecta = this.preguntas[i].respuestas.find(
        (respuesta) => respuesta.es_correcta === 'SI'
      );

      respuestas.push({
        Pregunta: this.preguntas[i].pregunta,
        Respuesta: respuestaCorrecta ? respuestaCorrecta.respuesta : 'N/A',
      });
    }

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(respuestas);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Respuestas');

    XLSX.writeFile(wb, 'respuestas.xlsx');
  }
}
