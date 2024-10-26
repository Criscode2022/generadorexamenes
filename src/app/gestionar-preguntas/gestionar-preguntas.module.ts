import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { GestionarPreguntasComponent } from '../gestionar-preguntas/gestionar-preguntas.component';
import { AgregarPreguntaComponent } from './agregar-pregunta/agregar-pregunta.component';
import { EliminarPreguntaComponent } from './eliminar-pregunta/eliminar-pregunta.component';
import { GestionarPreguntasRoutingModule } from './gestionar-preguntas-routing.module';
import { ModificarPreguntaComponent } from './modificar-pregunta/modificar-pregunta.component';

@NgModule({
  declarations: [
    GestionarPreguntasComponent,
    AgregarPreguntaComponent,
    EliminarPreguntaComponent,
    ModificarPreguntaComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GestionarPreguntasRoutingModule,
    HttpClientModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
  ],
})
export class GestionarPreguntasModule {}
