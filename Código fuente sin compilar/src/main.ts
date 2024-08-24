import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));

export interface Pregunta {
  id_pregunta?: number;
  pregunta: string;
  dificultad: number;
  respuestas: Respuesta[];
}

export interface Respuesta {
  id_respuesta?: number;
  id_pregunta?: number;
  respuesta: string;
  es_correcta: string;
}

export interface RespuestaServidor {
  preguntas: any[];
}
