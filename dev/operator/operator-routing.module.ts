import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { OperatorWelcomeComponent } from './mainArea/welcome.component';
import { AssetTypeCardsComponent } from '../common_ui/assetTypeCards.component';
import { ActionNewActivity } from './mainArea/action_new_activity.component';
import { PublishedFamilyComponent } from './mainArea/publishedFamily_accept_reject.component';
import { TrashCanComponent } from '../trashcan/trashcan.component';
import { OperatorAppComponent } from './operator.component';
import { ViewPublishedFamily } from './mainArea/viewFamily_readOnly.component';
import { ViewPublishedProduct } from './mainArea/viewProduct_readOnly.component';
import { ViewPublishedPackageProfile } from './mainArea/viewPackageProfile_readOnly.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: 'Operator', component: OperatorAppComponent,
                children: [
                    { path: '', component: OperatorWelcomeComponent },
                    { path: 'Welcome', component: OperatorWelcomeComponent },
                    { path: 'assets/:assetType', component: AssetTypeCardsComponent },
                    { path: 'newAction', component: ActionNewActivity },
                    { path: 'editAction/:itemIndex', component: ActionNewActivity },
                    { path: 'publishedFamily', component: PublishedFamilyComponent },
                    { path: 'viewPublishedFamily/:itemIndex', component: ViewPublishedFamily },
                    { path: 'viewPublishedProduct/:itemIndex', component: ViewPublishedProduct },
                    { path: 'viewPublishedPackageProfile/:itemIndex', component: ViewPublishedPackageProfile },
                    { path: 'trash', component: TrashCanComponent }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})

export class OperatorRoutingModule { }