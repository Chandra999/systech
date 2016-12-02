import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './login/logIn_component';
import { ForgetUsernameComponent } from './login/forget_username.component';
import { ForgetPasswordComponent } from './login/forget_password.component';
import { ResetPasswordComponent } from './login/reset_password.component';

@NgModule({
    imports: [
        RouterModule.forRoot([
            { path: '', component: LoginComponent },
            { path: 'login', component: LoginComponent },
            { path: 'Forgetusername', component: ForgetUsernameComponent },
            { path: 'Forgetpassword', component: ForgetPasswordComponent },
            { path: 'ResetPassword', component: ResetPasswordComponent },
        ])
    ],
    exports: [
        RouterModule
    ]
})

export class AppRoutingModule { }