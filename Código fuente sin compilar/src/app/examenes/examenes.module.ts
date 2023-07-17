import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExamenesRoutingModule } from './examenes-routing.module';
import { ExamenesComponent } from './examenes.component';
import { HeaderModule } from '../header/header.module';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from '../app-routing.module';
import { AppComponent } from '../app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from '../header/header.component';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { GestionarPreguntasComponent } from '../gestionar-preguntas/gestionar-preguntas.component';
import { MatMenuModule } from '@angular/material/menu';
import { BienvenidaComponent } from '../bienvenida/bienvenida.component';
import { NotFoundComponent } from '../not-found/not-found.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [ExamenesComponent],
  imports: [
    CommonModule,
    HeaderModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatMenuModule,
    MatCheckboxModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatIconModule,
    HttpClientModule,
    MatSelectModule,
    ExamenesRoutingModule,
  ],
})
export class ExamenesModule {}
