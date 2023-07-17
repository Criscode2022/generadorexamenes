import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ServicioDatosService } from '../servicio-datos.service';
import { Observable, of } from 'rxjs';
import { Tema } from 'src/main';

@Component({
  selector: 'app-bienvenida',
  templateUrl: './bienvenida.component.html',
  styleUrls: ['./bienvenida.component.css'],
})
export class BienvenidaComponent implements OnInit {
  translatedText: string = '';
  listaTemas$: Observable<Tema[]> = of([]);

  constructor(
    private http: HttpClient,
    private ServicioDatosService: ServicioDatosService
  ) {
    this.listaTemas$ = this.ServicioDatosService.temas$;
  }

  ngOnInit(): void {}

  //Este método no funciona porque la documentación de la API dice que no se permiten las llamadas de las aplicaciones web desde el cliente, hay que hacerlo desde el servidor

  translateText(text: string) {
    const headers = new HttpHeaders({
      Authorization: 'DeepL-Auth-Key c84b2093-a31d-b965-fd76-8180df0a495c:fx',
      'User-Agent': 'YourApp/1.2.3',
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    const body = new URLSearchParams();
    body.set('text', text);
    body.set('target_lang', 'DE');

    this.http
      .post('https://api-free.deepl.com/v2/translate', body, {
        headers,
        responseType: 'text',
      })
      .subscribe(
        (response) => {
          this.translatedText = response;
        },
        (error) => {
          console.error(error);
        }
      );
  }

  testTranslation() {
    this.translateText('Hello, world!');
  }
}
