import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { HeaderModule } from '../header/header.module';
import { ExamenesRoutingModule } from './examenes-routing.module';
import { ExamenesComponent } from './examenes.component';

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
