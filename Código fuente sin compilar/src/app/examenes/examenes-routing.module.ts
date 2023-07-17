import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExamenesComponent } from './examenes.component';

const routes: Routes = [

{ path: '', pathMatch: 'full', component: ExamenesComponent },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExamenesRoutingModule { }
