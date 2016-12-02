import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdministratorAppComponent } from './admin.component';
import { AdministratorWelcomeComponent } from './mainArea/welcome.component';
import { PreferenceCardComponent } from './mainArea/preferenceCard.component';
import { UsersComponent } from './mainArea/users_tab_component';
import { UserAddComponent } from './mainArea/user_add_tab_component';
import { DNAComponent } from './mainArea/dna.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: 'Administrator', component: AdministratorAppComponent,
                children: [
                    { path: '', component: AdministratorWelcomeComponent },
                    { path: 'usergroups', component: UsersComponent },
                    { path: 'adduser', component: UserAddComponent },
                    { path: 'edituser/:userName', component: UserAddComponent },
                    { path: 'dna', component: DNAComponent }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})

export class AdministratorRoutingModule { }