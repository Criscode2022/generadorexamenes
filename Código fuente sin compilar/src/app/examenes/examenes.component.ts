import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatFormField } from '@angular/material/form-field';
import { Router } from '@angular/router';
import { Respuesta } from 'src/main';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { Tema } from 'src/main';
import { Pregunta } from 'src/main';
import { RespuestaServidor } from 'src/main';
import { saveAs } from 'file-saver';
import { HeaderComponent } from '../header/header.component';
import { MatButtonModule } from '@angular/material/button';
import { ServicioDatosService } from '../servicio-datos.service';
import * as XLSX from 'xlsx';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-examenes',
  templateUrl: './examenes.component.html',
  styleUrls: ['./examenes.component.css'],
})
export class ExamenesComponent implements OnInit {
  dificultades = [1, 2, 3];
  listaTemas$: Observable<Tema[]> = of([]);
  preguntas: Pregunta[] = [];
  examenGenerado: boolean = false;
  form: FormGroup;
  loading: boolean = false; //Indicador spinner en caso de que la lista de temas tarde en cargar
  respuestasUsuario: string[] = [];
  mostrar = false;
  resultadosExamenes: any[] = [];
  respuestasCorrectas = 0;
  public submitted = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private ServicioDatosService: ServicioDatosService,
    private fb: FormBuilder
  ) {
    this.listaTemas$ = this.ServicioDatosService.temas$;
    this.form = this.fb.group({
      temas: new FormControl([], Validators.required),
      dificultad: new FormControl('', Validators.required),
      numeroPreguntas: new FormControl(null, [
        Validators.required,
        Validators.min(1),
        Validators.max(100),
      ]),
    });
  }

  ngOnInit() {
    this.cargarResultados();
    this.listaTemas$ = this.ServicioDatosService.temas$;
  }

  contarRespuestasCorrectasEscritorio() {
    let respuestasCorrectasUsuario = 0;

    for (let i = 0; i < this.preguntas.length; i++) {
      let pregunta = this.preguntas[i];
      let respuestaUsuario = this.respuestasUsuario[i];
      console.log('La pregunta es ' + JSON.stringify(pregunta));
      console.log('La respuesta es ' + respuestaUsuario);

      for (let respuesta of pregunta.respuestas) {
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

    //Scroll hacia la parte inicial de la página al hacer click en el botón que llama a la función
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });

    return respuestasCorrectasUsuario;
  }

  contarRespuestasCorrectasMobile() {
    let respuestasCorrectasUsuario = 0;

    for (let i = 0; i < this.preguntas.length; i++) {
      let pregunta = this.preguntas[i];
      let respuestaUsuario = this.respuestasUsuario[i];
      console.log('La pregunta es ' + JSON.stringify(pregunta));
      console.log('La respuesta es ' + respuestaUsuario);

      for (let respuesta of pregunta.respuestas) {
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

  descargarPreguntas() {
    let html =
      '<html><head><title>Preguntas</title></head><body> <h2>Nombre y apellidos:________________________________________________</h2><h2>Fecha: _____/_____/_________';

    // Añade cada pregunta y sus respuestas al HTML
    for (let i = 0; i < this.preguntas.length; i++) {
      html += `<h1>${i + 1}. ${this.preguntas[i].pregunta}</h1> `;

      for (let respuesta of this.preguntas[i].respuestas) {
        html += `<p style="font-weight: normal;">  &#9634; ${respuesta.respuesta}</p>`; //Checkbox en formato UTF-8 apta para imprimir
      }

      html += `<br>`;
    }

    html += '</body></html>';

    // Crea un objeto Blob con el HTML
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });

    // Usa FileSaver.js para descargar el archivo
    saveAs(blob, 'preguntas.odt');
  }

  devolverpreguntas(): void {
    this.submitted = true;
    if (this.form.valid) {
      const data = {
        nombresTemas: this.form.get('temas')?.value,
        dificultad: this.form.get('dificultad')?.value,
        limite: this.form.get('numeroPreguntas')?.value,
      };
      console.log('Petición al servidor: ' + JSON.stringify(data));

      this.http
        .post<RespuestaServidor>(
          'https://api-examenes.onrender.com/examen',
          data
        )
        .subscribe(
          (response) => {
            console.log('Respuesta del servidor: ' + JSON.stringify(response));
            console.log(response.preguntas);
            this.preguntas = response.preguntas;
          },
          (error) => {
            console.error(error);
          }
        );
    }
  }

  cargarResultados() {
    this.resultadosExamenes = [];
    for (let key in localStorage) {
      let resultado = localStorage.getItem(key);
      if (resultado) {
        this.resultadosExamenes.push(JSON.parse(resultado));
      }
    }
  }

  descargarRespuestas() {
    // Crea una matriz para almacenar las respuestas
    const respuestas = [];

    // Añade cada pregunta y su respuesta correcta a la matriz
    for (let i = 0; i < this.preguntas.length; i++) {
      const respuestaCorrecta = this.preguntas[i].respuestas.find(
        (respuesta) => respuesta.es_correcta === 'SI'
      );

      respuestas.push({
        Pregunta: this.preguntas[i].pregunta,
        Respuesta: respuestaCorrecta ? respuestaCorrecta.respuesta : 'N/A',
      });
    }

    // Usa la biblioteca xlsx para crear una hoja de trabajo de la matriz
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(respuestas);

    // Crea un libro de trabajo y añade la hoja de trabajo
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Respuestas');

    // Usa la biblioteca xlsx para descargar el libro de trabajo como un archivo xlsx
    XLSX.writeFile(wb, 'respuestas.xlsx');
  }
}
