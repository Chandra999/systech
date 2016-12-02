import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http, Headers, RequestOptions } from '@angular/http';//Needed for http request
import { ViewAssetItem } from '../../common/view_assetItem';
import { AssetType } from '../../common/assetType';
import { Operator_AssetsServices_Mock } from '../../services/Operator_Assets_Mock.service';
import { UI_Tabs } from '../../common/ui_tabs.component';
import { Tab } from '../../common/tab.component';
import { EnumUtil } from '../../common/EnumUtil';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { NameDescriptionComponent } from '../../common_ui/name_description_component';
import { viewDescription } from '../../common/messages';
import { DataService } from '../../services/Assets.service';
import { Subscription } from "rxjs/Rx";

interface ArrayObjects {
    value: number;
    name: string;
}

interface Operator {
    name: string;
    description: string;
    family: number;
    familyProducts: FamilyProducts[];
}

interface FamilyProducts {
    id: number;
    value: boolean;
}

@Component({
    selector: 'view-addNew-tab',
    template: `
        <ul  id='breadcrumb' >
            <li><a (click)= 'assetTypeSelected()'>{{assetType}}</a> </li>
            <li>
                <a>
                   <span class="glyphicon glyphicon-asterisk" style="margin-left:2px; font-size:12px" [hidden]=!viewAssetItem.dirtyFlag></span>
                   {{viewAssetItem.name == null ? 'New View' : getDisplayName()}}
                </a>
            </li>
        </ul>
        <form class="assetForm uni-card-2" id="addOperator" (ngSubmit)='onSubmit(f.value)' #f='ngForm' >
        <div class="fixed-action-btn" style="width:16%; top:185px; right:0px; margin-top:-10px">
                <a class="btn-floating btn-large" title="Options">
                    <span class="glyphicon glyphicon-pencil" style="margin:11px 0 0 11px; font-size:18px;"></span>
                </a>
                <ul style="padding-left:0px;">
                    <li>
                        <button type="submit" [disabled]="!f.valid || !viewAssetItem.dirtyFlag" class="btn-floating" title="Save">
                            <span class="glyphicon glyphicon-save-file" style="margin-top:10px;"></span>
                        </button>
                    </li>
                    <li>
                        <button type="button" class="btn-floating" (click)="onCancel()" title="Cancel">
                            <span class="glyphicon glyphicon-remove" style="margin-top:10px;"></span>
                        </button>
                    </li>
                </ul>
            </div>
            <div>
                <uni-name-description [assetType]=assetType [assetItem]=viewAssetItem [intro]=defaultIntro [imageUrl]=defaultImageUrl [formCtrl]="f"></uni-name-description>
            
                <label for="family">Family</label>
                <div  style="width:66%">
                    <select [(ngModel)]="product" (ngModelChange)="onChange($event)" class="form-control">
                        <option selected disabled>-- Select Product --</option>
                        <option *ngFor="let product of family" [value]="product.value">{{product.name}}</option>
                    </select>
                </div>
                <input class ="unicheckBox" type="checkbox" name="updateView" value="Update" /><strong>update view when new products are defined.</strong>
        
                <p id="para_view_add">After selecting a Family, choose which of the products for that family that will participate in this view</p>
                <br>
                <div class="row" [hidden]="product=='-- Select Product --'">
                    <div class="panel panel-info" style="width:95%;">
                        <div class="panel-heading" style="color:white;">Products</div>
                        <div class="panel-body" style="padding:0px; min-height:120px; max-height:235px; overflow-y:scroll;">
                            <div class="panel-body" *ngFor="let product of tempJsonProducts" dnd-draggable [dragEnabled]="true" [dragData]="product" style="width: 130px; float:left; cursor:pointer">
                                <div class="panel panel-default" style="margin: 0px;">
                                    <div class="panel-body">
                                        <h5 style="text-align:center; margin: 0px;">{{product.name}}</h5>
                                        <img [src]="product.image" style="width :64px; height :64px; float:left; margin: 0px;">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div dnd-droppable class="panel panel-info" (onDropSuccess)="transferDataSuccess($event)" style="width:95%;">
                        <div class="panel-heading" style="color:white;">Selected Products (Total:{{selectedProducts.length}})</div>
                        <div class="panel-body" style="padding: 0px; min-height:120px; max-height:235px; overflow-y:scroll;cursor:default;">
                            <div class="panel-body" [hidden]="!selectedProducts.length > 0" *ngFor="let product of selectedProducts; let i=index" style="width: 130px; float:left;">
                                <div class="panel panel-default" style="margin: 0px;">
                                <span class="glyphicon glyphicon-remove" (click)="removeProduct(i, product)" title="Remove Product" style="float:right; color:#3B73B9; cursor:pointer"></span>
                                    <div class="panel-body">
                                        <h5 style="text-align:center; margin: 0px;">{{product.name}}</h5>
                                        <img [src]="product.image" style="width :64px; height :64px; float:left; margin: 0px;">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    `,
    styleUrls: ['../../public/css/mainArea/breadcrumb.css', '../../public/css/mainArea/view.css', 'public/css/common/anchorButton.css']
})

export class ViewAddNewTabComponent implements OnInit {
    family: Array<Object>;
    product: string = '-- Select Product --';
    tempJsonProducts: any[];
    tempDescriptionData: any[];
    isExpanded = false;
    value = 0;
    private defaultName = 'New View';
    selectedProducts: Array<any> = [];

    assetType: AssetType = AssetType.View;
    viewAssetItem: ViewAssetItem = null;
    private editMode = 'create';
    index: number;
    private defaultIntro = viewDescription;
    defaultImageUrl: string;
    displayName: string;
    subscription: Subscription;

    constructor(public http: Http, private viewSvc: DataService, private router: Router, private route: ActivatedRoute, private cdr: ChangeDetectorRef) {
    }

    ngOnInit() {
        this.defaultImageUrl = 'public/img/' + ViewAssetItem.getDefaultImageUrl(this.assetType);
        this.displayName = ViewAssetItem.getDisplayName(this.assetType);
        this.subscription = this.route.params.subscribe(
            (params: any) => {
                if (params.hasOwnProperty('itemIndex')) {
                    this.editMode = 'edit';
                    this.index = +params['itemIndex'];
                }
            }
        );
        if (this.editMode === 'edit') {
            this.viewAssetItem = new ViewAssetItem(this.assetType, 'Loading...', '', '', '');
            this.viewSvc.getPackageProfile(this.assetType, this.index).subscribe(
                data => this.onGetItemView(data),
                error => this.onGetError(error)
            );
        }
        else {
            this.viewAssetItem = new ViewAssetItem(this.assetType, this.defaultName, '', this.defaultImageUrl, '');
        }
        this.cdr.detectChanges()
    }

    transferDataSuccess($event) {
        this.selectedProducts.push($event.dragData);
        var index = this.tempJsonProducts.indexOf($event.dragData);
        this.tempJsonProducts.splice(index, 1);
        console.log(this.selectedProducts);
    }

    onSubmit(item: ViewAssetItem) {
        // item.assetType = this.assetType;
        // item.imageUrl = this.defaultImageUrl;
        // this.viewAssetItem !== null ? this.viewSvc.updateItem(this.assetType, this.index, item) : this.viewSvc.insertItem(this.assetType, item);
        // this.router.navigate(['Assets', { assetType: item.assetType }]);
    }

    onCancel() {
        this.router.navigate(['Assets', { assetType: this.assetType }]);
    }

    assetTypeSelected() {
        this.router.navigate(['Assets', { assetType: this.assetType }]);
    }

    //----To Display Product Card Component
    onChange($event) {
        if (this.product === '0') {
            this.http.get("public/json/products.json")
                .map(res => res.json())
                .subscribe(
                data => { this.tempJsonProducts = data.BabyProducts },
                err => console.log('Error while trying to Read Json File' + err)
                );
        }
        else if (this.product === '1') {
            this.http.get("public/json/products.json")
                .map(res => res.json())
                .subscribe(
                data => { this.tempJsonProducts = data.AdultProducts },
                err => console.log('Error while trying to Read Json File' + err)
                );
        }
        this.selectedProducts = [];
    }

    chkBoxChange(id: number, status: boolean) {
        console.log(id);
        console.log(status);
    }

    addDescription(name, description) {
        this.tempDescriptionData.reverse();
        if (name == null || name == undefined) {
            name = 'Name';
        }
        this.tempDescriptionData.push({ "value": this.tempDescriptionData.length, "name": name, "date": new Date().toDateString(), "description": description });
        this.tempDescriptionData.reverse();
    }

    removeProduct(index, product) {
        this.tempJsonProducts.push(product);
        this.selectedProducts.splice(index, 1);
        console.log(this.selectedProducts);
    }

    getDisplayName() {
        let name = this.viewAssetItem.name;
        if (name != null && name.length > 30) {
            return name.slice(0, 29) + "...";
        }
        return name;
    }

    onGetItemView(jsonData: JSON) {

    }

    onGetError(jsonData: JSON) {

    }
}
