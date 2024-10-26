import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  catchError,
  delay,
  map,
  ReplaySubject,
  retry,
  retryWhen,
  take,
  throwError,
} from 'rxjs';
import { Question } from 'src/app/shared/types/question';
import { Response } from 'src/app/shared/types/response';
import { Theme } from 'src/app/shared/types/theme';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private preguntasSubject: ReplaySubject<Question[]> = new ReplaySubject<
    Question[]
  >(1);
  private temasSubject: ReplaySubject<Theme[]> = new ReplaySubject<Theme[]>(1);
  private respuestasSubject: ReplaySubject<any> = new ReplaySubject<Response>(
    1
  );

  public readonly temas$ = this.temasSubject.asObservable();
  public readonly preguntas$ = this.preguntasSubject.asObservable();
  public readonly numPreguntas$ = this.preguntas$.pipe(
    take(1),
    map((preguntas) => preguntas.length)
  );

  constructor(private http: HttpClient) {
    this.loadPreguntas();
    this.loadTemas();
    this.loadRespuestas();
  }

  public loadPreguntas() {
    console.log('Cargando preguntas...');
    this.http
      .get<Question[]>(
        'https://api-workspace-wczh.onrender.com/quizzes/preguntas'
      )
      .subscribe((preguntas) => {
        this.preguntasSubject.next(preguntas);
      });
  }

  private loadTemas() {
    this.http
      .get<Theme[]>('https://api-workspace-wczh.onrender.com/quizzes/temas')
      .pipe(
        retry(10),
        retryWhen((errors) => errors.pipe(delay(1000), take(5))),
        catchError((error) => {
          console.error('Error al cargar los temas:', error);
          return throwError(error);
        })
      )
      .subscribe(
        (temas) => {
          console.log('Temas recibidos:', temas);
          this.temasSubject.next(temas);
        },
        (error) => {
          console.error('Error final después de reintentos:', error);
        }
      );
  }

  private loadRespuestas() {
    this.http
      .get('https://api-workspace-wczh.onrender.com/quizzes/respuestas')
      .subscribe((respuestas) => {
        this.respuestasSubject.next(respuestas);
      });
  }
}
