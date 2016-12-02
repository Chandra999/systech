import { Component, ChangeDetectorRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
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

@Component({
    selector: 'product-edit-tab',
    template: `
         <ul  id="breadcrumb" >
            <li><a (click)= "publishedFamily()">Published Family</a> </li>
            <li><a (click)= "backToFamily()">{{familyName}}</a> </li>
            <li>
                <a>		
                    {{productAssetItem.name == null ? 'Published Product' : getDisplayName()}}		
                </a>
            </li> 
        </ul>
        <form id="newProduct" class="assetForm uni-card-2" (ngSubmit)='onSave()' #f='ngForm'>
            <span class="glyphicon glyphicon-remove formClose" (click)="onClose()" title="Close"></span>
            <div class="row">
                <div class=".col-sm-6" style="width: 80%; margin-left: 15px;">
                    <uni-name-description [assetType]=assetType [imageUrl]=defaultImageUrl [assetItem]=productAssetItem [formCtrl]="f" [intro]=defaultIntro [disable]=true></uni-name-description>
                </div>
                <div class=".col-sm-6" style="width:160px; padding:10px; margin:-155px 5% 0px 0px; float:right;">   
                    <fieldset class="picture">
                        <div style="width:120px; height:120px;">
                            <img style="width:120px; height:100px;" src='{{product_image}}' alt="product" />  
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
                        <input type="radio" name="non-serialized" [checked]="false==productAssetItem.serialized" style="margin:2px 3px 0 0; cursor:pointer;" disabled /><label style="margin-bottom:10px;">Non-Serialized</label>
                        <br>
                        <input type="radio" name="serialized"  [checked]="true==productAssetItem.serialized" style="margin:2px 3px 0 0; cursor:pointer;" disabled /><label style="margin-bottom:10px;">Serialized</label>
                        <br>
                        <div calss="row" style="margin-left:15px;" disabled>
                            <input type="radio" name="gtin" [checked]="'GTIN'==productAssetItem.productIdDetails.type" style="margin:2px 3px 0 0; cursor:pointer;" disabled /><label style="font-size:12px;">GTIN</label>
                            <br>
                            <input type="radio" name="custom" [checked]="'Custom'==productAssetItem.productIdDetails.type" style="margin:2px 3px 0 0; cursor:pointer;" disabled /><label style="font-size:12px;">Custom</label>
                            <br>
                            <div calss="col-sm-2">
                                <label for="name" style="font-size:12px;">Starting Location</label>
                                <br>
                                <input type="text" [(ngModel)]="productAssetItem.productIdDetails.start" name="start" disabled style="width:40%;">
                            </div>
                            <div calss="col-sm-2">
                                <label for="name" style="font-size:12px;">Length</label>
                                <br>
                                <input type="text" [(ngModel)]="productAssetItem.productIdDetails.length" name="length" disabled style="width:40%;">
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-5">
                        <label for="name">Product ID</label>
                        <label class="form-control" style="width:80%;">{{productAssetItem.productId}}</label>
                        <br>
                        <label for="name">Package Profile</label>
                        <label class="form-control" (click)="openPackageProfile(productAssetItem.packageProfile.pkid)" title="Click to open Published Package Profile." style="width:80%; cursor:pointer;">{{productAssetItem.packageProfile.name}}</label>
                    </div>
                </div>
            </div>

            <div id="dnaSection" class="main-border" *ngIf="show==2">
                <div *ngIf="productAssetItem.dna!=null  && productAssetItem.dna.length>0" id="dnaTable" class="table-responsive" style="overflow-x:visible;">
                    <table class="uni-table" style="margin:10px 0px 10px 15px;">
                       <tr>
                            <th class='uni-th'>Name</th>
                            <th class='uni-th'>Value</th>
                            <th class='uni-th'>Modifiable</th>
                        </tr>
                        <tr *ngFor="let dna of productAssetItem.dna; let i=index">
                            <td class='uni-td'>
                                <label class="form-control">{{dna.name}}</label>
                            </td>
                            <td class='uni-td'>
                                <input type="text" class="form-control" [(ngModel)]="dna.value" name="dnaValue" (ngModelChange)="onContentChange()">
                            </td>
                            <td class='uni-td'>{{dna.isModifiable}}</td>
                        </tr>
                    </table>
                </div>
                <div *ngIf="productAssetItem.dna==null || productAssetItem.dna.length==0">
                    <hr style="margin:0 50px 10px 50px;">
                    <label style="font-weight:700; font-size:18px; margin-left:30%; color:#8dc63f;">No DNA for {{productAssetItem.name}}</label>
                    <hr style="margin:10px 50px 0 50px;">
                </div>             
            </div>
        </form>
    `,
    styleUrls: ['public/css/mainArea/breadcrumb.css', 'public/css/common/modal.css', 'public/css/mainArea/view.css', 'public/css/mainArea/edit_assets.css', 'public/css/common/table.css', 'public/css/common/anchorButton.css'],
})

export class ViewPublishedProduct implements OnInit, OnDestroy {
    assetType: AssetType = AssetType.Product;
    productAssetItem: ProductAssetItem;
    defaultImageUrl: string;
    index: number;
    private editMode = 'readOnly';
    defaultIntro = productDescription;
    show: number = 1;
    customPlugs: string[] = ['a'];
    browsePackage: boolean = false;
    loading: boolean = true;
    editFlag: boolean = false;
    filesUpload: File;
    product_image: string;
    imageUploaded: boolean = false;
    imageFlag: boolean = false;
    private subscription: Subscription;
    private querySubscription: Subscription;
    familyId: string = null;
    familyName: string = null;
    //-----------------------------------------------ConfirmModal-------------------

    constructor(private route: ActivatedRoute, private productSvc: DataService, private router: Router, private cdr: ChangeDetectorRef, private dataService: DataService, private ms: MessageService, private userSvc: UsersService) {
    }

    ngOnInit() {
        this.defaultImageUrl = 'public/img/' + ProductAssetItem.getDefaultImageUrl(this.assetType);
        this.subscription = this.route.params.subscribe(
            (params: any) => {
                if (params.hasOwnProperty('itemIndex')) {
                    this.editMode = 'edit';
                    this.index = +params['itemIndex'];
                }
                this.productAssetItem = new ProductAssetItem(this.assetType, 'Loading...', '', '', '');
                this.productSvc.onGetPublishedProduct(this.index).subscribe(
                    data => this.onGetProduct(data),
                    error => this.onShowMessage(error)
                );
                this.cdr.detectChanges();
            }
        );
        this.querySubscription = this.route.queryParams.subscribe(
            (queryParams: any) => {
                this.familyId = queryParams['familyId'];
                this.familyName = queryParams['familyName'];
            }
        );
    }

    onClose() {
        this.backToFamily();
    }

    publishedFamily() {
        this.router.navigate(['Operator/publishedFamily']);
    }

    backToFamily() {
        this.router.navigate(['Operator/viewPublishedFamily', this.familyId]);
    }

    openPackageProfile(index) {
        this.router.navigate(['Operator/viewPublishedPackageProfile', index], { queryParams: { familyName: this.familyName, familyId: this.familyId, productName: this.productAssetItem.name, productId: this.productAssetItem.pkid } });
    }

    getDisplayName() {
        let name = this.productAssetItem.name;
        if (name != null && name.length > 30) {
            return name.slice(0, 29) + "...";
        }
        return name;
    }

    onGetProduct(jsonData: JSON) {
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
            console.log(this.productAssetItem.imgUrl);
            if (this.productAssetItem.imgUrl != null || this.productAssetItem.imgUrl != undefined) {
                var date = new Date().getTime();
                this.product_image = baseUrl + this.productAssetItem.imgUrl + "?" + date;
            }
            else {
                this.product_image = DefaultConstants.DEFAULT_IMAGE_FOLDER_PATH + "product_default_image.png";
            }
        }
    }

    onShowMessage(jsonData: JSON) {
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
            }
        }
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.querySubscription.unsubscribe();
    }
}