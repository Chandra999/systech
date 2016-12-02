import { Component, OnInit, EventEmitter } from '@angular/core';
import { DataService } from '../../services/Assets.service';
import { OperatorAssetsComponent } from './assets.component';
import { AssetType, Operator_Types } from '../../common/assetType';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'assetsNavigator',
    template: `
        <div sys-nav-bar  (enterNavigator)='onEnterNavigator($event)'   [ngClass]="{'uni-col': !hide ,'uni-col-toggled':hide}"  style="padding-top: 0px; height:100%;">
            <div id="leftmenuinner " class="nav_left_border" style="display: block;  height:104%;overflow-y:auto; ">
                <div class="uni-navigator">
                    <div style="display:inline; margin:5px 5px 5px 10px">
                        <a  style="margin:5px 5px 5px 12px !important; height:25px !important; font-size:12pt" [ngClass]="{'pin': !hide && isPined ,'pin-toggled':hide}">
                            <span title="Pin Navigator" [ngClass]="{'glyphicon': true ,'glyphicon-pushpin' :!isPined, 'glyphicon-chevron-right': isPined && hide ,'glyphicon-chevron-left': isPined && !hide }" (click) ="onPinPress()"></span>
                        </a>
                        <div class="deletedAsset-toggled">
                            <a  style="display:inline-table; cursor:pointer;" (click)="onTrashClick()">
                                <span title="Deleted Assets" class="glyphicon glyphicon-trash"></span>
                                <span style="font-size :11">({{trashCount}})</span>
                            </a>
                        </div>
                        <div style="clear:both"></div>
                    </div>
                    <ul class="nav nav-pills nav-stacked " style="color : white; ">
                        <li *ngFor="let assetType of assetTypes" role="presentation" class="parentList">
                        <assets [assetType]=assetType [visible]=!hide ></assets>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
     `,
    styleUrls: ['public/css/app.css'],
    outputs: ['expandNavigator'],
})

export class OperatorNavigatorComponent implements OnInit {

    assetTypes: AssetType[] = Operator_Types;
    assetCategories: OperatorAssetsComponent[];
    hide: boolean = true;
    isPined: boolean = false;
    expandNavigator = new EventEmitter<Object>();
    trashCount: number = 0;

    constructor(private route: ActivatedRoute, private router: Router, private assetSvc: DataService) {
        this.assetSvc.navItem$.subscribe(value => this.getCount());
    }

    ngOnInit() {
        this.getCount(); //Call the function to get the count of items in trashcan
    }

    // Gets the count of items in trashcan
    getCount() {
        this.assetSvc.getTrashItemCount().subscribe(
            data => this.onGetCount(data),
            error => this.onGetError(error)
        );
    }

    onGetCount(jsonData: JSON) {
        const status = jsonData.hasOwnProperty("status") ? jsonData["status"] : '';
        if (status !== "SUCCESS") {
            this.onGetError(jsonData);
        } else {
            this.trashCount = jsonData.hasOwnProperty("count") ? jsonData["count"] : 0;
        }
    }

    onGetError(jsonData: JSON) {
        console.log(jsonData);
    }

    onPinPress() {
        this.isPined = !this.isPined;
    }

    onEnterNavigator(value) {
        if (this.isPined !== true) {
            if (value !== null) {
                let enter = value.enter;
                if (enter) {
                    this.hide = false;
                } else {
                    this.hide = true;
                }
                this.expandNavigator.emit({ 'navigatorExpand': !this.hide });
            }
        }
    }

    onTrashClick() {
        this.router.navigate(['trash'], { relativeTo: this.route });
    }
}