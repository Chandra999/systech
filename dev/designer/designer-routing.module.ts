import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DesignerAppComponent } from './designer.component';
import { DesignerWelcomeComponent } from './mainArea/welcome.component';
import { AssetTypeCardsComponent } from '../common_ui/assetTypeCards.component';
import { PackageProfileEditComponent } from './mainArea/package_profile.component';
import { ProductEditTabComponent } from './mainArea/product_edit_tab.component';
import { FamilyEditComponent } from './mainArea/family_edit.component';
import { TrashCanComponent } from '../trashcan/trashcan.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: 'Designer', component: DesignerAppComponent,
                children: [
                    { path: '', component: DesignerWelcomeComponent }, // url: Designer/
                    { path: 'welcome', component: DesignerWelcomeComponent }, // url: Designer/welcome
                    { path: 'assets/:assetType', component: AssetTypeCardsComponent },
                    { path: 'newPackageProfile', component: PackageProfileEditComponent },
                    { path: 'editPackageProfile/:itemIndex', component: PackageProfileEditComponent },
                    { path: 'newProduct', component: ProductEditTabComponent },
                    { path: 'editProduct/:itemIndex', component: ProductEditTabComponent },
                    { path: 'newFamily', component: FamilyEditComponent },
                    { path: 'editFamily/:itemIndex', component: FamilyEditComponent },
                    { path: 'trash', component: TrashCanComponent }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})

export class DesignerRoutingModule { }