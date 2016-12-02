import { NgModule } from '@angular/core';
import { CommonUIModule } from '../common_ui/common_ui.module';
import { PreferencesHomeModule } from '../preferences/preferencesHome.module';

import { DesignerRoutingModule } from './designer-routing.module';
import { DesignerAppComponent } from './designer.component';
import { DesignerAssetsComponent } from './navigator/assets.component';
import { DesignerNavigatorComponent } from './navigator/navigator.component';
import { WelcomeGraph } from './mainArea/welcome.directive';
import { DesignerWelcomeComponent } from './mainArea/welcome.component';
import { PackageProfileEditComponent } from './mainArea/package_profile.component';
import { ProductEditTabComponent } from './mainArea/product_edit_tab.component';
import { FamilyEditComponent } from './mainArea/family_edit.component';
import { MessageService } from '../services/message.service';

@NgModule({
    imports: [
        CommonUIModule,
        PreferencesHomeModule,
        DesignerRoutingModule
    ],

    declarations: [
        DesignerAppComponent,
        DesignerAssetsComponent,
        DesignerNavigatorComponent,
        // WelcomeGraph,
        DesignerWelcomeComponent,
        PackageProfileEditComponent,
        ProductEditTabComponent,
        FamilyEditComponent
    ],

    providers: [
    ]
})

export class DesignerModule { }