import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgregarPreguntaComponent } from './agregar-pregunta/agregar-pregunta.component';
import { EliminarPreguntaComponent } from './eliminar-pregunta/eliminar-pregunta.component';
import { GestionarPreguntasComponent } from './gestionar-preguntas.component';
import { ModificarPreguntaComponent } from './modificar-pregunta/modificar-pregunta.component';

const routes: Routes = [
  {
    path: '',
    component: GestionarPreguntasComponent,
    children: [
      {
        path: 'eliminar',
        component: EliminarPreguntaComponent,
      },
      {
        path: 'modificar',
        component: ModificarPreguntaComponent,
      },
      {
        path: 'agregar',
        component: AgregarPreguntaComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GestionarPreguntasRoutingModule {}
