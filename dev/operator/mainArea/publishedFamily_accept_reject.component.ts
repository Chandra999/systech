import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AssetItem } from '../../common/assetItem';
import { AssetType } from '../../common/assetType';
import { EnumUtil } from '../../common/EnumUtil';
import { AssetCardComponent } from '../../common_ui/assetCard.component';
import { DataService } from '../../services/Assets.service';
import { Subscription } from "rxjs/Rx";
import { MessageService } from '../../services/message.service';
import { Message } from '../../message-center/message';

@Component({
    selector: 'published-family',
    template: `
        <ul id="breadcrumb" >
            <li><a>{{displayName}}</a></li>
        </ul>
        <message-center></message-center>
        <br>
        <form id="newActivity" class="assetForm uni-card-2"  (ngSubmit)='onSave()' #f='ngForm'>
            <div class="panel panel-default">
                <div class="panel-heading">
                    <a data-toggle="collapse" class="topItemIconLink" (click)="isExpandedR= !isExpandedR" href="#newPublishedFamily" style="color:white; text-decoration:none;">
                        <i [ngClass]="{'glyphicon' : true, 'glyphicon-triangle-right' : true,
                        'pull-left':true, 'triangle-glyphicon':true, 'rotate':true, 'down':!isExpandedR }" style="margin: 2px 5px 0 0;"></i>
                        <h4 class="panel-title">New Published Family</h4>
                    </a>
                </div>
                <div id="newPublishedFamily" class="panel-collapse collapse in" style="padding:15px;">
                    <div *ngIf="pendingLoading" style="margin-left:130px;">
                        <a style="font-size:x-large;">
                            <span class="glyphicon glyphicon-refresh glyphicon-refresh-animate" style="color:#8dc63f;"></span>
                            Loading...
                        </a>
                    </div>
                    <div class="row" *ngIf="!pendingLoading">
                         <assetCard *ngFor="let pendingItem of pendingAssetItem" [assetItem]=pendingItem [menuFlag]=false [buttonsFlag]=true (reject)="onReject($event)" (approve)="onApprove($event)"></assetCard>
                         <div class="panel-body" *ngIf="pendingAssetItem==null">
                            <hr style="margin:0 50px 10px 50px;">
                            <label style="font-weight:700; font-size:18px; margin-left:30%; color:#8dc63f;">No New Published Family</label>
                            <hr style="margin:10px 50px 0 50px;">
                        </div>
                    </div>
                </div>
            </div>

            <div class="panel panel-default">
                <div class="panel-heading">
                    <a data-toggle="collapse" class="topItemIconLink" (click)="isExpandedP= !isExpandedP" href="#approvedFamily" style="color:white; text-decoration:none;">
                        <i [ngClass]="{'glyphicon' : true, 'glyphicon-triangle-right' : true,
                        'pull-left':true, 'triangle-glyphicon':true, 'rotate':true, 'down':!isExpandedP }" style="margin: 2px 5px 0 0;"></i>
                        <h4 class="panel-title">Approved Family</h4>
                    </a>
                </div>
                <div id="approvedFamily" class="panel-collapse collapse in"  style="padding:15px;">
                    <div *ngIf="approvedLoading" style="margin-left:130px;">
                        <a style="font-size:x-large;">
                            <span class="glyphicon glyphicon-refresh glyphicon-refresh-animate" style="color:#8dc63f;"></span>
                            Loading...
                        </a>
                    </div>
                     <div class="row" *ngIf="!approvedLoading">
                        <assetCard *ngFor="let item of approvedAssetItem" [assetItem]=item [menuFlag]=false [buttonsFlag]=false></assetCard>
                        <div class="panel-body" *ngIf="approvedAssetItem == null">
                            <hr style="margin:0 50px 10px 50px;">
                            <label style="font-weight:700; font-size:18px; margin-left:30%; color:#8dc63f;">No Aproved Family</label>
                            <hr style="margin:10px 50px 0 50px;">
                        </div>
                    </div>
                </div>
            </div>
        </form>
    `,
    styleUrls: ['public/css/mainArea/breadcrumb.css', 'public/css/mainArea/view.css', 'public/css/navigator/sence_assets.css']
})

export class PublishedFamilyComponent implements OnInit {
    newPublishedItems = [];
    approvedItems = [];
    displayName: string;
    assetType = AssetType.PublishedFamily;
    pendingAssetItem: Array<Object> = null;
    approvedAssetItem: Array<Object> = null;
    pendingLoading: boolean;
    approvedLoading: boolean;
    visible: boolean = true;
    displayType: string;
    private subscription: Subscription;
    actionTrigered: string = null;
    customPlugs: string[] = ['a'];

    constructor(private publishedFamilySvc: DataService, private ms: MessageService) {
    }

    ngOnInit() {
        if (this.assetType != null) {
            this.displayName = AssetItem.getDisplayName(this.assetType);
            this.loadPendingPublishedFamilies();
            this.loadApprovedPublishedFamilies();
        }
    }

    loadPendingPublishedFamilies() {
        this.pendingLoading = true;
        this.publishedFamilySvc.getPendingPublishedFamilies().subscribe(
            data => this.onGetPendingPublishedFamilies(data),
            error => this.onGetEntitiesError(error)
        );
    }

    loadApprovedPublishedFamilies() {
        this.approvedLoading = true;
        this.publishedFamilySvc.getApprovedPublishedFamilies().subscribe(
            data => this.onGetApprovedPublishedFamilies(data),
            error => this.onGetEntitiesError(error)
        );
    }

    onReject(event) {
        this.actionTrigered = "Reject";
        this.publishedFamilySvc.onUpdatePublishedFamilies(event.id, event.state).subscribe(
            data => this.onGetEventConfirm(data),
            error => this.onGetEntitiesError(error)
        );
    }

    onApprove(event) {
        this.actionTrigered = "Approve";
        this.publishedFamilySvc.onUpdatePublishedFamilies(event.id, event.state).subscribe(
            data => this.onGetEventConfirm(data),
            error => this.onGetEntitiesError(error)
        );
    }

    onGetPendingPublishedFamilies(jsonData: JSON) {
        const status = jsonData.hasOwnProperty("status") ? jsonData["status"] : '';
        if (status !== "SUCCESS") {
            this.onGetEntitiesError(jsonData);
        } else {
            var entities = jsonData["data"];
            this.pendingAssetItem = null;
            if (entities != null && entities.length > 0) {
                this.pendingAssetItem = [];
                for (var index = 0; index < entities.length; index++) {
                    let entry: AssetItem = AssetItem.parse(entities[index]);
                    if (entry != null) {
                        this.pendingAssetItem.push(entry);
                    }
                }
            }
            this.pendingLoading = false;
        }
    }

    onGetApprovedPublishedFamilies(jsonData: JSON) {
        const status = jsonData.hasOwnProperty("status") ? jsonData["status"] : '';
        if (status !== "SUCCESS") {
            this.onGetEntitiesError(jsonData);
        } else {
            var entities = jsonData["data"];
            this.approvedAssetItem = null;
            if (entities != null && entities.length > 0) {
                this.approvedAssetItem = [];
                for (var index = 0; index < entities.length; index++) {
                    let entry: AssetItem = AssetItem.parse(entities[index]);
                    if (entry != null) {
                        this.approvedAssetItem.push(entry);
                    }
                }
            }
            this.approvedLoading = false;
        }
    }

    onGetEventConfirm(jsonData: JSON) {
        const status = jsonData.hasOwnProperty("status") ? jsonData["status"] : '';
        if (status !== "SUCCESS") {
            this.onGetEntitiesError(jsonData);
            if (this.actionTrigered === 'Approve') {
                var displayMsg = "Failed to Approvrd Fsmily.";
            } else {
                var displayMsg = "Failed to Rejected Family.";
            }
        } else {
            if (this.actionTrigered === 'Approve') {
                var displayMsg = "Family got Approvrd Successfully.";
            } else {
                var displayMsg = "Family got Rejected Successfully.";
            }
        }
        this.ms.displayRawMessage(new Message(status, displayMsg, '', '', ''), this.customPlugs)
            .subscribe((value) => console.log(value));
        this.loadPendingPublishedFamilies();
        this.loadApprovedPublishedFamilies();
    }

    onGetEntitiesError(jsonData: JSON) {
        console.log(jsonData);
    }
}