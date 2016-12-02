import { Component } from '@angular/core';
import { AssetItem } from '../common/assetItem';
import { AssetType } from '../common/assetType';
import { Router } from '@angular/router';
import { AssetTypeCardsComponent } from '../common_ui/assetTypeCards.component';
import { ActionNewActivity } from './mainArea/action_new_activity.component';
import { ViewAddNewTabComponent } from './mainArea/view_addNew_tab.component';
import { TrashCanComponent } from '../trashcan/trashcan.component';
import { OperatorWelcomeComponent } from './mainArea/welcome.component';

@Component({
    selector: 'systech-unisecure',
    template: `
        <div class="uni-row nav_left_border" id="belowtopnav" style="position:relative; top:115px; height:100%;">
            <assetsNavigator (expandNavigator) = navigatorExpandChange($event) (typeSelected)=typeSelected($event)></assetsNavigator>
            <div id= "main-content" [ngClass]="{'main-default': !expand ,'main-default-toggled':expand}" >
                <router-outlet></router-outlet>
            </div>
        </div>
    `,
})

export class OperatorAppComponent {
    sType: AssetType = null;
    sItem: AssetItem = null;
    tname: string = null;
    expand: boolean = false;

    constructor() {
    }

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
            // case AssetType.View:
            //     this.tname = 'View';
            //     break;
            case AssetType.Action:
                this.tname = 'Action';
                break;
        }
    }

    navigatorExpandChange(value) {
        if (value !== null) {
            let navigatorExpand = value.navigatorExpand;
            if (navigatorExpand) {
                this.expand = true;
            } else {
                this.expand = false;
            }
        }
    }
}