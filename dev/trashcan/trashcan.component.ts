import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../services/Assets.service';
import { AssetItem } from '../common/assetItem';
import { AssetType } from '../common/assetType';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import * as moment from 'moment';
import { emptyTrashCan, TrashCanSort, ascending, listItemsNumber, assetItemColumns, emptyTrashCanTitle, deleteMultipleItemTitle, deleteMultipleItemMessage, deleteItemTitle, deleteItemMessage } from '../common/messages';
import { UsersService } from '../services/User.service';

@Component({
    selector: 'action-trashcan',
    template: `
        <div *ngIf="!loading">
            <ul id='breadcrumb' >
                <li><a><span class="glyphicon glyphicon-trash" style="margin-right: 4px;"></span>Trash</a></li>
            </ul>
            <div class="fixed-action-btn" style="top:27.5%; right:2%;" *ngIf="deletedItems.length > 0">
                <a class="btn-floating btn-large" title="Options">
                    <span class="glyphicon glyphicon-pencil" style="margin:10px 0 0 12px; font-size:18px;"></span>
                </a>
                <ul style="padding-left:0px; margin-top:-10px;">
                    <li>
                        <button class="btn-floating" (click)="onRestoreSelected(); disable=true;" [disabled]="disable" type="button" title="Restore">
                            <span class="glyphicon glyphicon-repeat"></span>
                        </button>
                    </li>
                    <li>
                        <button class="btn-floating" (click)="onPurgeSelected(); disable=true;" [disabled]="disable" type="button" title="Delete">
                            <span class="glyphicon glyphicon-trash"></span>
                        </button>
                    </li>       
                </ul>
            </div>
            <br>
            <div *ngIf="deletedItems.length > 0">
                <div style="padding:10px 20px 20px 20px;">
                    <div class="row" style="float:right; margin:0 6% 10px 0;">
                        <label>Sort By</label>
                        <select class="form-control" [(ngModel)]="sortBy" (ngModelChange)="changeSortParam()" style="display:inline; height:auto; width:auto; padding:2px 5px;">
                            <option *ngFor="let sort of listSort" value="{{sort.value}}">{{sort.sortType}}</option>
                        </select>
                        <span [class.attach]="sortType=='+'" (click)="sortType='+'; changeSortParam();" title="Ascending" class="glyphicon glyphicon-sort-by-attributes" style="cursor:pointer; top:3px;"></span>
                        <span [class.attach]="sortType=='-'" (click)="sortType='-'; changeSortParam();" title="Descending"  class="glyphicon glyphicon-sort-by-attributes-alt" style="cursor:pointer; transform:scaleY(-1); -moz-transform:scaleY(-1); -webkit-transform:scaleY(-1); -ms-transform:scaleY(-1);"></span>
                    </div>
                    <div class="table-responsive" style="overflow-x:visible">
                        <table class='uni-table'>
                            <tr>
                                <th>
                                    <label style="display: block;" [hidden]="select">Select All</label>
                                    <label style="display: block;" [hidden]="!select">UnSelect All</label>
                                    <input type="checkbox" [(ngModel)]="select" (ngModelChange)="onClick()" style="cursor:pointer;"/>
                                </th>
                                <th *ngFor="let column of columnNames">{{column}}</th>
                            </tr>                     
                            <tr *ngFor="let item of deletedItems | orderBy : [sortParam] | slice: (currentPage - 1) * itemsPerPage : itemsPerPage*currentPage">
                                <td style="text-align:center;width:9.5%;">
                                    <input type="checkbox" #trashCheckBox [(ngModel)]="item.active" (ngModelChange)="trackSelected()" id="{{item.pkid}}" style="cursor:pointer;"/>
                                </td>
                                <td style="width:12.5%;">{{item.name}}</td>
                                <td style="width:10%;">{{getType(item)}}</td>
                                <td>{{item.description}}</td>
                                <td style="width:10%;">{{item.updatorName}}</td>
                                <td style="width:13%;">{{item.updateDate | date:"short"}}</td>
                            </tr>
                        </table>
                    </div>
                    <modal #modal style="color:#0458A2;">
                        <modal-header [show-close]="false" style="height:30px !important">
                        </modal-header>
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
                        <button type="button" class='uni-button' (click)="cancelPurge(); disable=false;" style="float: right">Cancel</button>
                        <button type="button" class='uni-button' (click)="okPurge()" style="float: right;margin-right:5px">Delete</button>
                        </modal-footer>
                    </modal>
                </div>
                <div class="row" style="margin:0px;">
                    <ngb-pagination [collectionSize]=collectionSize (click)="checkSelect()" [(page)]=currentPage [maxSize]=pagesAtOnce [rotate]="true" [boundaryLinks]="true" [pageSize]=itemsPerPage style="float:left; margin-left:18px;" ></ngb-pagination>
                    <div style="float:right; margin:25px 6.5% 0 0;">
                        <label style="font-weight: 100;">Items Per Page</label>
                        <select class="form-control" [(ngModel)]="itemsPerPage" (ngModelChange)=onItemsParPageChange() style="display:inline; height:auto; width:auto; padding:2px 5px;">
                            <option *ngFor="let item of listItemsNumber" value="{{item}}">{{item}}</option>
                        </select>
                    </div>
                </div>      
            </div>  
            <div *ngIf="deletedItems.length == 0" style="margin-top:100px;">
                <hr style="margin:0 50px 10px 50px;">
                <label style="font-weight:700; font-size:18px; margin-left:45%; color:#8dc63f;">{{trashempty}}</label>
                <hr style="margin:10px 50px 0 50px;">
            </div>
        </div>
        <div *ngIf="loading" style="margin-top:150px; margin-left:45%;">
            <span class="glyphicon glyphicon-refresh glyphicon-refresh-animate" style="color:#8dc63f;"></span>
            <label style="font-weight:700; font-size:18px; color:#8dc63f;">Loading...</label>
        </div>
        
    `,
    styleUrls: ['public/css/mainArea/breadcrumb.css', 'public/css/common/table.css', 'public/css/common/anchorButton.css', 'public/css/common/modal.css']
})

export class TrashCanComponent implements OnInit {
    private category = 'action';
    deletedItems: Array<any> = [];
    trashempty: string = emptyTrashCan;
    select: boolean = false;
    disable: boolean = true;
    columnNames: string[] = assetItemColumns;
    confirmTitle: string = '';
    message: string = '';
    @ViewChild('modal')
    modal: ModalComponent;
    purgeBody: Array<any> = [];
    listSort = TrashCanSort;
    sortBy: string = TrashCanSort[2].value;
    sortType: string = ascending;
    sortParam: string;
    loading: boolean = true;
    //----------------------------------------------------Pagination-------------------------------------
    collectionSize: number;
    currentPage: number = 1;
    itemsPerPage: number = 10;
    pagesAtOnce: number = 5;
    listItemsNumber = listItemsNumber;
    //----------------------------------------------------Pagination-------------------------------------
    @ViewChildren('trashCheckBox') trashCheckBoxs;

    constructor(private router: Router, private operatorSvc: DataService, private userSvc: UsersService) {
        this.operatorSvc.navItem$.subscribe(value => this.load());
    }

    ngOnInit() {
        this.changeSortParam();
    }

    load() {
        this.operatorSvc.getItemsFromTrash().subscribe(
            data => this.onGetEntities(data),
            error => this.onGetError(error)
        );
    }

    onItemsParPageChange() {
        // this.select = false;
        // this.onClick();
        this.collectionSize = this.deletedItems.length;
        if ((this.itemsPerPage * this.currentPage) > this.collectionSize) {
            this.currentPage = 1;
        }
    }

    checkSelect() {
        setTimeout(() => {
            if (this.trashCheckBoxs != null) {
                let allSelect = true;
                for (var i = 0; i < this.trashCheckBoxs._results.length; i++) {
                    console.log(this.trashCheckBoxs._results[i].nativeElement.checked);
                    if (this.trashCheckBoxs._results[i].nativeElement.checked == false) {
                        allSelect = false;
                        break;
                    }
                }
                this.select = allSelect;
            }
        }, 10);
    }

    changeSortParam() {
        this.sortParam = this.sortType + this.sortBy;
    }

    onGetEntities(jsonData: JSON) {
        const status = jsonData.hasOwnProperty("status") ? jsonData["status"] : '';
        if (status !== "SUCCESS") {
            this.onGetError(jsonData);
        } else {
            this.deletedItems = [];
            var entities = jsonData["data"];
            if (entities != null && entities.length > 0) {
                for (var index = 0; index < entities.length; index++) {
                    let entry: AssetItem = AssetItem.parse(entities[index]);
                    if (entry != null) {
                        this.deletedItems.push(entry);
                    }
                }
                this.onItemsParPageChange();
            }
            this.loading = false;
        }
    }

    // Check and UnCheck all items that are present in trashcan
    onClick() {
        if (this.trashCheckBoxs != null) {
            for (var index = 0; index < this.trashCheckBoxs._results.length; index++) {
                var id = this.trashCheckBoxs._results[index].nativeElement.id;
                for (var i = 0; i < this.deletedItems.length; i++) {
                    if (this.deletedItems[i].pkid == id) {
                        this.deletedItems[i].active = this.select;
                        break;
                    }
                }
            }
        }
        this.disable = !this.select;
    }

    trackSelected() {
        if (this.trashCheckBoxs != null) {
            let noSelection = true;
            for (var i = 0; i < this.trashCheckBoxs._results.length; i++) {
                if (this.trashCheckBoxs._results[i].nativeElement.checked == true) {
                    this.select = false;
                    noSelection = false;
                    break;
                }
            }
            this.disable = noSelection;
        }
    }

    // Restors selected/all items in trashcan
    onRestoreSelected() {
        var body = [];
        for (var i = 0; i < this.trashCheckBoxs._results.length; i++) {
            if (this.deletedItems[i].active == true) {
                body.push({ id: this.deletedItems[i].pkid, name: this.deletedItems[i].name });
            }
        }
        this.operatorSvc.restoreItem(body).subscribe(
            data => this.onCall(data),
            error => console.log("Failed " + error)
        );
        this.select = false;
    }

    // Permanently deletes selected/all items in trashcan
    onPurgeSelected() {
        this.purgeBody = [];
        var deleteItemName = '';
        for (var i = 0; i < this.trashCheckBoxs._results.length; i++) {
            if (this.deletedItems[i].active == true) {
                deleteItemName = this.deletedItems[i].name;
                this.purgeBody.push({ id: this.deletedItems[i].pkid, name: deleteItemName });
            }
        }
        if (this.purgeBody == null || this.purgeBody.length == 0) {
            return;
        }
        if (this.purgeBody.length == 1) {
            this.confirmTitle = deleteItemTitle;
            this.confirmTitle = this.confirmTitle.replace("{1}", deleteItemName);
            this.message = deleteItemMessage;
        }
        else if (this.purgeBody.length == this.deletedItems.length) {
            this.confirmTitle = emptyTrashCanTitle;
            this.message = deleteMultipleItemMessage;
        } else {
            this.confirmTitle = deleteMultipleItemTitle;
            this.message = deleteMultipleItemMessage;
        }
        this.modal.open();
    }

    okPurge() {
        this.operatorSvc.purge(this.purgeBody).subscribe(
            data => this.onCall(data),
            error => console.log("Failed " + error)
        );
        this.modal.close();
        this.select = false;
    }

    cancelPurge() {
        this.purgeBody = [];
        this.modal.close();
    }

    onCall(jsonData: JSON) {
        const status = jsonData.hasOwnProperty("status") ? jsonData["status"] : '';
        if (status !== "SUCCESS") {
            this.onGetError(jsonData);
        }
        else {
            this.operatorSvc.emitItemChanged(true);
        }
    }

    onGetError(jsonData: JSON) {
        console.log(jsonData);
    }

    getType(item: AssetItem) {
        if (item != null) {
            return AssetItem.getDisplayName(item.assetType);
        }
        return null;
    }
}