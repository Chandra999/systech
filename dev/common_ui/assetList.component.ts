import { Component, Input, EventEmitter, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { AssetItem } from '../common/assetItem';
import { DataService } from '../services/Assets.service';
import { Router, ActivatedRoute } from '@angular/router';
import { EnumUtil } from '../common/EnumUtil';
import { AssetType } from '../common/assetType';
import { AssetTypeCardsComponent } from './assetTypeCards.component';
import { AssetListItem } from '../common/assetListItem';
import { assetListItemColumns, listItemsNumber } from '../common/messages';
// import {OrderByPipe, PAGINATION_PROVIDERS} from 'fuel-ui/fuel-ui';
import { MessageService } from '../services/message.service';
import { MessageCenterComponent } from '../message-center/message-center.component';
import { Message } from '../message-center/message';
import { OperatorAssetItem } from '../common/operator_assetItem';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { OrderByPipe } from './orderBy_pipe';


@Component({
    selector: 'assetList',
    templateUrl: 'public/html/mainArea/assetList.template.html',
    // inputs: ['listItems', 'sortParam'],
    styleUrls: ['public/css/common/table.css', 'public/css/common/anchorButton.css', 'public/css/common/modal.css']
})

export class AssetListComponent implements OnInit {
    assetType: AssetType;
    assetTypeCard: AssetTypeCardsComponent;
    allSelect: boolean = false;
    counter: number = 0;
    itemValue: number;
    loading: boolean;
    // listItems = [];
    @Input("sortParam") sortParam: string;
    @Input("listItems") listItems = [];
    @ViewChild('modal')
    modal: ModalComponent;
    @ViewChild('confirmModal')
    confirmModal: ModalComponent;
    columnNames: string[] = assetListItemColumns;
    operatorAssetItem: OperatorAssetItem = null;
    isAction: boolean = false;
    customPlugs: string[] = ['a'];
    confirmTitle: string = '';
    removeItems = [];

    //----------------------------------------------------Pagination-------------------------------------
    collectionSize: number;
    currentPage: number = 1;
    itemsPerPage: number = 10;
    totalPages: number;
    pagesAtOnce: number = 5;
    listItemsNumber = listItemsNumber;
    //----------------------------------------------------Pagination-------------------------------------
    @ViewChildren('CheckBox') checkBoxs;

    constructor(private assetsSvc: DataService, private router: Router, private route: ActivatedRoute, private ms: MessageService) {
        this.onItemsParPageChange();
    }

    ngOnInit() {
        this.onItemsParPageChange();
        let assetItem: AssetItem = this.listItems[0].assetItem;
        if (AssetItem.isOperatorType(assetItem.assetType)) {
            this.isAction = true;
        }
    }

    checkSelect() {
        setTimeout(() => {
            if (this.checkBoxs != null) {
                let select = true;
                for (var i = 0; i < this.checkBoxs._results.length; i++) {
                    if (this.checkBoxs._results[i].nativeElement.checked == false) {
                        select = false;
                        break;
                    }
                }
                this.allSelect = select;
            }
        }, 10);
    }

    onItemsParPageChange() {
        this.collectionSize = this.listItems.length;
        this.totalPages = Math.ceil(this.collectionSize / this.itemsPerPage);
        if ((this.itemsPerPage * this.currentPage) > this.collectionSize) {
            this.currentPage = 1;
        }
    }

    onClick() {
        if (this.checkBoxs != null) {
            for (var index = 0; index < this.checkBoxs._results.length; index++) {
                var id = this.checkBoxs._results[index].nativeElement.id;
                for (var i = 0; i < this.listItems.length; i++) {
                    if (this.listItems[i].assetItem.pkid == id) {
                        this.listItems[i].chkBox = this.allSelect;
                        break;
                    }
                }
            }
        }
        this.counter = this.allSelect ? this.checkBoxs._results.length : 0;
    }

    trackSelected() {
        this.counter = 0;
        if (this.checkBoxs != null) {
            for (var i = 0; i < this.checkBoxs._results.length; i++) {
                if (this.checkBoxs._results[i].nativeElement.checked == true) {
                    this.counter++;
                }
            }
            this.allSelect = (this.counter == 10) ? true : false;
        }
    }

    onEdit() {
        for (var i = 0; i < this.listItems.length; i++) {
            if (this.listItems[i].chkBox == true) {
                let assetItem: AssetItem = this.listItems[i].assetItem;
                if (assetItem != null) {
                    console.log(assetItem);
                    if (AssetItem.isOperatorType(assetItem.assetType)) {
                        this.router.navigate(['../../editAction', assetItem.pkid], { relativeTo: this.route });
                    } else {
                        let routStr = '../../edit' + assetItem.assetType;
                        this.router.navigate([routStr, assetItem.pkid], { relativeTo: this.route });
                    }
                }

            }
        }
    }

    onDuplicate() {
        for (var i = 0; i < this.listItems.length; i++) {
            if (this.listItems[i].chkBox == true) {
                let assetItem: AssetItem = this.listItems[i].assetItem;
                if (assetItem != null) {
                    console.log(assetItem);
                    this.assetsSvc.copyItem(assetItem.pkid).subscribe(
                        data => this.onCall(data),
                        error => this.onCallError(error)
                    );
                }
            }
        }
    }

    onDelete() {
        this.removeItems = [];
        for (var i = 0; i < this.listItems.length; i++) {
            if (this.listItems[i].chkBox == true) {
                let assetItem: AssetItem = this.listItems[i].assetItem;
                if (assetItem != null) {
                    console.log(assetItem);
                    this.removeItems.push(assetItem);

                }
            }
        }
        if (this.removeItems.length == 1) {
            this.confirmTitle = "Are you sure you want to delete \'" + this.removeItems[0].name + "' ?";
            this.confirmModal.open();
        }
        else if (this.removeItems.length > 1) {
            this.confirmTitle = 'Are you sure you want to delete ?';
            this.confirmModal.open();
        }
    }

    onConfirmDelete() {
        if (this.removeItems.length == 1) {
            this.assetsSvc.removeItem(this.removeItems[0].pkid).subscribe(
                data => this.onCall(data),
                error => this.onCallError(error)
            );
        } else if (this.removeItems.length > 1) {
            var body = [];
            for (var i = 0; i < this.removeItems.length; i++) {
                body.push({ id: this.removeItems[i].pkid, name: this.removeItems[i].name });
            }
            this.assetsSvc.removeSelected(body).subscribe(
                data => this.onCall(data),
                error => this.onCallError(error)
            );
        }
        this.confirmModal.close();
    }

    onCancelDelete() {
        this.confirmModal.close();
    }

    onCall(jsonData: string) {
        const status = jsonData.hasOwnProperty("status") ? jsonData["status"] : '';
        const message = jsonData.hasOwnProperty("message") ? jsonData["message"] : '';

        if (status !== "SUCCESS") {
            this.ms.displayRawMessage(new Message(status, JSON.parse(message).msgs[0].message, JSON.parse(message).msgs[0].action, JSON.parse(message).msgs[0].suggestion, JSON.parse(message).prefix), this.customPlugs)
                .subscribe((value) => console.log(value));
        }
        else {
            console.log(status);
            if (message != null) {
                this.ms.displayRawMessage(new Message(status, message, '', '', ''), this.customPlugs)
                    .subscribe((value) => console.log(value));
            } else {
                this.ms.displayRawMessage(new Message(status, "A copy is created successfully.", '', '', ''), this.customPlugs)
                        .subscribe((value) => console.log(value));
            }

            this.assetsSvc.emitItemChanged(true);
        }
        console.log(jsonData);
    }

    onPrintClick() {
        this.loadEntity("Print");
    }

    onExportClick() {
        this.loadEntity("Export");
    }

    print(printvalue) {
        var printContents = document.getElementById(printvalue).innerHTML;
        var mywindow = window.open('', 'my div', 'height=400,width=600');
        mywindow.document.write('</head><body >');
        mywindow.document.write(printContents);
        mywindow.document.write('</body></html>');
        mywindow.document.close();
        mywindow.focus();
        mywindow.print();
        mywindow.close();
        return true;
    }

    loadEntity(job) {
        for (var i = 0; i < this.listItems.length; i++) {
            if (this.listItems[i].chkBox == true) {
                let assetItem: AssetItem = this.listItems[i].assetItem;
                if (assetItem != null) {
                    console.log(assetItem);
                    this.assetsSvc.getEntity(assetItem.assetType, assetItem.pkid).subscribe(
                        data => this.onGetEntity(data, job),
                        error => this.onGetEntityError(error),
                        () => { this.loading = false }
                    );
                }
            }
        }
    }

    onGetEntity(jsonData: JSON, job) {
        const status = jsonData.hasOwnProperty("status") ? jsonData["status"] : '';
        if (status !== "SUCCESS") {
            this.onGetEntityError(jsonData);
            return;
        } else {
            var data = jsonData["data"];
            if (data != null) {
                if (data instanceof Array) {
                    if (data.length > 0) {
                        this.operatorAssetItem = OperatorAssetItem.parse(data[0]);
                    }
                } else {
                    this.operatorAssetItem = OperatorAssetItem.parse(data);
                }
            }
            switch (job) {
                case "Export": this.onExport();
                    break;
                case "Print": this.onPrint();
                    break;
            }
        }
    }

    onGetEntityError(jsonData: JSON) {
        console.log(jsonData);
    }

    onPrint() {
        this.modal.open();
        console.log(this.operatorAssetItem);
    }

    onExport() {
        this.assetsSvc.saveFileAs(this.operatorAssetItem, this.operatorAssetItem.name);
    }

    onCallError(data: any) {
        console.log(data);
    }
}