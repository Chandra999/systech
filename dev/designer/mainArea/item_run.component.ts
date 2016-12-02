import { Component, ChangeDetectorRef } from '@angular/core';
import { AssetItem } from '../../common/assetItem';
import { AssetType } from '../../common/assetType';
import { AssetsServices } from '../../services/Assets.service_1';
import { Router, ActivatedRoute } from '@angular/router';
import { UI_Tabs } from '../../common/ui_tabs.component';
import { Tab } from '../../common/tab.component';
import { NameDescriptionComponent } from '../../common_ui/name_description_component';
import { itemRunDescription } from '../../common/messages';
import { MessageService } from '../../services/message.service';
import { MessageCenterComponent } from '../../message-center/message-center.component';
import { Message } from '../../message-center/message';

@Component({
    selector: 'unisecure-item-run',
    template: `
        <ul  id="breadcrumb" >
                <li><a (click)= "assetTypeSelected()">{{displayName}}</a> </li>
                <li><a>{{alertItem.name}}</a> </li>
        </ul>
        <message-center></message-center>
        <form class= "assetForm uni-card-2" id="alert-edit-add" (ngSubmit)="onSubmit(f.value)" #f="ngForm">
        <uni-name-description [assetType]=assetType [imageUrl]=defaultImageUrl [assetItem]= alertItem [formCtrl]="f" [intro]=defaultIntro></uni-name-description>
        <div>
                <span><a class="uni-button" (click)="onCancel()"  style="float:right; margin:20px 200px 5px 5px">Cancel</a></span>
                <span><button type ="submit" class="uni-button" style="float:right; margin:20px 0px 5px 5px" [disabled]="!f.valid">Save</button></span>
                <div style="clear:both"></div>
           </div>
        </form>
    `,
    styleUrls: ['public/css/mainArea/breadcrumb.css', 'public/css/mainArea/edit_assets.css']

})



export class ItemRunEditComponent {
    assetType: AssetType = AssetType.ItemRun;
    alertItem: AssetItem = null;
    alerts: string[]; dateTypes: string[];
    displayName: string;
    defaultImageUrl: string;
    index: number;
    private editMode = 'create';
    private defaultName = 'New Item Run';
    defaultIntro = itemRunDescription;
    customPlugs: string[] = ['a'];

    constructor(private route: ActivatedRoute, private ms: MessageService, private assetsSvc: AssetsServices, private router: Router, private cdr: ChangeDetectorRef) {
    }

    // onSubmit(item: AssetItem) {
    //     item.assetType = this.assetType;
    //     item.imageUrl = 'public/img/';
    //     this.alertItem !== null ? this.assetsSvc.updateItem(this.assetType, this.index, item) : this.assetsSvc.insertItem(this.assetType, item);
    //     // this.router.navigate(['Assets', { assetType: item.assetType }]);
    //     this.ms.displayRawMessage(new Message('Success', 'Item Run Saved', '', '', ''), this.customPlugs)
    //         .subscribe((value) => console.log(value));
    // }


    // assetTypeSelected() {
    //     this.router.navigate(['Assets', { assetType: this.assetType }]);
    // }

    // ngOnInit() {
    //     this.displayName = AssetItem.getDisplayName(this.assetType);
    //     this.dateTypes = this.assetsSvc.getDateTypes();
    //     this.defaultImageUrl = 'public/img/' + AssetItem.getDefaultImageUrl(this.assetType);
    //     this.editMode = this.routeParams.get('editMode');
    //     if (this.editMode === 'edit') {
    //         this.index = +this.routeParams.get('itemIndex');
    //         this.alertItem = this.assetsSvc.getItem(this.assetType, this.index);

    //     } else {
    //         this.alertItem = new AssetItem(this.assetType, this.defaultName, '', this.defaultImageUrl, '');
    //     }
    //     this.cdr.detectChanges();
    // }

    // onCancel() {
    //     this.router.navigate(['Assets', { assetType: this.assetType }]);
    // }
}
