import { NgModule } from '@angular/core';
import { CommonUIModule } from '../common_ui/common_ui.module';

import { PreferencesHomeRoutingModule } from './preferencesHome-routing.module';
import { CardComponent } from './mainArea/card.component';
import { PreferencesHomeComponent } from './preferencesHome.component';
import { PreferencesComponent } from './mainArea/preferences.component';
import { DisplayComponent } from './mainArea/display.component';
import { AccountInfoComponent } from './mainArea/account.component';
import { MessageService } from '../services/message.service';

@NgModule({
    imports: [
        CommonUIModule,
        PreferencesHomeRoutingModule
    ],

    declarations: [
        PreferencesHomeComponent,
        CardComponent,
        PreferencesComponent,
        DisplayComponent,
        AccountInfoComponent
    ],

    providers: [
        MessageService
    ],

    exports: [
        CommonUIModule
    ]
})

export class PreferencesHomeModule { }