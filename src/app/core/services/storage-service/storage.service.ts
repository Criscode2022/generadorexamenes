import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  public resultadosExamenes = new BehaviorSubject<any[]>([]);

  constructor() {
    this.cargarResultados();
  }

  private cargarResultados() {
    const resultados = [];

    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        const resultado = localStorage.getItem(key);
        if (resultado) {
          resultados.push(JSON.parse(resultado));
        }
      }
    }

    this.resultadosExamenes.next(resultados);
  }

  public saveResults(resultado: any, id: string) {
    localStorage.setItem(id, JSON.stringify(resultado));
    this.cargarResultados();
  }
}
