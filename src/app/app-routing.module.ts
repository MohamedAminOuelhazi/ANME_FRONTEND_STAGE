import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { AuthGuard } from './guard/auth.guard';
import { FteComponent } from './fte/fte.component';
import { DirectionTechniqueComponent } from './direction-technique/direction-technique.component';
import { CommissionTechniqueComponent } from './commission-technique/commission-technique.component';

import { ConsulterComponent } from './reunions/consulter/consulter.component';
import { CreationComponent } from './reunions/creation/creation.component';
import { CreerPvComponent } from './pv/creer-pv/creer-pv.component';
import { RegisterComponent } from './register/register.component';


const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: AuthComponent },
  { path: 'register', component: RegisterComponent },


  {
    path: 'Dashboard_fte',
    component: FteComponent,
    children: [
      { path: 'créerReunion', component: CreationComponent, canActivate: [AuthGuard] },
      { path: 'consulterReunion', component: ConsulterComponent, canActivate: [AuthGuard] },
      { path: 'créerpv', component: CreerPvComponent, canActivate: [AuthGuard] }


    ],
    canActivate: [AuthGuard], data: { role: 'Fte' }
  },
  {
    path: 'Dashboard_directionTechnique',
    component: DirectionTechniqueComponent,
    children: [
      { path: 'consulterReunion', component: ConsulterComponent, canActivate: [AuthGuard] }
    ],
    canActivate: [AuthGuard], data: { role: 'Direction_technique' }
  },
  {
    path: 'Dashboard_commissionTechniques',
    component: CommissionTechniqueComponent,
    children: [
      { path: 'consulterReunion', component: ConsulterComponent, canActivate: [AuthGuard] }
    ],
    canActivate: [AuthGuard], data: { role: 'Commission_techniques' }
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
