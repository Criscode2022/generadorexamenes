import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, ReplaySubject } from 'rxjs';
import { Pregunta } from 'src/main';
import { Tema } from 'src/main';

@Injectable({
  providedIn: 'root',
})
export class ServicioDatosService {
  private preguntasSubject: ReplaySubject<Pregunta[]> = new ReplaySubject<
    Pregunta[]
  >(1);
  private temasSubject: ReplaySubject<Tema[]> = new ReplaySubject<Tema[]>(1);

  public readonly temas$ = this.temasSubject.asObservable();
  public readonly preguntas$ = this.preguntasSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadPreguntas();
    this.loadTemas();
  }

  getPreguntas(): Observable<Pregunta[]> {
    return this.preguntas$;
  }

  getTemas(): Observable<Tema[]> {
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
    this.http.get<Tema[]>('https://api-examenes.onrender.com/temas').subscribe(
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
