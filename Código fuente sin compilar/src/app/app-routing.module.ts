import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { NotFoundComponent } from './not-found/not-found.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'app/examenes' },
  {
    path: 'app',
    component: LayoutComponent,
    children: [
      {
        path: 'gestionarpreguntas',
        loadChildren: () =>
          import('./gestionar-preguntas/gestionar-preguntas.module').then(
            (m) => m.GestionarPreguntasModule
          ),
      },
      {
        path: 'examenes',
        loadChildren: () =>
          import('./examenes/examenes.module').then((m) => m.ExamenesModule),
      },
    ],
  },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
