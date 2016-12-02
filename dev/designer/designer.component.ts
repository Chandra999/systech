import { Component } from '@angular/core';
import { DesignerNavigatorComponent } from './navigator/navigator.component';
import { AssetItem } from '../common/assetItem';
import { AssetType } from '../common/assetType';

@Component({
    selector: 'systech-designer',
    template: `
        <div class="uni-row nav_left_border" id="belowtopnav"  style="position:relative;top:115px; height:100%;">
            <uniSecureNavigator (expandNavigator) = navigatorExpandChange($event) (typeSelected)=typeSelected($event)>
            </uniSecureNavigator>
            <div id= "main-content" [ngClass]="{'main-default': !expand ,'main-default-toggled':expand}" >
                <router-outlet></router-outlet>
            </div>
        </div>
    `,
})

export class DesignerAppComponent {

    sType: AssetType = null;
    sItem: AssetItem = null;
    tname: string = null;
    expand: boolean = false;

    typeSelected(type: AssetType) {
        this.sType = type;
        this.sItem = null;
        this.updateTypeName();

    }

    itemSelected(item: AssetItem) {
        this.sType = item.assetType;
        this.sItem = item;
        this.updateTypeName();
    }

    updateTypeName() {
        switch (this.sType) {
            case AssetType.Family:
                this.tname = 'Family';
                break;
            case AssetType.Product:
                this.tname = 'Product';
                break;
            case AssetType.Calender:
                this.tname = 'Calender';
                break;
            case AssetType.LifeCycle:
                this.tname = 'LifeCycle';
                break;
            case AssetType.PackageProfile:
                this.tname = 'PackageProfile';
                break;
            case AssetType.ItemRun:
                this.tname = 'ItemRun';
                break;

        }
    }

    navigatorExpandChange(value) {
        if (value !== null) {
            let navigatorExpand = value.navigatorExpand;
            console.log("navigatorExpand:" + navigatorExpand);
            if (navigatorExpand) {
                this.expand = true;
            } else {
                console.log("reached")
                this.expand = false;
            }
        }
    }

}
