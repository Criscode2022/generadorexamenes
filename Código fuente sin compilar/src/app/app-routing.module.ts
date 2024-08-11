import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { NotFoundComponent } from './not-found/not-found.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./examenes/examenes.module').then((m) => m.ExamenesModule),
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
