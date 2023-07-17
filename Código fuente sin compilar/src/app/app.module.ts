import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './header/header.component';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { GestionarPreguntasComponent } from './gestionar-preguntas/gestionar-preguntas.component';
import { MatMenuModule } from '@angular/material/menu';
import { BienvenidaComponent } from './bienvenida/bienvenida.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { MatTabsModule } from '@angular/material/tabs';
import { HeaderModule } from './header/header.module';
import { LayoutComponent } from './layout/layout.component';
import { AgregarPreguntaComponent } from './gestionar-preguntas/agregar-pregunta/agregar-pregunta.component';
import { ModificarPreguntaComponent } from './gestionar-preguntas/modificar-pregunta/modificar-pregunta.component';
import { EliminarPreguntaComponent } from './gestionar-preguntas/eliminar-pregunta/eliminar-pregunta.component';

@NgModule({
  declarations: [
    AppComponent,
    BienvenidaComponent,
    NotFoundComponent,
    LayoutComponent,
  ],
  imports: [
    BrowserModule,
    MatSelectModule,
    AppRoutingModule,
    MatRadioModule,
    MatMenuModule,
    MatTabsModule,
    MatButtonModule,
    HeaderModule,
    MatInputModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
