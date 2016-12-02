import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PreferencesHomeComponent } from './preferencesHome.component';
import { PreferencesComponent } from './mainArea/preferences.component';
import { DisplayComponent } from './mainArea/display.component';
import { AccountInfoComponent } from './mainArea/account.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: 'PreferencesHome', component: PreferencesHomeComponent,
                children: [
                    { path: '', component: PreferencesComponent },
                    { path: 'Welcome', component: PreferencesComponent },
                    { path: 'Display', component: DisplayComponent },
                    { path: 'Account', component: AccountInfoComponent }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})

export class PreferencesHomeRoutingModule { }