import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PublishedFamilyAssetItem } from '../../common/publishedFamily_assetItem';
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
    selector: 'unisecure-family-view',
    template: `
         <ul  id="breadcrumb" >
            <li><a (click)= "assetTypeSelected()">{{displayName}}</a> </li>
            <li>
                <a>
                    {{publishedFamilyAssetItem.name == null ? 'Published Family' : getDisplayName()}}
                </a>
            </li> 
        </ul>
        <form id="newFamily" class="assetForm uni-card-2" (ngSubmit)='onSave()' #f='ngForm'>
            <span class="glyphicon glyphicon-remove formClose" (click)="onClose()" title="Close"></span>
            <uni-name-description [assetType]=assetType [imageUrl]=defaultImageUrl [assetItem]=publishedFamilyAssetItem [formCtrl]="f" [intro]=defaultIntro [disable]=true></uni-name-description>
            <label for="includeProducts" style="margin-top:20px;">Include Products</label>
            <div class="panel panel-default" style="border-color:#3b73b9;">
                <div dnd-droppable (onDropSuccess)="onSelectProduct($event)" class="panel-heading" style="min-height:70px; max-height:130px; border-color:#3b73b9; overflow-y:auto; color:white;">
                    <span *ngFor="let product of publishedFamilyAssetItem.data" (click)=openProduct(product.pkid) style="display:inline-flex; background-color:#3b73b9; padding:5px; margin:0px 10px 15px 0px; cursor:pointer;">
                        <p style="margin:0px; width:110px; overflow:hidden; text-overflow: ellipsis;" title="{{product.objectName}}">{{product.objectName}}</p>
                    </span>
                </div>
            </div>         
        </form>
    `,
    styleUrls: ['public/css/mainArea/breadcrumb.css', 'public/css/common/modal.css', 'public/css/mainArea/edit_assets.css', 'public/css/common/anchorButton.css'],
})

export class ViewPublishedFamily implements OnInit {
    assetType: AssetType = AssetType.PublishedFamily;
    publishedFamilyAssetItem: PublishedFamilyAssetItem = null;
    displayName: string;
    defaultImageUrl: string;
    index: number;
    private editMode = 'readOnly';
    defaultIntro = familyDescription;
    customPlugs: string[] = ['a'];
    loading: boolean;
    baseUrl: string = null;
    private subscription: Subscription;

    constructor(private router: Router, private route: ActivatedRoute, private cdr: ChangeDetectorRef, private familySvc: DataService, private ms: MessageService, private userSvc: UsersService) {
    }

    ngOnInit() {
        this.defaultImageUrl = 'public/img/' + PublishedFamilyAssetItem.getDefaultImageUrl(this.assetType);
        this.displayName = PublishedFamilyAssetItem.getDisplayName(this.assetType);
        this.subscription = this.route.params.subscribe(
            (params: any) => {
                if (params.hasOwnProperty('itemIndex')) {
                    this.index = +params['itemIndex'];
                }
                this.publishedFamilyAssetItem = new PublishedFamilyAssetItem(this.assetType, 'Loading...', '', '', '');
                this.familySvc.onGetPublishedFamily(this.index).subscribe(
                    data => this.onGetItemFamily(data),
                    error => this.onShowMessage(error)
                );
                this.cdr.detectChanges();
            }
        );
    }

    openProduct(index) {
        console.log(index)
        this.router.navigate(['Operator/viewPublishedProduct', index], { queryParams: { familyName: this.publishedFamilyAssetItem.name, familyId: this.publishedFamilyAssetItem.pkid } });
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
                        this.publishedFamilyAssetItem = PublishedFamilyAssetItem.parse(data[0]);
                    }
                } else {
                    this.publishedFamilyAssetItem = PublishedFamilyAssetItem.parse(data);
                }
            }
            this.publishedFamilyAssetItem.dirtyFlag = false;
        }
    }

    getDisplayName() {
        let name = this.publishedFamilyAssetItem.name;
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

    onClose() {
        this.router.navigate(['Operator/publishedFamily']);
    }

    assetTypeSelected() {
        this.onClose();
    }

}