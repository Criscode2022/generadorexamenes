import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  catchError,
  delay,
  Observable,
  ReplaySubject,
  retry,
  retryWhen,
  take,
  throwError,
} from 'rxjs';
import { Question } from 'src/app/shared/types/question';
import { Theme } from 'src/app/shared/types/theme';

@Injectable({
  providedIn: 'root',
})
export class ServicioDatosService {
  private preguntasSubject: ReplaySubject<Question[]> = new ReplaySubject<
    Question[]
  >(1);
  private temasSubject: ReplaySubject<Theme[]> = new ReplaySubject<Theme[]>(1);

  public readonly temas$ = this.temasSubject.asObservable();
  public readonly preguntas$ = this.preguntasSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadPreguntas();
    this.loadTemas();
  }

  getPreguntas(): Observable<Question[]> {
    return this.preguntas$;
  }

  getTemas(): Observable<Theme[]> {
    return this.temas$;
  }

  private loadPreguntas() {
    this.http
      .get<Question[]>('https://api-examenes.onrender.com/preguntas')
      .subscribe((preguntas) => {
        this.preguntasSubject.next(preguntas);
      });
  }

  private loadTemas() {
    this.http
      .get<Theme[]>('https://api-examenes.onrender.com/temas')
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

  async actualizarPreguntas() {
    try {
      const response = await this.http
        .get<Question[]>('https://api-examenes.onrender.com/preguntas/')
        .toPromise();
      if (response) {
        this.preguntasSubject.next(response);
      } else {
        console.error('Error: la respuesta de la API es undefined');
      }
    } catch (error) {
      console.error('Error al obtener las preguntas: ', error);
    }
  }
}
