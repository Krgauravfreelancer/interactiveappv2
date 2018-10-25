import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatSelectModule, MatOptionModule } from '@angular/material';

import { environment } from '../../environments/environment';


import { PagesRoutes } from './pages.routing';

import { RegisterComponent } from './register/register.component';
import { RegisterService } from './register/register.service';
import { LoginComponent } from './login/login.component';
import { VerifyComponent } from './verify/verify.component';
import { VerifyService } from './verify/verify.service';
import { LoginService } from './login/login.service';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';


@NgModule({
  imports: [
    AngularMultiSelectModule,
    CommonModule,
    FormsModule,
    MatSelectModule,
    MatOptionModule,
    RouterModule.forChild(PagesRoutes),
    ReactiveFormsModule
  ],
  declarations: [
    LoginComponent,
    RegisterComponent,
    VerifyComponent,
    ForgotPasswordComponent
  ],
  providers: [
    RegisterService,
    VerifyService,
    LoginService
  ]
})

export class PagesModule {}
