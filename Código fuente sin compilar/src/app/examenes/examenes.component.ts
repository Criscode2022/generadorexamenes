import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { saveAs } from 'file-saver';
import { RespuestaServidor } from 'src/main';
import * as XLSX from 'xlsx';
import { ServicioDatosService } from '../core/services/servicio-datos/servicio-datos.service';
import { StorageService } from '../core/services/storage-service/storage.service';
import { HeaderModule } from '../header/header.module';
import { Question } from '../shared/types/question';
import { ExamenGeneradoComponent } from './examen-generado/examen-generado.component';
import { QuizForm } from './quiz.form';

@Component({
  selector: 'app-examenes',
  templateUrl: './examenes.component.html',
  styleUrls: ['./examenes.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    HeaderModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatMenuModule,
    MatCheckboxModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatIconModule,
    HttpClientModule,
    MatSelectModule,
    ExamenGeneradoComponent,
  ],
})
export class ExamenesComponent extends QuizForm implements OnInit {
  private http = inject(HttpClient);
  private StorageService = inject(StorageService);
  private servicioDatosService = inject(ServicioDatosService);

  protected difficulties = [1, 2, 3];
  protected preguntas: Question[] = [];
  protected resultadosExamenes: any[] = [];
  protected themes$ = this.servicioDatosService.temas$;

  protected examenGenerado = false;
  protected loading = false;
  protected completed = false;
  protected submitted = false;

  ngOnInit() {
    this.StorageService.resultadosExamenes.subscribe((resultados) => {
      this.resultadosExamenes = resultados;
    });
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
    if (!this.form.valid) {
      this.submitted = true;
      return;
    }

    this.completed = false;

    this.examenGenerado = true;

    const data = {
      nombresTemas: this.form.get('temas')?.value,
      dificultad: this.form.get('dificultad')?.value,
      limite: this.form.get('numeroPreguntas')?.value,
    };

    this.http
      .post<RespuestaServidor>('https://api-examenes.onrender.com/examen', data)
      .subscribe(
        (response) => {
          this.preguntas = response.preguntas;
        },
        (error) => {
          console.error(error);
        }
      );
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

  protected cleanHistory() {
    localStorage.clear();
    window.location.reload();
  }
}
