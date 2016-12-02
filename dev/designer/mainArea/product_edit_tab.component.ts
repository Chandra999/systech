import { Component, ChangeDetectorRef, OnInit, ViewChild } from '@angular/core';
import { ProductAssetItem } from '../../common/product_assetItem';
import { AssetType } from '../../common/assetType';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from '../../services/Assets.service';
import { productDescription } from '../../common/messages';
import { MessageService } from '../../services/message.service';
import { Message } from '../../message-center/message';
import { DefaultConstants, ALLOWED_MIME_TYPES } from '../../common/default_values';
import { UsersService } from '../../services/User.service';
import { DEFAULT_DEVELOPER_RESOURCE } from '../../common/defaultHost';
import { Subscription } from "rxjs/Rx";
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';

@Component({
    selector: 'product-edit-tab',
    template: `
         <ul  id="breadcrumb" >
            <li><a (click)= "assetTypeSelected()">{{displayName}}</a> </li>
            <li>
                <a>
                    <span class="glyphicon glyphicon-asterisk" style="margin-left:2px; font-size:12px" [hidden]=!productAssetItem.dirtyFlag></span>
                    {{productAssetItem.name == null ? 'New Product' : getDisplayName()}}
                </a>
            </li>
        </ul>
        <message-center></message-center>
        <form id="newProduct" class="assetForm uni-card-2" (ngSubmit)='onSave()' #f='ngForm'>
            <span class="glyphicon glyphicon-remove formClose" (click)="onClose()" title="Close"></span>
            <div class="fixed-action-btn" style="width:16%; top:200px; right:0px; margin-top:-10px;">
                   <a class="btn-floating btn-large" title="Options">
                    <span class="glyphicon glyphicon-pencil" style="margin:11px 0 0 11px; font-size:18px;"></span>
                </a>
                <ul style="padding-left:0px;">
                    <li>
                        <button type="submit"  [disabled]="f.form.invalid || !productAssetItem.dirtyFlag" class="btn-floating" title="Save">
                            <span class="glyphicon glyphicon-save-file" style="margin-top:10px;"></span>
                        </button>
                    </li>
                    <li>
                        <button type="button" class="btn-floating" (click)="onCancel()" title="Cancel">
                            <span class="glyphicon glyphicon-remove" style="margin-top:10px;"></span>
                        </button>
                    </li>
                </ul>
            </div>
            <div class="row">
                <div class=".col-sm-6" style="width: 80%; margin-left: 15px;">
                    <uni-name-description [assetType]=assetType [imageUrl]=defaultImageUrl [assetItem]=productAssetItem [formCtrl]="f" [intro]=defaultIntro></uni-name-description>
                </div>
                <div class=".col-sm-6" style="width:160px; padding:10px; margin:-155px 5% 0px 0px; float:right;">
                    <fieldset class="picture">
                        <div style="width:120px; height:120px;">
                            <img style="width:120px; height:100px;" src='{{product_image}}' alt="product" />
                            <label  class="uni-button" style="margin-top:5px; font-size:13px; width:100%;" > Change Picture <input type="file" accept=".png,.jpeg,.gif" style="display: none;" (change)="fileChange($event); onContentChange()" />  </label>
                        </div>
                    </fieldset>
                </div>
            </div>


            <div style="margin-bottom:10px;">
                <label (click)="show=1" [class.changeBorder]="show==1" style="margin-right:20px; border-bottom: 4px solid #58595b; height:23px; cursor:pointer; min-width:80px; text-align:center;">Product</label>
                <label (click)="show=2" [class.changeBorder]="show==2" style="margin-right:20px; border-bottom: 4px solid #58595b; height:23px; cursor:pointer; min-width:80px; text-align:center;">DNA</label>
            </div>

            <div id="productSection" class="main-border" *ngIf="show==1">
                <div class="row" style="margin:0px;">
                    <div class="col-sm-4" style="border:#cdc4c4 1px solid; padding:5px;">
                        <input type="radio" name="non-serialized" (click)="setSerialized(false); onContentChange(); onNonSerialized()" [checked]="false==productAssetItem.serialized" style="margin:2px 3px 0 0; cursor:pointer;" /><label style="margin-bottom:10px;">Non-Serialized</label>
                        <br>
                        <input type="radio" name="serialized" (click)="setSerialized(true); onContentChange()" [checked]="true==productAssetItem.serialized" style="margin:2px 3px 0 0; cursor:pointer;" /><label style="margin-bottom:10px;">Serialized</label>
                        <br>
                        <div calss="row" style="margin-left:15px;">
                            <input type="radio" name="gtin-custom" [(ngModel)]="productAssetItem.productIdDetails.type" (ngModelChange)="onContentChange()" (click)="productAssetItem.productIdDetails.type='GTIN'" value="GTIN" [checked]="'GTIN'===productAssetItem.productIdDetails.type" [disabled]="false==productAssetItem.serialized" style="margin:2px 3px 0 0; cursor:pointer;" /><label style="font-size:12px;">GTIN</label>
                            <br>
                            <input type="radio" name="gtin-custom" [(ngModel)]="productAssetItem.productIdDetails.type" (ngModelChange)="onContentChange()" (click)="productAssetItem.productIdDetails.type='Custom'" value="Custom" [checked]="'Custom'===productAssetItem.productIdDetails.type" [disabled]="false==productAssetItem.serialized" style="margin:2px 3px 0 0; cursor:pointer;" /><label style="font-size:12px;">Custom</label>
                            <br>
                            <div calss="col-sm-2">
                                <label for="name" style="font-size:12px;">Starting Location</label>
                                <br>
                                <input type="text" [(ngModel)]="productAssetItem.productIdDetails.start" name="start" (ngModelChange)="onContentChange()" [disabled]="false==productAssetItem.serialized" style="width:40%;">
                            </div>
                            <div calss="col-sm-2">
                                <label for="name" style="font-size:12px;">Length</label>
                                <br>
                                <input type="text" [(ngModel)]="productAssetItem.productIdDetails.length" name="length" (ngModelChange)="onContentChange()" [disabled]="false==productAssetItem.serialized" style="width:40%;">
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-5">
                        <label for="name">Product ID</label>
                        <input class="form-control" type="text" id="productID" maxlength="255" required [(ngModel)]='productAssetItem.productId' name="id" (ngModelChange)="onContentChange()" style="width:80%;" />
                        <br>
                        <label for="name">Package Profile</label>
                        <input class="form-control" type="text" id="packageProfile" readonly maxlength="255" [(ngModel)]='productAssetItem.packageProfile.name' name="packageProfileName" (ngModelChange)="onContentChange()" style="width:80%;" required title="Click on 'Browse Package Profile' to add."/>
                    </div>
                    <div *ngIf="browsePackage==false" class="col-sm-3" style="margin-top:115px;">
                        <label><a (click)="browsePackage=true; loadPackageProfile();" style="cursor:pointer;margin-left:-50%;display:inline-block;">Browse Package Profile</a></label>
                    </div>
                    <div *ngIf="browsePackage==true" class="col-sm-3">
                        <div *ngIf="loading==true" class="sub-border" style="max-height:165px; min-height:165px; overflow-y:auto; margin:5px 5px 0px 0px;">
                            <a style="font-size:x-large;">
                                <span class="glyphicon glyphicon-refresh glyphicon-refresh-animate" style="color:#8dc63f;"></span>
                                Loading...
                            </a>
                        </div>
                        <div *ngIf="loading==false" class="sub-border" style="max-height:165px; min-height:165px; overflow-y:auto; margin:5px 5px 0px 0px;">
                            <span class="glyphicon glyphicon-remove" (click)="browsePackage=false" title="Close Package Profile" style="float:right; cursor:pointer"></span>
                            <div *ngFor="let item of packageProfileItems" style="padding:0px 10px;">
                                <input type="radio" name="package" (click)="updatePackageProfile(item); onContentChange();" [checked]="item.name==productAssetItem.packageProfile.name" style="margin:2px 3px 0 0; cursor:pointer;" />
                                <label style="margin:0px 0px 3px 5px; cursor:pointer;">{{item.name}}</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="dnaSection" class="main-border" *ngIf="show==2">
                <a class="btn btn-md" role="button" id="newDnaItem" (click)="addRow()">DNA <i class="glyphicon glyphicon-plus" style="color:#3b73b9"></i></a>
                <div *ngIf="tempDNA.length>0 || productAssetItem.dna.length>0" id="dnaTable" class="table-responsive" style="overflow-x:visible;">
                    <table class="uni-table" style="margin:10px 0px 10px 15px;">
                       <tr>
                            <th class='uni-th'>Name</th>
                            <th class='uni-th'>Value</th>
                            <th class='uni-th'>Modifiable</th>
                            <th class='uni-th'></th>
                        </tr>
                        <tr *ngFor="let dna of productAssetItem.dna; let i=index">
                            <td class='uni-td'>
                                <label class="form-control">{{dna.name}}</label>
                            </td>
                            <td class='uni-td'>
                                <input type="text" class="form-control" [(ngModel)]="dna.value" name="dnaValue" (ngModelChange)="onContentChange()">
                            </td>
                            <td class='uni-td'>{{dna.isModifiable}}</td>
                            <td class='uni-td' (click)="onDeleteDna(i)" style="cursor:pointer;">Delete</td>
                        </tr>
                        <tr *ngFor="let dna of tempDNA; let row=index">
                            <td class='uni-td'>
                                <select [(ngModel)]="dna.name" [ngModelOptions]="{standalone: true}" (ngModelChange)="updateTempDna(row, dna.name)" class="form-control" placeholder="Select DNA" required>
                                    <option *ngFor="let item of dna.dnaItems; let i=index" value="{{item.name}}" >{{item.name}}</option>
                                </select>
                            </td>
                            <td class='uni-td'>
                                <input type="text" class="form-control" [(ngModel)]="dna.value" [ngModelOptions]="{standalone: true}" (ngModelChange)="onContentChange()">
                            </td>
                            <td class='uni-td'>{{dna.isModifiable}}</td>
                            <td class='uni-td' (click)="onCancelTempDna(row)" style="cursor:pointer;">Cancel</td>
                        </tr>
                    </table>
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
    styleUrls: ['public/css/mainArea/breadcrumb.css', 'public/css/common/modal.css', 'public/css/mainArea/view.css', 'public/css/mainArea/edit_assets.css', 'public/css/common/table.css', 'public/css/common/anchorButton.css'],
})

export class ProductEditTabComponent implements OnInit {
    assetType: AssetType = AssetType.Product;
    productAssetItem: ProductAssetItem;
    displayName: string;
    defaultImageUrl: string;
    index: number;
    private editMode = 'create';
    private defaultName = null;
    defaultIntro = productDescription;
    show: number = 1;
    customPlugs: string[] = ['a'];
    packageProfileItems = [];
    tempDNA = [];
    dnaItems = [];
    browsePackage: boolean = false;
    loading: boolean = true;
    editFlag: boolean = false;
    filesUpload: File;
    product_image: string;
    imageUploaded: boolean = false;
    imageFlag: boolean = false;
    private subscription: Subscription;
    //-----------------------------------------------ConfirmModal-------------------
    @ViewChild('confirmModal')
    confirmModal: ModalComponent;
    confirmTitle: string = '';
    message: string = '';
    showCancel: boolean = false;
    okButtonLabel: string = 'Ok';
    cancelButtonLabel: string = 'No';
    isCancel: boolean = false;
    //-----------------

    constructor(private route: ActivatedRoute, private productSvc: DataService, private router: Router, private cdr: ChangeDetectorRef, private dataService: DataService, private ms: MessageService, private userSvc: UsersService) {
    }

    ngOnInit() {
        this.defaultImageUrl = 'public/img/' + ProductAssetItem.getDefaultImageUrl(this.assetType);
        this.displayName = ProductAssetItem.getDisplayName(this.assetType);
        this.subscription = this.route.params.subscribe(
            (params: any) => {
                if (params.hasOwnProperty('itemIndex')) {
                    this.editMode = 'edit';
                    this.index = +params['itemIndex'];
                }
                if (this.editMode === 'edit') {
                    this.productAssetItem = new ProductAssetItem(this.assetType, 'Loading...', '', '', '');
                    this.productSvc.getProduct(this.assetType, this.index).subscribe(
                        data => this.onGetProduct(data, true),
                        error => this.onShowMessage(error)
                    );
                }
                else {
                    this.filesUpload = null;
                    this.product_image = DefaultConstants.DEFAULT_IMAGE_FOLDER_PATH + "product_default_image.png";
                    this.productAssetItem = new ProductAssetItem(this.assetType, this.defaultName, '', this.defaultImageUrl, '');
                }
                this.cdr.detectChanges();
            }
        );
    }

    loadPackageProfile() {
        this.loading = true;
        this.productSvc.getEntities(AssetType.PackageProfile).subscribe(
            data => this.onGetPackageProfile(data),
            error => this.onShowMessage(error),
            () => { this.loading = false; }
        );
    }

    loadDNA() {
        this.loading = true;
        this.productSvc.getDnaAttributes().subscribe(
            data => this.onGetDNA(data),
            error => this.onShowMessage(error),
            () => { this.loading = false, this.tempDNA.push({ dnaItems: this.dnaItems, value: null, isModifiable: null }) }
        );
    }

    onGetPackageProfile(jsonData: JSON) {
        console.log(jsonData);
        const status = jsonData.hasOwnProperty("status") ? jsonData["status"] : '';
        if (status !== "SUCCESS") {
            this.onShowMessage(jsonData);
            return;
        } else {
            var entities = jsonData["data"];
            this.packageProfileItems = [];
            for (var index = 0; index < entities.length; index++) {
                this.packageProfileItems.push({ name: entities[index].objectName, pkid: entities[index].pkid, uuid: entities[index].uuid });
            }
            console.log(this.packageProfileItems);
        }
    }

    onNonSerialized() {
        this.productAssetItem.productIdDetails.type = null;
        this.productAssetItem.productIdDetails.start = null;
        this.productAssetItem.productIdDetails.length = null;
    }

    onGetDNA(jsonData: JSON) {
        console.log(jsonData);
        console.log(this.productAssetItem.dna);
        const status = jsonData.hasOwnProperty("status") ? jsonData["status"] : '';
        if (status !== "SUCCESS") {
            this.onShowMessage(jsonData);
            return;
        } else {
            var entities = jsonData["data"];
            this.dnaItems = [];
            for (var index = 0; index < entities.length; index++) {
                var dna = entities[index];
                this.dnaItems.push({ name: dna.objectName, pkid: dna.pkid, uuid: dna.uuid, isModifiable: dna.isModifiable, isSearchable: dna.isSearchable, value: dna.value });
            }
            console.log(this.dnaItems);
        }
    }

    updateTempDna(index, dnaName) {
        for (var i = 0; i < this.dnaItems.length; i++) {
            if (this.dnaItems[i].name == dnaName) {
                this.tempDNA[index].name = this.dnaItems[i].name;
                this.tempDNA[index].value = this.dnaItems[i].value;
                this.tempDNA[index].isModifiable = this.dnaItems[i].isModifiable;
                this.tempDNA[index].pkid = this.dnaItems[i].pkid;
                this.tempDNA[index].uuid = this.dnaItems[i].uuid;
                this.tempDNA[index].isSearchable = this.dnaItems[i].isSearchable;
                break;
            }
        }
        console.log(this.tempDNA);
    }

    mapDna() {
        if (this.tempDNA != null) {
            for (var index = 0; index < this.tempDNA.length; index++) {
                this.productAssetItem.dna.push({
                    name: this.tempDNA[index].name,
                    value: this.tempDNA[index].value,
                    isModifiable: this.tempDNA[index].isModifiable,
                    pkid: this.tempDNA[index].pkid,
                    uuid: this.tempDNA[index].uuid,
                    isSearchable: this.tempDNA[index].isSearchable
                })
            }
            this.tempDNA = [];
        }
    }

    setSerialized(value) {
        this.productAssetItem.serialized = value;
    }

    onDeleteDna(index) {
        this.productAssetItem.dna.splice(index, 1);
        this.onContentChange();
    }

    onCancelTempDna(index) {
        this.tempDNA.splice(index, 1);
    }

    fileChange(input) {
        var reader = [];
        var imgInput = <HTMLInputElement>input.target,
            files = <FileList>imgInput.files;
        if (!this.hasValidFileTypeValid(files[0].type)) {
            alert('Only image files are allowed');
            return false;
        }
        this.filesUpload = <File>files[0];
        reader.push(new FileReader());
        reader[0].addEventListener("load", (input) => {
            this.product_image = input.target.result;
        }, false);
        if (this.filesUpload) {
            reader[0].readAsDataURL(this.filesUpload);
            this.imageUploaded = true;
        }
        this.editFlag = true;
        this.imageFlag = true;
    }

    hasValidFileTypeValid(type: string): boolean {
        return (ALLOWED_MIME_TYPES.indexOf(type.toLowerCase()) !== -1);
    }

    makeFileRequest(url: string, params: Array<string>, files: File) {
        return new Promise((resolve, reject) => {
            var formData: any = new FormData();
            //var filename :string;
            var xhr = new XMLHttpRequest();
            var filename = this.productAssetItem.name + "." + this.filesUpload.name.slice((this.filesUpload.name.lastIndexOf(".") - 1 >>> 0) + 2);
            this.productAssetItem.img = filename;
            formData.append("file", files, filename);
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        resolve(JSON.parse(xhr.response));
                    } else {
                        reject(xhr.response);
                    }
                }
            }
            xhr.open("POST", url, true);
            if (this.userSvc != null && this.userSvc.currentUser != null) {
                xhr.setRequestHeader("Authorization", "Basic " + btoa(this.userSvc.getCurrentUserName() + ":" + this.userSvc.currentUser.password));
            }
            xhr.send(formData);
        });
    }

    onSave() {
        if (this.productAssetItem.dirtyFlag == false) {
            this.save(true);
        }
        else {
            this.save(false);
        }
    }

    save(showDialog: boolean) {
        this.mapDna();
        this.productAssetItem.updateJSONObject();
        if (this.editMode === 'edit') {
            this.productAssetItem.updatorName = this.userSvc.getCurrentUserName();
            this.productSvc.postProduct(this.productAssetItem).subscribe(
                data => this.saveImage(data, showDialog),
                error => this.onShowMessage(error)
            );
        }
        else {
            this.productSvc.putProduct(this.productAssetItem).subscribe(
                data => this.saveImage(data, showDialog),
                error => this.onShowMessage(error)
            );
        }
        this.productAssetItem.dirtyFlag = false;
    }

    addRow() {
        this.loadDNA();
        this.onContentChange();
    }

    onCancel() {
        this.router.navigate(['Designer/assets', this.assetType]);
    }

    onClose() {
        if (this.productAssetItem.dirtyFlag == true) {
            this.openModal("Do you want to save the changes you made to \'" + this.productAssetItem.name + "'?", "", true);
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
        if (this.editMode == 'edit') {
            this.router.navigate(['../../assets', this.assetType], { relativeTo: this.route });
        } else {
            this.router.navigate(['../assets', this.assetType,], { relativeTo: this.route });
        }
    }

    getDisplayName() {
        let name = this.productAssetItem.name;
        if (name != null && name.length > 30) {
            return name.slice(0, 29) + "...";
        }
        return name;
    }

    updatePackageProfile(packageItem) {
        this.productAssetItem.packageProfile.name = packageItem.name;
        this.productAssetItem.packageProfile.pkid = packageItem.pkid;
        this.productAssetItem.packageProfile.uuid = packageItem.uuid;
    }

    onContentChange() {
        this.productAssetItem.dirtyFlag = true;
    }

    onGetProduct(jsonData: JSON, loadImage: boolean) {
        console.log(jsonData);
        const status = jsonData.hasOwnProperty("status") ? jsonData["status"] : '';
        const baseUrl = jsonData.hasOwnProperty("baseImageURL") ? jsonData["baseImageURL"] : '';
        if (status !== "SUCCESS") {
            this.onShowMessage(jsonData);
            return;
        } else {
            var data = jsonData["data"];
            if (data != null) {
                if (data instanceof Array) {
                    if (data.length > 0) {
                        this.productAssetItem = ProductAssetItem.parse(data[0]);
                    }
                } else {
                    this.productAssetItem = ProductAssetItem.parse(data);
                }
            }
            if (loadImage) {
                if (this.productAssetItem.img != null || this.productAssetItem.img != undefined) {
                    var date = new Date().getTime();
                    this.product_image = baseUrl + this.productAssetItem.img + "?" + date;
                }
                else {
                    this.product_image = DefaultConstants.DEFAULT_IMAGE_FOLDER_PATH + "product_default_image.png";
                }
            }
            this.productAssetItem.dirtyFlag = false;
        }
    }

    saveImage(jsonData: JSON, showDialog: boolean) {
        const status = jsonData.hasOwnProperty("status") ? jsonData["status"] : '';
        var data = jsonData.hasOwnProperty("data") ? jsonData["data"] : '';
        if (status !== "SUCCESS") {
            this.onShowMessage(jsonData);
            if (!showDialog) {
                if (this.editMode === 'edit') {
                    var displayMsg = "Failed to update \'" + this.productAssetItem.name + '\'.';
                } else {
                    var displayMsg = "Failed to create \'" + this.productAssetItem.name + '\'.';
                }
            }
        }
        else if (!showDialog) {
            if (data != null) {
                if (data instanceof Array) {
                    if (data.length > 0) {
                        console.log(data[0].pkid);
                        if (this.imageUploaded || this.imageFlag) {
                            this.makeFileRequest(DEFAULT_DEVELOPER_RESOURCE + "/image/" + data[0].pkid, [], this.filesUpload).then((result) => {
                                console.log("Image Uploaded");
                            },
                                (error) => { console.error(error); }
                            );
                        }
                        if (this.editMode === 'edit') {
                            var displayMsg = "Product '" + this.productAssetItem.name + "' is updated successfully.";
                        } else {
                            var displayMsg = "New Product '" + this.productAssetItem.name + "' is created successfully.";
                            this.editMode = 'edit';
                        }
                        this.productAssetItem.dirtyFlag = false;
                        this.onGetProduct(jsonData, false);
                    }
                }
            }
        }
        this.ms.displayRawMessage(new Message(status, displayMsg, '', '', ''), this.customPlugs)
            .subscribe((value) => console.log(value));
    }


    onShowMessage(jsonData: JSON) {
        console.log(jsonData);
        const status = jsonData.hasOwnProperty("status") ? jsonData["status"] : '';
        const message = jsonData.hasOwnProperty("message") ? jsonData["message"] : '';
        if (status == 'ERROR') {
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
                console.log(jsonData);
            }
        }
    }
}
