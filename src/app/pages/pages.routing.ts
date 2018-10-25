import { Routes } from '@angular/router';

import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { VerifyComponent } from './verify/verify.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

export const PagesRoutes: Routes = [

    {
        path: '',
        children: [ {
            path: 'login',
            component: LoginComponent
        }, {
            path: 'register',
            component: RegisterComponent
        }, {
            path: 'verify',
            component: VerifyComponent
        }, {
            path: 'resetPassword',
            component: ForgotPasswordComponent
        }]
    }
];
