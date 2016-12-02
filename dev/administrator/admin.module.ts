import { NgModule } from '@angular/core';;
import { CommonUIModule } from '../common_ui/common_ui.module';
import { PreferencesHomeModule } from '../preferences/preferencesHome.module';

import { AdministratorRoutingModule } from './admin-routing.module';
import { AdministratorAppComponent } from './admin.component';;
import { AdministratorWelcomeComponent } from './mainArea/welcome.component';
import { PreferenceCardComponent } from './mainArea/preferenceCard.component';
import { VideosComponent } from '../video/videos.component';

import { UsersComponent } from './mainArea/users_tab_component';
import { UserAddComponent } from './mainArea/user_add_tab_component';
import { DNAComponent } from './mainArea/dna.component';
import { DataService } from '../services/Assets.service';
import { UsersService } from '../services/User.service';
import { MessageService } from '../services/message.service';


@NgModule({
    imports: [
        CommonUIModule,
        PreferencesHomeModule,
        AdministratorRoutingModule
    ],

    declarations: [
        AdministratorAppComponent,
        AdministratorWelcomeComponent,
        PreferenceCardComponent,
        VideosComponent,
        UsersComponent,
        UserAddComponent,
        DNAComponent
    ],

    providers: [
    ]
})

export class AdministratorModule { }