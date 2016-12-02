import { Component, ChangeDetectorRef } from '@angular/core';
import { AssetItem } from '../../common/assetItem';
import { AssetType } from '../../common/assetType';
import { Router, ActivatedRoute } from '@angular/router';
import { UI_Tabs } from '../../common/ui_tabs.component';
import { Tab } from '../../common/tab.component';
import { NameDescriptionComponent } from '../../common_ui/name_description_component';
import { lifeCycleDescription } from '../../common/messages';
import { MessageService } from '../../services/message.service';
import { MessageCenterComponent } from '../../message-center/message-center.component';
import { Message } from '../../message-center/message';
import { DataService } from '../../services/Assets.service';


@Component({
    selector: 'unisecure-life-cycle',
    template: `
        <ul  id="breadcrumb" >
                <li><a (click)= "assetTypeSelected()">{{displayName}}</a> </li>
                <li><a>{{alertItem.name}}</a> </li>
        </ul>
<!--        <message-center></message-center>
        <form class= "assetForm uni-card-2" id="alert-edit-add" (ngSubmit)="onSubmit(f.value)" #f="ngForm">
        <uni-name-description [assetType]=assetType [imageUrl]=defaultImageUrl [assetItem]= alertItem [formCtrl]="f" [intro]=defaultIntro></uni-name-description>
        <div>
                <span><a class="uni-button" (click)="onCancel()"  style="float:right; margin:20px 200px 5px 5px">Cancel</a></span>
                <span><button type ="submit" class="uni-button" style="float:right; margin:20px 0px 5px 5px" [disabled]="!f.valid">Save</button></span>
                <div style="clear:both"></div>
           </div>
        </form>     -->
    `,
    styleUrls: ['public/css/mainArea/breadcrumb.css', 'public/css/mainArea/edit_assets.css']

})



export class LifeCyclEditComponent {
    assetType: AssetType = AssetType.LifeCycle;
    alertItem: AssetItem = null;
    alerts: string[];
    displayName: string;
    defaultImageUrl: string;
    index: number;
    private editMode = 'create';
    private defaultName = 'New Life Cycle';
    defaultIntro = lifeCycleDescription;
    customPlugs: string[] = ['a'];

    constructor(private route: ActivatedRoute, private dataService: DataService, private router: Router, private cdr: ChangeDetectorRef, private ms: MessageService) {

    }



    // onSubmit(item: AssetItem) {
    //     item.assetType = this.assetType;
    //     item.imageUrl = 'public/img/';
    //     // this.alertItem !== null ? this.dataService.updateItem(this.assetType, this.index, item) : this.dataService.insertItem(this.assetType, item);
    //     // this.router.navigate(['Assets', { assetType: item.assetType }]);
    //     this.ms.displayRawMessage(new Message('Success', 'Life Cycle Saved', '', '', ''), this.customPlugs)
    //         .subscribe((value) => console.log(value));
    // }


    // assetTypeSelected() {
    //     this.router.navigate(['Assets', { assetType: this.assetType }]);
    // }

    // ngOnInit() {
    //     // this.displayName = AssetItem.getDisplayName(this.assetType);
    //     // this.defaultImageUrl = 'public/img/' + AssetItem.getDefaultImageUrl(this.assetType);
    //     // // this.editMode = this.routeParams.get('editMode');
    //     // // if (this.editMode === 'edit') {
    //     // //     this.index = +this.routeParams.get('itemIndex');
    //     // //     this.alertItem = this.assetsSvc.getItem(this.assetType, this.index);
    //     //     this.dataService.getEntity(this.assetType, this.index).subscribe(
    //     //         data => this.onGetEntity(data),
    //     //         error => this.onGetEntityError(error)
    //     //     );
    //     // } else {
    //     //     this.alertItem = new AssetItem(this.assetType, this.defaultName, '', this.defaultImageUrl, '');
    //     // }
    //     // this.cdr.detectChanges();
    // }

    // onCancel() {
    //     this.router.navigate(['Assets', { assetType: this.assetType }]);
    // }

    // onGetEntity(jsonData: JSON) {
    //     const status = jsonData.hasOwnProperty("status") ? jsonData["status"] : '';
    //     if (status !== "SUCCESS") {
    //         this.onGetEntityError(jsonData);
    //     } else {
    //         var data = jsonData["data"];
    //         if (data != null) {
    //             if (data instanceof Array) {
    //                 if (data.length > 0) {
    //                     this.alertItem = AssetItem.parse(data[0]);
    //                 }
    //             } else {
    //                 this.alertItem = AssetItem.parse(data);
    //             }
    //         }
    //     }
    // }

    // onGetEntityError(jsonData: JSON) {
    //     console.log(jsonData);
    //     const status = jsonData.hasOwnProperty("status") ? jsonData["status"] : '';
    //     const message = jsonData.hasOwnProperty("message") ? jsonData["message"] : '';
    //     if (status != 'SUCCESS') {
    //         if (message != null) {
    //             let jsonMsgs = JSON.parse(message);
    //             if (jsonMsgs.msgs != null && jsonMsgs.msgs.length > 0) {
    //                 let msg = jsonMsgs.msgs[0];
    //                 let msgId = "" + msg.id;
    //                 while (msgId.length < 6) {
    //                     msgId = "0" + msgId;
    //                 }
    //                 let prefix = jsonMsgs.prefix + msgId + jsonMsgs.langId.charAt(0).toUpperCase();;
    //                 this.ms.displayRawMessage(new Message(status, msg.message, msg.action, msg.suggestion, prefix), this.customPlugs)
    //                     .subscribe((value) => console.log(value));
    //             }
    //         }
    //     }
    // }
}
