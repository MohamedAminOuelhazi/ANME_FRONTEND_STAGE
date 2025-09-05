import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ReunionsRoutingModule } from './reunions-routing.module';
import { ConsulterComponent } from './consulter/consulter.component';
import { CreationComponent } from './creation/creation.component';
import { ValidationComponent } from './validation/validation.component';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatOptionModule } from "@angular/material/core";
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from '../app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatExpansionModule } from '@angular/material/expansion';

// Angular Material modules
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SafeUrlPipe } from '../pipes/safe-url.pipe';


@NgModule({
  declarations: [
    ConsulterComponent,
    CreationComponent,
    ValidationComponent,
    SafeUrlPipe
  ],
  imports: [
    CommonModule,
    ReunionsRoutingModule,
    FormsModule,
    MatFormFieldModule,
    MatOptionModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatExpansionModule,
    MatCardModule
  ]
})
export class ReunionsModule { }
