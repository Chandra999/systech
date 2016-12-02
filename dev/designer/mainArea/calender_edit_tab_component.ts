import { Component, ChangeDetectorRef } from '@angular/core';
import { AssetItem } from '../../common/assetItem';
import { AssetType } from '../../common/assetType';
import { AssetsServices } from '../../services/Assets.service_1';
import { Router, ActivatedRoute } from '@angular/router';
import { UI_Tabs } from '../../common/ui_tabs.component';
import { Tab } from '../../common/tab.component';
import { NameDescriptionComponent } from '../../common_ui/name_description_component';
import { MessageService } from '../../services/message.service';
import { MessageCenterComponent } from '../../message-center/message-center.component';
import { Message } from '../../message-center/message';

@Component({
    selector: 'calender-edit-tab',
    template: `
        <ul  id="breadcrumb" >
                <li><a (click)= "assetTypeSelected()">{{displayName}}</a> </li>
                <li><a>{{alertItem.name}}</a> </li>
        </ul>
<!--        <message-center></message-center>
        <form class= "assetForm uni-card-2" id="alert-edit-add" (ngSubmit)="onSubmit(f.value)" #f="ngForm">
           <uni-name-description [assetType]=altertType [imageUrl]=defaultImageUrl [assetItem]= alertItem [formCtrl]="f" [intro]=defaultIntro></uni-name-description>
           <div style="display :block;">
                <span><a class="uni-button" (click)="onCancel()"  style="float:right; margin:20px 200px 5px 5px">Cancel</a></span>
                <span><button type ="submit" class="uni-button" style="float:right; margin:20px 0px 5px 5px" [disabled]="!f.valid">Save</button></span>
                <div style="clear:both"></div>
           </div>
        </form>     -->
    `,
    // directives: [UI_Tabs, Tab, NameDescriptionComponent, MessageCenterComponent, FORM_DIRECTIVES],
    // providers: [MessageService],
    styleUrls: ['public/css/mainArea/breadcrumb.css', 'public/css/mainArea/edit_assets.css']

})



export class CalenderEditTabComponent {
    altertType: AssetType = AssetType.Calender;
    alertItem: AssetItem = null;
    alerts: string[]; dateTypes: string[];
    displayName: string;
    defaultImageUrl: string;
    index: number;
    private editMode = 'create';
    private defaultName = 'New Calender Profile';
    defaultIntro = 'Within UniSecure there are many time based events that can take place. A Calendar profile allows you to create a specific or relative date definition and associate that definition with a name. You can then reference the named calendar definition elsewhere in UniSecure. This allows for centralized management of date based events.';
    customPlugs: string[] = ['a'];


    constructor(private routeParams: ActivatedRoute, private assetsSvc: AssetsServices, private router: Router, private cdr: ChangeDetectorRef, private ms: MessageService) {

    }

    // onSubmit(item: AssetItem) {
    //     item.assetType = this.altertType;
    //     item.imageUrl = 'public/img/scene_transparent_green_bright_2.png';
    //     this.alertItem !== null ? this.assetsSvc.updateItem(this.altertType, this.index, item) : this.assetsSvc.insertItem(this.altertType, item);
    //     //this.router.navigate(['Assets', { assetType: item.assetType }]);
    //     this.ms.displayRawMessage(new Message('Success', 'Calender Item Saved', '', '', ''), this.customPlugs)
    //         .subscribe((value) => console.log(value));
    // }


    // assetTypeSelected() {
    //     this.router.navigate(['assets', this.assetType], { relativeTo: this.route });
    // }

    // ngOnInit() {
    //     this.displayName = AssetItem.getDisplayName(AssetType.Calender);
    //     this.dateTypes = this.assetsSvc.getDateTypes();
    //     this.defaultImageUrl = 'public/img/' + AssetItem.getDefaultImageUrl(AssetType.Calender);
    //     this.editMode = this.routeParams.get('editMode');
    //     if (this.editMode === 'edit') {
    //         this.index = +this.routeParams.get('itemIndex');
    //         this.alertItem = this.assetsSvc.getItem(this.altertType, this.index);

    //     } else {
    //         this.alertItem = new AssetItem(this.altertType, this.defaultName, '', this.defaultImageUrl, '');
    //     }
    //     this.cdr.detectChanges();
    // }


    // onCancel() {
    //     this.router.navigate(['assets', this.assetType], { relativeTo: this.route });
    // }
}
