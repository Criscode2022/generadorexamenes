import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExamenesComponent } from './examenes/examenes.component';
import { LayoutComponent } from './layout/layout.component';
import { NotFoundComponent } from './not-found/not-found.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: ExamenesComponent,
      },
      {
        path: 'gestionar',
        loadChildren: () =>
          import('./gestionar-preguntas/gestionar-preguntas.module').then(
            (m) => m.GestionarPreguntasModule
          ),
      },
    ],
  },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
