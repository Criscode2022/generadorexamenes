import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, retry } from 'rxjs';
import { Theme } from 'src/app/shared/types/theme';
import { Pregunta } from 'src/main';

@Injectable({
  providedIn: 'root',
})
export class ServicioDatosService {
  private preguntasSubject: ReplaySubject<Pregunta[]> = new ReplaySubject<
    Pregunta[]
  >(1);
  private temasSubject: ReplaySubject<Theme[]> = new ReplaySubject<Theme[]>(1);

  public readonly temas$ = this.temasSubject.asObservable();
  public readonly preguntas$ = this.preguntasSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadPreguntas();
    this.loadTemas();
  }

  getPreguntas(): Observable<Pregunta[]> {
    return this.preguntas$;
  }

  getTemas(): Observable<Theme[]> {
    return this.temas$;
  }

  private loadPreguntas() {
    this.http
      .get<Pregunta[]>('https://api-examenes.onrender.com/preguntas')
      .subscribe((preguntas) => {
        this.preguntasSubject.next(preguntas);
      });
  }

  private loadTemas() {
    this.http
      .get<Theme[]>('https://api-examenes.onrender.com/temas')
      .pipe(retry(10))
      .subscribe(
        (temas) => {
          console.log('Temas recibidos:', temas);
          this.temasSubject.next(temas);
        },
        (error) => {
          console.error('Error al cargar los temas:', error);
        }
      );
  }

  async actualizarPreguntas() {
    try {
      const response = await this.http
        .get<Pregunta[]>('https://api-examenes.onrender.com/preguntas/')
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
