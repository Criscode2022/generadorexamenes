import { Response } from './response';

export interface Question {
  dificultad: number;
  id_pregunta?: number;
  pregunta: string;
  respuestas: Response[];
}
