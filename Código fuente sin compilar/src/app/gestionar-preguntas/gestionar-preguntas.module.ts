import { NgModule } from '@angular/core';
import { GestionarPreguntasComponent } from '../gestionar-preguntas/gestionar-preguntas.component';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { GestionarPreguntasRoutingModule } from './gestionar-preguntas-routing.module';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AgregarPreguntaComponent } from './agregar-pregunta/agregar-pregunta.component';
import { EliminarPreguntaComponent } from './eliminar-pregunta/eliminar-pregunta.component';
import { ModificarPreguntaComponent } from './modificar-pregunta/modificar-pregunta.component';
import { ServicioDatosService } from 'src/app/servicio-datos.service';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@NgModule({
  declarations: [
    GestionarPreguntasComponent,
    AgregarPreguntaComponent,
    EliminarPreguntaComponent,
    ModificarPreguntaComponent,
  ],
  imports: [
    CommonModule,
    GestionarPreguntasRoutingModule,
    MatButtonModule,
    MatButtonToggleModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    FormsModule,
    HttpClientModule,
    MatInputModule,
    MatOptionModule,
    MatRadioModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
})
export class GestionarPreguntasModule {}
