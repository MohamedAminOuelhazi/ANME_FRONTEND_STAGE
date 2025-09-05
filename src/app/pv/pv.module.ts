import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PvRoutingModule } from './pv-routing.module';
import { ConsulterPvComponent } from './consulter-pv/consulter-pv.component';
import { CreerPvComponent } from './creer-pv/creer-pv.component';
import { SignatureComponent } from './signature/signature.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// Angular Material modules
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatOptionModule } from "@angular/material/core";
import { MatTableModule } from '@angular/material/table';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    ConsulterPvComponent,
    CreerPvComponent,
    SignatureComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    PvRoutingModule,
    MatFormFieldModule,
    MatOptionModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatExpansionModule,
    MatCardModule
  ]
})
export class PvModule { }
