import { Component, Input, EventEmitter, ViewChild, OnInit } from '@angular/core';
import { AssetItem } from '../common/assetItem';
import { DataService } from '../services/Assets.service';
import { Router, ActivatedRoute } from '@angular/router';
import { EnumUtil } from '../common/EnumUtil';
import { AssetType } from '../common/assetType';
import { AssetTypeCardsComponent } from './assetTypeCards.component';
import { OperatorAssetItem } from '../common/operator_assetItem';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';


@Component({
    selector: 'assetCard',
    templateUrl: 'public/html/mainArea/assetCard.template.html',
    styleUrls: ['public/css/mainArea/circularNav.css','public/css/app.css'],
    outputs: ['duplicate', 'delete', 'reject', 'approve']
})

export class AssetCardComponent implements OnInit {
    checked: boolean = false;
    assetType: AssetType;
    assetTypeCard: AssetTypeCardsComponent;
    duplicate: EventEmitter<Object> = new EventEmitter();
    reject: EventEmitter<Object> = new EventEmitter();
    approve: EventEmitter<Object> = new EventEmitter();
    delete: EventEmitter<Object> = new EventEmitter();
    loading: boolean;
    operatorAssetItem: OperatorAssetItem = null;
    isAction: boolean = false;

    @ViewChild('modal')
    modal: ModalComponent;

    @Input("assetItem") assetItem: AssetItem;
    @Input("menuFlag") menuFlag: boolean;
    @Input("buttonsFlag") buttonsFlag: boolean;

    constructor(private assetsSvc: DataService, private router: Router, private route: ActivatedRoute) {
    }

    ngOnInit() {
       	let assetItem: AssetItem = this.assetItem;
        if (AssetItem.isOperatorType(assetItem.assetType)) {		
            this.isAction = true;
        }
        
    }

    loadEntity(job) {
        this.loading = true;
        this.assetsSvc.getEntity(this.assetItem.assetType, this.assetItem.pkid).subscribe(
            data => this.onGetEntity(data, job),
            error => this.onGetEntityError(error),
            () => { this.loading = false }
        );
    }

    onRejectClick() {
        this.reject.emit({ 'id': this.assetItem.pkid, 'state': 4 });
    }

    onApproveClick() {
        this.approve.emit({ 'id': this.assetItem.pkid, 'state': 2 });
    }

    onExportClick() {
        this.loadEntity("Export");
    }

    onExport() {
        this.assetsSvc.saveFileAs(this.operatorAssetItem, this.assetItem.name);
    }

    onDuplicate() {
        this.checked = false;
        this.duplicate.emit({ 'id': this.assetItem.pkid, 'name': this.assetItem.name });
    }

    onDelete() {
        this.checked = false;
        this.delete.emit({ 'id': this.assetItem.pkid, 'name': this.assetItem.name });
    }

    onEdit() {
        if (AssetItem.isOperatorType(this.assetItem.assetType)) {
            this.router.navigate(['../../editAction', this.assetItem.pkid], { relativeTo: this.route });
        } else if (AssetType.PublishedFamily == this.assetItem.assetType) {
             this.router.navigate(['../viewPublishedFamily', this.assetItem.pkid], { relativeTo: this.route });
        } else {
            let routStr = '../../edit' + this.assetItem.assetType;
            this.router.navigate([routStr, this.assetItem.pkid], { relativeTo: this.route });
        }
    }

    onPrintClick() {
        this.loadEntity("Print");
    }

    onPrint() {
        this.modal.open();
        console.log(this.operatorAssetItem);
    }

    print(printvalue) {
        var printContents = document.getElementById(printvalue).innerHTML;
        var mywindow = window.open('', 'my div', 'height=400,width=600');
        mywindow.document.write('</head><body >');
        mywindow.document.write(printContents);
        mywindow.document.write('</body></html>');
        mywindow.document.close(); // necessary for IE >= 10
        mywindow.focus(); // necessary for IE >= 10
        mywindow.print();
        mywindow.close();
        return true;
    }

    getItemDisplayName(item: AssetItem) {
        var name = item.name;
        if (name != null) {
            var length = name.length;
            if (length > 20) {
                return name.substr(0, 19) + "...";
            }
            return name;
        }
        return '';
    }

    getItemDisplayDescription(item: AssetItem) {
        var desc = item.description;
        if (desc != null) {
            var length = desc.length;
            if (length > 30) {
                return desc.substr(0, 29) + "...";
            }
            return desc;
        }
        return '';
    }

    onCall(data: string) {
        this.checked = false;
        this.assetsSvc.emitItemChanged(true);
    }

    onCallError(data: any) {
        console.log(data);
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
}
