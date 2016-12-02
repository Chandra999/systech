import { NgModule } from '@angular/core';;
import { CommonUIModule } from '../common_ui/common_ui.module';
import { PreferencesHomeModule } from '../preferences/preferencesHome.module';

import { OperatorRoutingModule } from './operator-routing.module';
import { OperatorAppComponent } from './operator.component';
import { OperatorAssetsComponent } from './navigator/assets.component';
import { OperatorNavigatorComponent } from './navigator/navigator.component';
import { OperatorWelcomeComponent } from './mainArea/welcome.component';
import { ActionNewActivity } from './mainArea/action_new_activity.component';
import { PublishedFamilyComponent } from './mainArea/publishedFamily_accept_reject.component';
import { ViewPublishedFamily } from './mainArea/viewFamily_readOnly.component';
import { ViewPublishedProduct } from './mainArea/viewProduct_readOnly.component';
import { ViewPublishedPackageProfile } from './mainArea/viewPackageProfile_readOnly.component';
import { MessageService } from '../services/message.service';

import { OperatorIntegraionService } from '../services/OperatorIntegraion.service';

@NgModule({
    imports: [
        CommonUIModule,
        PreferencesHomeModule,
        OperatorRoutingModule
    ],

    declarations: [
        OperatorAppComponent,
        OperatorAssetsComponent,
        OperatorNavigatorComponent,
        OperatorWelcomeComponent,
        ActionNewActivity,
        PublishedFamilyComponent,
        ViewPublishedFamily,
        ViewPublishedProduct,
        ViewPublishedPackageProfile
    ],

    providers: [
        OperatorIntegraionService
    ]
})

export class OperatorModule { }