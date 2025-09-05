import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthComponent } from './auth/auth.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { AuthGuard } from './guard/auth.guard';
import { FteComponent } from './fte/fte.component';
import { DirectionTechniqueComponent } from './direction-technique/direction-technique.component';
import { CommissionTechniqueComponent } from './commission-technique/commission-technique.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { CreerReunionComponent } from './fte/creer-reunion/creer-reunion.component';
import { ConsulterReunionComponent } from './fte/consulter-reunion/consulter-reunion.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from './service/JwtInterceptor';
import { CommonModule } from '@angular/common';
import { ReunionsModule } from './reunions/reunions.module';

import { MatSelectModule } from '@angular/material/select';
import { FilterUsersPipe } from './service/FilterUsersPipe';
import { HeaderComponent } from './header/header.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

import { LucideAngularModule, Bell } from 'lucide-angular';
import { PvModule } from './pv/pv.module';
import { PdfViewerComponent } from './pdf-viewer/pdf-viewer.component';
import { RegisterComponent } from './register/register.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    FteComponent,
    DirectionTechniqueComponent,
    CommissionTechniqueComponent,
    CreerReunionComponent,
    ConsulterReunionComponent,
    FilterUsersPipe,
    HeaderComponent,
    PdfViewerComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatListModule,
    CommonModule,
    ReunionsModule,
    FormsModule,
    MatSelectModule,
    MatChipsModule,
    MatCardModule,
    MatIconModule,
    LucideAngularModule.pick({ Bell }),
    PvModule

  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
