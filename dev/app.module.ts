import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// import { CommonUIModule } from './common_ui/common_ui.module';
import { DesignerModule } from './designer/designer.module';
import { OperatorModule } from './operator/operator.module';
import { AdministratorModule } from './administrator/admin.module';
import { PreferencesHomeModule } from './preferences/preferencesHome.module';

import { Tab } from './common/tab.component';
import { UI_Tabs } from './common/ui_tabs.component';

import { LoginComponent } from './login/logIn_component';
import { ForgetUsernameComponent } from './login/forget_username.component';
import { ForgetPasswordComponent } from './login/forget_password.component';
import { ResetPasswordComponent } from './login/reset_password.component';
import { TopBannerComponent } from './topBanner/topBanner.component';
import { TrashCanComponent } from './trashcan/trashcan.component';

@NgModule({
    imports: [
        BrowserModule,
        HttpModule,
        FormsModule,
        OperatorModule,
        DesignerModule,
        AdministratorModule,
        PreferencesHomeModule,
        ReactiveFormsModule,
        AppRoutingModule
    ],

    declarations: [
        AppComponent,
        LoginComponent,
        TopBannerComponent,
        ForgetUsernameComponent,
        ForgetPasswordComponent,
        ResetPasswordComponent,
        TrashCanComponent,
        Tab,
        UI_Tabs
    ],

    providers: [
        { provide: LocationStrategy, useClass: HashLocationStrategy }
    ],

    bootstrap: [AppComponent],
})

export class AppModule {
}
