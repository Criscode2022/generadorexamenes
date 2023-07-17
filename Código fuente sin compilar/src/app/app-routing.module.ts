import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BienvenidaComponent } from './bienvenida/bienvenida.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { LayoutComponent } from './layout/layout.component';
import { GestionarPreguntasRoutingModule } from './gestionar-preguntas/gestionar-preguntas-routing.module';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'bienvenida' },
  { path: 'bienvenida', pathMatch: 'full', component: BienvenidaComponent },
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
