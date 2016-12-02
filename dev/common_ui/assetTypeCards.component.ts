import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AssetItem } from '../common/assetItem';
import { AssetType } from '../common/assetType';
import { EnumUtil } from '../common/EnumUtil';
import { AssetCardComponent } from './assetCard.component';
import { AssetListComponent } from './assetList.component';
import { DataService } from '../services/Assets.service';
import { AssetListItem } from '../common/assetListItem';
import { UsersService } from '../services/User.service';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { cardSort, listSort, ascending, cardItemsNumber } from '../common/messages';
import { Subscription } from "rxjs/Rx";
import { MessageService } from '../services/message.service';
import { Message } from '../message-center/message';

@Component({
    selector: 'assetTypeCards',
    template: `
        <ul *ngIf= "typename != ''" id="breadcrumb" >
            <li><a>{{displayName}}</a></li>
        </ul>
        <message-center></message-center>
        <div>
            <div class="row" style="clear:both; padding-left:50px; padding-bottom:15px; width:97.5%;">
                <a class="btn btn-md" role="button" id="newScene" (click)=clickAdd()> <i class="glyphicon glyphicon-plus" style="color:#3b73b9"></i>Add {{addName}}</a>
                <div id="noAssetItemsFound" *ngIf="assetItems.length == 0 && loading==false" style="margin-top:100px;">
                    <hr style="margin:0 50px 10px 50px;">
                    <label style="font-weight:700; font-size:18px; margin-left:45%; color:#8dc63f;">No Item in the record.</label>
                    <hr style="margin:10px 50px 0 50px;">
                </div>
                <div class="row" *ngIf="assetItems.length != 0" style="float:right; margin:10px; cursor:pointer;">
                    <span [class.attach]="displayType=='card'" title="Grid View" class="glyphicon glyphicon-th-large" (click)="changeDisplay('card')" style="margin-right:10px; top:4px;"></span>
                    <span [class.attach]="displayType=='list'" title="List View" class="glyphicon glyphicon-list" (click)="changeDisplay('list')" style="top:4px;"></span>
                </div>
                <div class="row" *ngIf="assetItems.length != 0" style="float:right; margin:10px;">
                    <label>Sort By</label>
                    <select *ngIf="displayType=='card'" class="form-control" [(ngModel)]="cardSortBy" name="cardSortBy" (ngModelChange)=changeSortParam() style="display:inline; height:auto; width:auto; padding:2px 5px;">
                        <option *ngFor="let sort of cardSort" value="{{sort.value}}">{{sort.sortType}}</option>
                    </select>
                    <select *ngIf="displayType=='list'" class="form-control" [(ngModel)]="listSortBy" name="listSortBy" (ngModelChange)=changeSortParam() style="display:inline; height:auto; width:auto; padding:2px 5px;">
                        <option *ngFor="let sort of listSort" value="{{sort.value}}">{{sort.sortType}}</option>
                    </select>
                    <span [class.attach]="sortType=='+'" (click)="sortType='+'; changeSortParam();" class="glyphicon glyphicon-sort-by-attributes" title="Ascending" style="cursor:pointer; top:3px;"></span>
                    <span [class.attach]="sortType=='-'" (click)="sortType='-'; changeSortParam();" class="glyphicon glyphicon-sort-by-attributes-alt" title="Descending" style="cursor:pointer; transform:scaleY(-1); -moz-transform:scaleY(-1); -webkit-transform:scaleY(-1); -ms-transform:scaleY(-1);"></span>
                </div>
            </div>
            <div [hidden]="!showLoadding()" style="margin-left:130px;">
                <a style="font-size:x-large;">
                    <span class="glyphicon glyphicon-refresh glyphicon-refresh-animate" style="color:#8dc63f;"></span>
                    Loading...
                </a>
            </div>
            <div [hidden]="!visible" class="row" style="margin-left:50px ; margin-right:30px">
                <div *ngIf="displayType=='card'">
                <assetCard *ngFor="let item of assetItems | orderBy : [sortParam] | slice: (currentPage - 1) * itemsPerPage : itemsPerPage*currentPage" [assetItem]=item [menuFlag]=true [buttonsFlag]=false (duplicate)="onDuplicate($event)" (delete)="onDelete($event)"></assetCard>   
                    <div class="row" *ngIf="assetItems.length != 0" style="display: inline-block; width: 100%;">
                        <ngb-pagination [collectionSize]=collectionSize [(page)]=currentPage [maxSize]=pagesAtOnce [rotate]="true" [boundaryLinks]="true" [pageSize]=itemsPerPage style="float:left; margin-left:25px;" ></ngb-pagination>
                        <div style="float:right; margin:25px 30px 0 0;">
                            <label style="font-weight: 100;">Items Per Page</label>
                            <select class="form-control" [(ngModel)]="itemsPerPage" (ngModelChange)=onItemsParPageChange() style="display:inline; height:auto; width:auto; padding:2px 5px;">
                                <option *ngFor="let item of cardItemsNumber" value="{{item}}">{{item}}</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div *ngIf="displayType=='list' && assetItems.length != 0">
                    <assetList [listItems]=listItems [sortParam]=sortParam ></assetList>
                </div>
            </div>
            <modal #confirmModal style="color:#0458A2;">
                <modal-header [show-close]="false" style="height:30px !important"></modal-header>
                <modal-body>
                    <div class='container2'>
                        <div>
                            <img src='public/img/alert_transparent_green_bright_2.png' class='iconDetails'>
                        </div>
                        <div style='margin-left:80px;word-wrap: break-word;'>
                            <div class="message">{{confirmTitle}}</div>
                            <div class="message">{{message}}</div>
                        </div>
                    </div>
                </modal-body>
                <modal-footer>
                    <button type="button" class='uni-button' (click)="onDeleteCancle()" style="float: right">Cancel</button>
                    <button type="button" class='uni-button' (click)="onDeleteConfirm()" style="float: right;margin-right:5px">Remove</button>
                </modal-footer>
            </modal>
            <modal #informationModal style="color:#0458A2;">
                <modal-header [show-close]="false" style="height:30px !important"></modal-header>
                <modal-body>
                    <div class='container2'>
                        <div>
                            <img src='public/img/alert_transparent_green_bright_2.png' class='iconDetails'>
                        </div>
                        <div style='margin-left:80px;word-wrap: break-word;'>
                            <div class="message">{{confirmTitle}}</div>
                            <div class="message">{{message}}</div>
                        </div>
                    </div>
                </modal-body>
                <modal-footer>
                    <button type="button" class='uni-button' (click)="onInformactionClose()" style="float: right;margin-right:5px">Ok</button>
                </modal-footer>
            </modal>
        </div>
    `,
    styleUrls: ['public/css/mainArea/breadcrumb.css', 'public/css/common/table.css', 'public/css/common/modal.css']
})

export class AssetTypeCardsComponent implements OnInit {
    typename: string;
    assetItems = [];
    listItems: AssetListItem[] = [];
    displayName: string;
    addName: string;
    assetType: AssetType;
    loading: boolean;
    visible: boolean = true;
    displayType: string;
    confirmTitle: string = '';
    message: string = '';
    @ViewChild('confirmModal')
    confirmModal: ModalComponent;
    @ViewChild('informationModal')
    informationModal: ModalComponent;
    deleteId: number;
    deleteName: string;
    cardSort: any[] = cardSort;
    cardSortBy: string = cardSort[2].value;
    listSort: any[] = listSort;
    listSortBy: string = listSort[2].value;
    sortType: string = ascending;
    sortParam: string;
    subscription: Subscription;
    customPlugs: string[] = ['a'];
    task: string;

    //----------------------------------------------------Pagination-------------------------------------
    collectionSize: number;
    currentPage: number = 1;
    itemsPerPage: number = 8;
    totalPages: number;
    cardItemsNumber = cardItemsNumber;
    pageChange(page: number): void {
        this.currentPage = page;
    }
    //----------------------------------------------------Pagination-------------------------------------


    constructor(private route: ActivatedRoute, private assetsSvc: DataService, private router: Router, private ms: MessageService, private userSvc: UsersService) {
        this.loading = false;
        this.assetsSvc.navItem$.subscribe(value => this.onCardsChanged(value));
    }

    showLoadding() {
        return this.visible && this.loading;
    }

    ngOnInit() {
        if (this.userSvc.currentUser != null) {
            this.itemsPerPage = this.userSvc.currentUser.displayPreference.numOfCards;
        } else {
            this.itemsPerPage = (JSON.parse(sessionStorage.getItem('preferences')))[3].value;
        }
        this.subscription = this.route.params.subscribe(
            (params: any) => {
                this.typename = params['assetType'];
                this.assetType = EnumUtil.getEnumForString(AssetType, this.typename);
                this.addName = this.typename;
                if (this.typename == null) {
                    this.typename = '';
                    this.displayName = '';
                } else {
                    this.loadCards();
                }
                if (this.userSvc.currentUser != null) {
                    this.displayType = this.userSvc.currentUser.displayPreference.actionsLayout;
                    if (this.displayType === null || this.displayType == 'Card View') {
                        this.displayType = 'card';
                    }
                    else {
                        this.displayType = 'list';
                    }
                } else {
                    this.displayType = 'card';
                }
                this.changeSortParam();
            }
        );

    }

    loadCards() {
        if (this.typename != null && this.typename != '') {
            this.assetType = EnumUtil.getEnumForString(AssetType, this.typename);
        }
        if (this.assetType != null) {
            this.displayName = AssetItem.getDisplayName(this.assetType);
            this.loading = true;
            this.assetsSvc.getEntities(this.assetType).subscribe(
                data => this.onGetEntities(data),
                error => this.onGetEntitiesError(error)
            );
        }
    }

    onItemsParPageChange() {
        this.collectionSize = this.assetItems.length
        this.totalPages = Math.ceil(this.collectionSize / this.itemsPerPage);
        if ((this.itemsPerPage * this.currentPage) > this.collectionSize) {
            this.currentPage = 1;
        }
    }

    changeSortParam() {
        if (this.displayType == 'card') {
            this.sortParam = this.sortType + this.cardSortBy;
        } else if (this.displayType == 'list') {
            this.sortParam = this.sortType + this.listSortBy;
        }
    }

    clickAdd() {
        console.log(this.typename)
        if (AssetItem.isOperatorType(this.assetType)) {
            this.router.navigate(['../../newAction'], { relativeTo: this.route });
        } else {
            let routName = '../../new' + this.typename;
            this.router.navigate([routName], { relativeTo: this.route });
        }
    }

    onGetEntities(jsonData: JSON) {
        const status = jsonData.hasOwnProperty("status") ? jsonData["status"] : '';
        if (status !== "SUCCESS") {
            this.onGetEntitiesError(jsonData);
        } else {
            if (this.assetItems.length > 0) {
                this.assetItems.splice(0, this.assetItems.length);
            }
            if (this.listItems.length > 0) {
                this.listItems.splice(0, this.listItems.length);
            }
            var entities = jsonData["data"];
            this.assetItems = [];
            if (entities != null && entities.length > 0) {
                for (var index = 0; index < entities.length; index++) {
                    let entry: AssetItem = AssetItem.parse(entities[index]);
                    if (entry != null) {
                        this.assetItems.push(entry);
                        this.listItems.push(new AssetListItem(entry));
                    }
                }
                this.onItemsParPageChange();
            }
            this.loading = false;
        }
    }

    onGetEntitiesError(jsonData: JSON) {
        console.log(jsonData);
    }

    onCardsChanged(changed) {
        if (changed) {
            this.loadCards();
        }
    }

    changeDisplay(display) {
        this.displayType = display;
        //   this.updateDisplayPreference();
        this.changeSortParam();
    }

    updateDisplayPreference() {
        if (this.userSvc.currentUser != null) {
            this.userSvc.currentUser.setPreference("AssetsDisplayType", this.displayType);
        }
    }

    onDuplicate(value) {
        if (value != null) {
            this.task = "duplicate";
            let id = value.id;
            let name = value.name;
            this.assetsSvc.copyItem(id).subscribe(
                data => this.handleError(data, name),
                error => this.handleError(error, name)
            );
        }

    }

    onDelete(value) {
        if (value != null) {
            this.task = "delete";
            this.deleteId = value.id;
            this.deleteName = value.name;
            this.openDeleteConfirm();
        }
    }


    handleError(jsonData: JSON, name: string) {
        const status = jsonData.hasOwnProperty("status") ? jsonData["status"] : '';
        const message = jsonData.hasOwnProperty("message") ? jsonData["message"] : '';
        if (status !== "SUCCESS") {
            this.ms.displayRawMessage(new Message(status, JSON.parse(message).msgs[0].message, JSON.parse(message).msgs[0].action, JSON.parse(message).msgs[0].suggestion, JSON.parse(message).prefix), this.customPlugs)
                .subscribe((value) => console.log(value));
        } else {
            if (message != null) {
                this.ms.displayRawMessage(new Message(status, message, '', '', ''), this.customPlugs)
                    .subscribe((value) => console.log(value));
            } else {
                if (this.task == "duplicate") {
                    this.ms.displayRawMessage(new Message(status, "A copy of \'" + name + "\' is created successfully.", '', '', ''), this.customPlugs)
                        .subscribe((value) => console.log(value));
                }
                else if (this.task == "delete") {
                    this.ms.displayRawMessage(new Message(status, "" + name + " is deleted successfully.", '', '', ''), this.customPlugs)
                        .subscribe((value) => console.log(value));
                }
            }
        }
        this.assetsSvc.emitItemChanged(true);
    }

    onInformactionClose() {
        this.informationModal.close();
    }

    openDeleteConfirm() {
        this.confirmTitle = "Are you sure you want to move \'" + this.deleteName + "\' to trashcan?";
        this.message = '';
        this.confirmModal.open();
    }

    onDeleteConfirm() {
        this.confirmModal.close();
        this.assetsSvc.removeItem(this.deleteId).subscribe(
            data => this.handleError(data, this.deleteName),
            error => this.handleError(error, this.deleteName)
        );
    }

    onDeleteCancle() {
        this.confirmModal.close();
    }

}
