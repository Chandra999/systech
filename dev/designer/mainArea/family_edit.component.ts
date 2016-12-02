import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FamilyAssetItem } from '../../common/family_assetItem';
import { AssetType } from '../../common/assetType';
import { familyDescription, productDefaultImage } from '../../common/messages';
import { DataService } from '../../services/Assets.service';
import * as moment from 'moment';
import { MessageService } from '../../services/message.service';
import { Message } from '../../message-center/message';
import { UsersService } from '../../services/User.service';
import { Subscription } from "rxjs/Rx";
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';

@Component({
    selector: 'unisecure-family-edit',
    template: `
         <ul  id="breadcrumb" >
            <li><a (click)= "assetTypeSelected()">{{displayName}}</a> </li>
            <li>
                <a>
                    <span class="glyphicon glyphicon-asterisk" style="margin-left:2px; font-size:12px" [hidden]=!familyAssetItem.dirtyFlag></span>
                    {{familyAssetItem.name == null ? 'New Family' : getDisplayName()}}
                </a>
            </li> 
        </ul>
        <message-center></message-center>
        <form id="newFamily" class="assetForm uni-card-2" (ngSubmit)='onSave()' #f='ngForm'>
            <span class="glyphicon glyphicon-remove formClose" (click)="onClose()" title="Close"></span>
            <div class="fixed-action-btn" style="width:16%; top:200px; right:0px; margin-top:-10px;">
                <a class="btn-floating btn-large" title="Options">
                    <span class="glyphicon glyphicon-pencil" style="margin:11px 0 0 11px; font-size:18px;"></span>
                </a>
                <ul style="padding-left:0px;">
                    <li>
                        <button type="submit" [disabled]="f.form.invalid || !familyAssetItem.dirtyFlag" class="btn-floating" title="Save">
                            <span class="glyphicon glyphicon-save-file" style="margin-top:10px;"></span>
                        </button>
                    </li>
                    <li>
                        <button type="button" class="btn-floating" [disabled]="f.form.invalid || !canPublish()" (click)="onPublish()" title="Publish">
                            <span class="glyphicon glyphicon-send" style="margin-top:10px;"></span>
                        </button>
                    </li>
                    <li>
                        <button type="button" class="btn-floating" (click)="onCancel()" title="Cancel">
                            <span class="glyphicon glyphicon-remove" style="margin-top:10px;"></span>
                        </button>
                    </li>
                </ul>
            </div>
            <uni-name-description [assetType]=assetType [imageUrl]=defaultImageUrl [assetItem]=familyAssetItem [formCtrl]="f" [intro]=defaultIntro></uni-name-description>
            <label for="includeProducts" style="margin-top:20px;">Include Products</label>
            <div class="panel panel-default" style="border-color:#3b73b9;">
                <div dnd-droppable (onDropSuccess)="onSelectProduct($event)" class="panel-heading" style="min-height:70px; max-height:130px; border-color:#3b73b9; overflow-y:auto; color:white;">
                    <span *ngFor="let product of familyAssetItem.relatedList" style="display:inline-flex; background-color:#3b73b9; padding:5px; margin:0px 10px 15px 0px;">
                        <p style="margin:0px; width:110px; overflow:hidden; text-overflow: ellipsis;" title="{{product.name}}">{{product.name}}</p>
                        <span class="glyphicon glyphicon-remove" (click)="removeProduct(product)" title="Remove Product" style="font-size:xx-small; cursor:pointer; margin:3px 0 0 15px; color:white;"></span>
                    </span>
                </div>
            </div>

            <div *ngIf="availableProducts==false">
                <label><a (click)="availableProducts=true; loadProducts();" style="cursor:pointer;">Load Available Products</a></label>
            </div>
            <div class="panel panel-info" *ngIf="availableProducts==true" style="border-color:#3b73b9;">
                <div class="panel-heading" style="color:white; background-color:#3b73b9; border-color:#3b73b9;">Available Products</div>
                <span class="glyphicon glyphicon-remove" (click)="availableProducts=false" style="color:white; float: right; margin:-30px 5px 0 0; cursor:pointer;" title="Close"></span>
                <div class="panel-body" style="padding:0px; min-height:120px; max-height:235px; overflow-y:scroll;">
                    <div class="panel panel-body" [hidden]="!loading">
                        <a style="font-size:x-large;">
                        <span class="glyphicon glyphicon-refresh glyphicon-refresh-animate" style="color:#8dc63f;"></span>
                        Loading...
                    </a> 
                    </div>
                    <div class="panel panel-body" [hidden]="loading" *ngFor="let product of allProducts" dnd-draggable [dragEnabled]="true" [dragData]="product" style="max-width:130px; float:left; cursor:pointer; margin:15px; border-color:#ddd;">
                        <img [src]="getImageUrl(product.image, product.imageId)" style="width :64px; height :64px; float:left; margin:0 0 5px 0;">
                        <br>
                        <h5 style="text-align:center; margin:0px; width:70px; min-height:30px; max-height:30px; overflow:hidden; text-overflow:ellipsis;" title="{{product.objectName}}">{{product.objectName}}</h5>
                    </div>
                </div>
            </div>          
        </form>
        <modal #confirmModal style="color:#0458A2;">
            <modal-header [show-close]="false" style="height:30px !important"></modal-header>
            <modal-body>
                <div class='container2'>
                    <div>
                        <img src='public/img/alert_transparent_green_bright_2.png' class='iconDetails'>
                    </div>
                    <div style='margin-left:80px;word-wrap: break-word; '>
                        <div class="message">{{confirmTitle}}</div>
                        <div class="message">{{message}}</div>
                    </div>
                </div>
            </modal-body>
            <modal-footer>
                <button type="button" class='uni-button' (click)="cancelClicked()" style="float: right">{{cancelButtonLabel}}</button>
                <button type="button"  class='uni-button' [disabled]="f.form.invalid" (click)="okClicked()" style="float: right;margin-right:5px">{{okButtonLabel}}</button>
            </modal-footer>
        </modal>
    `,
    styleUrls: ['public/css/mainArea/breadcrumb.css', 'public/css/common/modal.css', 'public/css/mainArea/edit_assets.css', 'public/css/common/anchorButton.css'],
})

export class FamilyEditComponent implements OnInit {
    assetType: AssetType = AssetType.Family;
    familyAssetItem: FamilyAssetItem = null;
    displayName: string;
    defaultImageUrl: string;
    index: number;
    private editMode = 'create';
    private defaultName = null;
    defaultIntro = familyDescription;
    customPlugs: string[] = ['a'];
    allProducts = [];
    loading: boolean;
    baseUrl: string = null;
    temp: Array<String>;
    availableProducts = false;
    private subscription: Subscription;
    //-----------------------------------------------ConfirmModal-------------------
    @ViewChild('confirmModal')
    confirmModal: ModalComponent;
    confirmTitle: string = '';
    message: string = '';
    showCancel: boolean = false;
    okButtonLabel: string = 'Ok';
    cancelButtonLabel: string = 'No';
    //-----------------

    constructor(private router: Router, private route: ActivatedRoute, private cdr: ChangeDetectorRef, private familySvc: DataService, private ms: MessageService, private userSvc: UsersService) {
    }

    ngOnInit() {
        this.defaultImageUrl = 'public/img/' + FamilyAssetItem.getDefaultImageUrl(this.assetType);
        this.displayName = FamilyAssetItem.getDisplayName(this.assetType);
        this.subscription = this.route.params.subscribe(
            (params: any) => {
                if (params.hasOwnProperty('itemIndex')) {
                    this.editMode = 'edit';
                    this.index = +params['itemIndex'];
                }
                if (this.editMode === 'edit') {
                    this.familyAssetItem = new FamilyAssetItem(this.assetType, 'Loading...', '', '', '');
                    this.familySvc.getFamily(this.assetType, this.index).subscribe(
                        data => this.onGetItemFamily(data),
                        error => this.onShowMessage(error)
                    );
                }
                else {
                    this.familyAssetItem = new FamilyAssetItem(this.assetType, this.defaultName, '', this.defaultImageUrl, '');
                }
                this.cdr.detectChanges();
            }
        );

    }

    loadProducts() {
        this.loading = true;
        this.familySvc.getEntities(AssetType.Product).subscribe(
            data => this.onGetProduct(data),
            error => this.onShowMessage(error),
            () => { this.loading = false }
        );
    }

    onGetItemFamily(jsonData: JSON) {
        const status = jsonData.hasOwnProperty("status") ? jsonData["status"] : '';
        if (status !== "SUCCESS") {
            this.onShowMessage(jsonData);
            return;
        } else {
            var data = jsonData["data"];
            if (data != null) {
                if (data instanceof Array) {
                    if (data.length > 0) {
                        this.familyAssetItem = FamilyAssetItem.parse(data[0]);
                    }
                } else {
                    this.familyAssetItem = FamilyAssetItem.parse(data);
                }
            }
            this.familyAssetItem.dirtyFlag = false;
        }
    }

    onGetProduct(jsonData: JSON) {
        const status = jsonData.hasOwnProperty("status") ? jsonData["status"] : '';
        this.baseUrl = jsonData.hasOwnProperty("baseImageURL") ? jsonData["baseImageURL"] : '';
        if (status !== "SUCCESS") {
            this.onShowMessage(jsonData);
            return;
        } else {
            var entities = jsonData["data"];
            this.allProducts = entities;
        }
    }

    getDisplayName() {
        let name = this.familyAssetItem.name;
        if (name != null && name.length > 30) {
            return name.slice(0, 29) + "...";
        }
        return name;
    }

    getImageUrl(image, imageId) {
        if (image != null && image != undefined && image != '' && imageId > 0) {
            if (image.imageURL != null && image.imageURL != undefined && image.imageURL != '') {
                return this.baseUrl + image.imageURL;
            }
        }
        return this.baseUrl + productDefaultImage;
    }

    onSelectProduct(event) {
        var index = this.allProducts.indexOf(event.dragData, 0);
        if (this.familyAssetItem.relatedList == null) {
            this.familyAssetItem.relatedList = [];
            this.familyAssetItem.relatedList.push({ id: event.dragData.pkid, name: event.dragData.objectName });
            this.allProducts.splice(index, 1);
            this.familyAssetItem.dirtyFlag = true;
        }
        else if (event.dragData.pkid) {
            var check: boolean = false;
            for (var i = 0; i < this.familyAssetItem.relatedList.length; i++) {
                if (event.dragData.pkid == this.familyAssetItem.relatedList[i].id) {
                    check = true;
                    break;
                }
            }
            if (check == false) {
                this.familyAssetItem.relatedList.push({ id: event.dragData.pkid, name: event.dragData.objectName });
                this.allProducts.splice(index, 1);
                this.familyAssetItem.dirtyFlag = true;
            } else {
                var message = "Product already exist \'" + this.familyAssetItem.name + "'.";
                this.ms.displayRawMessage(new Message('error', message, null, null, null), this.customPlugs)
                    .subscribe((value) => console.log(value));
            }
        }
    }

    removeProduct(product) {
        var index = this.familyAssetItem.relatedList.indexOf(product, 0);
        this.familyAssetItem.relatedList.splice(index, 1);
        this.familyAssetItem.dirtyFlag = true;
    }

    onSave() {
        if (this.familyAssetItem.dirtyFlag == false) {
            this.save(true);
        }
        else {
            this.save(false);
        }
    }

    save(showDialog: boolean) {
        this.familyAssetItem.updateJSONObject();
        if (this.editMode === 'edit') {
            this.familyAssetItem.updatorName = this.userSvc.getCurrentUserName();
            this.familySvc.postFamily(this.familyAssetItem).subscribe(
                data => this.onAddEntity(data, showDialog),
                error => this.onShowMessage(error)
            );
        }
        else {
            this.familySvc.putFamily(this.familyAssetItem).subscribe(
                data => this.onAddEntity(data, showDialog),
                error => this.onShowMessage(error)
            );
        }
    }

    onPublish() {
        if (this.editMode != 'edit' || this.familyAssetItem.dirtyFlag == true) {
            this.onSave();
        }
        this.familySvc.onPublishFamily(this.familyAssetItem.pkid).subscribe(
            data => this.onPublishResult(data),
            error => this.onShowMessage(error)
        );
        this.familyAssetItem.dirtyFlag = false;
    }

    onPublishResult(jsonData: JSON) {
        const status = jsonData.hasOwnProperty("status") ? jsonData["status"] : '';
        const message = jsonData.hasOwnProperty("message") ? jsonData["message"] : '';
        if (status !== "SUCCESS") {
            this.onShowMessage(jsonData);
        }
        else {
            var displayMsg = "Family '" + this.familyAssetItem.name + "' is published.";
            this.ms.displayRawMessage(new Message(status, displayMsg, '', '', ''), this.customPlugs)
                .subscribe((value) => console.log(value));
        }
    }

    onAddEntity(jsonData: JSON, showDialog: boolean) {
        const status = jsonData.hasOwnProperty("status") ? jsonData["status"] : '';
        if (status !== "SUCCESS") {
            this.onShowMessage(jsonData);
            if (!showDialog) {
                if (this.editMode === 'edit') {
                    var displayMsg = "Failed to update \'" + this.familyAssetItem.name + '\'.';
                } else {
                    var displayMsg = "Failed to create \'" + this.familyAssetItem.name + '\'.';
                }
            }
        }
        else if (!showDialog) {
            if (this.editMode === 'edit') {
                var displayMsg = "Family '" + this.familyAssetItem.name + "' is updated successfully.";
            } else {
                var displayMsg = "New Family '" + this.familyAssetItem.name + "' is created successfully.";
                this.editMode = 'edit';
            }
            this.familyAssetItem.dirtyFlag = false;
            this.onGetItemFamily(jsonData);
        }
        this.ms.displayRawMessage(new Message(status, displayMsg, '', '', ''), this.customPlugs)
            .subscribe((value) => console.log(value));
    }

    onShowMessage(jsonData: JSON) {
        const status = jsonData.hasOwnProperty("status") ? jsonData["status"] : '';
        const message = jsonData.hasOwnProperty("message") ? jsonData["message"] : '';
        if (status != 'SUCCESS') {
            if (message != null) {
                let jsonMsgs = JSON.parse(message);
                if (jsonMsgs.msgs != null && jsonMsgs.msgs.length > 0) {
                    let msg = jsonMsgs.msgs[0];
                    let msgId = "" + msg.id;
                    while (msgId.length < 6) {
                        msgId = "0" + msgId;
                    }
                    let prefix = jsonMsgs.prefix + msgId + jsonMsgs.langId.charAt(0).toUpperCase();
                    this.ms.displayRawMessage(new Message(status, msg.message, msg.action, msg.suggestion, prefix), this.customPlugs)
                        .subscribe((value) => console.log(value));
                }
            }
        }
    }

    canPublish() {
        if (this.familyAssetItem.dirtyFlag == true) {
            return false;
        }
        if (this.familyAssetItem.relatedList == null || this.familyAssetItem.relatedList.length == 0) {
            return false;
        }
        return true;
    }


    onCancel() {
        this.router.navigate(['Designer/assets', this.assetType]);
    }

    onClose() {
        if (this.familyAssetItem.dirtyFlag == true) {
            this.openModal("Do you want to save the changes you made to \'" + this.familyAssetItem.name + "'?", "", true);
        }
        else {
            this.onCancel();
        }
    }

    assetTypeSelected() {
        this.onClose();
    }

    openModal(title: string, message: string, showCancel: boolean) {
        this.confirmTitle = title;
        this.message = message == null ? '' : message;
        this.showCancel = showCancel;
        this.okButtonLabel = this.showCancel ? "Save" : "Ok";
        this.confirmModal.open();
    }

    okClicked() {
        this.confirmModal.close();
        if (this.showCancel) {
            if (this.okButtonLabel == "Save") {
                this.save(true);
                this.cancelClicked();
            }
        }
    }

    cancelClicked() {
        this.confirmModal.close();
        this.onCancel();
    }
}