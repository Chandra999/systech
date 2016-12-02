import { Component, ChangeDetectorRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { AssetType } from '../../common/assetType';
import { DataService } from '../../services/Assets.service';
import { Router, ActivatedRoute } from '@angular/router';
import { packageProfileDescription, defaultTypeOfSymbology, defaultPrintingTechnique, defaultSubstrate, defaultFinish, defaultFlexibility, defaultCoarseness, defaultPerspective, defaultWhatIsBeingPrinted, defaultDarkOrLightPrinting, defaultPrintContinuityStyle } from '../../common/messages';
import { PackageProfileAssetItem, default_runTimeParameters } from '../../common/packageProfile_assetItem';
import { MessageService } from '../../services/message.service';
import { Message } from '../../message-center/message';
import { UsersService } from '../../services/User.service'
import { Subscription } from "rxjs/Rx";
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';

@Component({
    selector: 'unisecure-package-profile',
    template: `
        <ul  id="breadcrumb" >
            <li><a (click)= "publishedFamily()">Published Family</a></li>
            <li><a (click)= "backToFamily()">{{familyName}}</a></li>
            <li><a (click)= "backToProduct()">{{productName}}</a> </li>
            <li>
                <a>
                    {{packageProfileAssetItem.name == null ? 'Published Package Profile' : getDisplayName()}}		
                </a>
            </li> 
        </ul>
        <form id="newPackage" class="assetForm uni-card-2" (ngSubmit)='onSave()' #f='ngForm'>
            <span class="glyphicon glyphicon-remove formClose" (click)="onClose()" title="Close"></span>
            <uni-name-description [assetType]=assetType [imageUrl]=defaultImageUrl [assetItem]=packageProfileAssetItem [formCtrl]="f" [intro]=defaultIntro [disable]=true></uni-name-description>
            <div style="margin-bottom:10px;">
                <label (click)="show=1; showPrintingStyle=false;" [class.changeBorder]="show==1" style="margin-right:20px; border-bottom: 4px solid #58595b; height:23px; cursor:pointer; min-width:120px; text-align:center;">Package Details</label>
                <label (click)="show=2; display($event)" [class.changeBorder]="show==2" style="margin-right:20px;  border-bottom: 4px solid #58595b; height:23px; cursor:pointer; min-width:110px; text-align:center;">Printing Style</label>
                <label (click)="show=3" [class.changeBorder]="show==3" style="margin-right:20px; border-bottom: 4px solid #58595b; height:23px; cursor:pointer; min-width:160px; text-align:center;" *ngIf="showPrintingStyle==true">Runtime Parameters</label>
            </div>
            <div id="packageDetails" class="main-border" style="width: 85%" *ngIf="show==1">
                <div style="width:48%; float:left;display:inline-block;margin-left:10px;margin-right:10px">
                    <div class="sub-border" >
                        <dropdown-help-checkbox [labelText]=defaultPrintingTechnique.text [content]=defaultPrintingTechnique.value [chkBox]=true [chkBoxLabel]=defaultPrintingTechnique.chkBoxLabel [help]=true [chkBoxValue]=packageProfileAssetItem.halftone.value [currentValue]=packageProfileAssetItem.technique.value [disable]=true></dropdown-help-checkbox>
                    </div>
                    <div class="sub-border" style="margin-top:15px;padding-top:18px;">
                        <dropdown-help-checkbox  [labelText]=defaultTypeOfSymbology.text [content]=defaultTypeOfSymbology.value [chkBox]=true [chkBoxLabel]=defaultTypeOfSymbology.chkBoxLabel [help]=true [chkBoxValue]=packageProfileAssetItem.serialized.value [currentValue]=packageProfileAssetItem.symbology.value [disable]=true></dropdown-help-checkbox>
                            <label style="font-weight:100;">Symbology Size (in millimeter)</label>
                            <div style="display:flex;">
                                <label style="margin:10px;"> Width </label>
                                <input type="number" class="form-control" [(ngModel)]="packageProfileAssetItem.width.value" name="widthValue" [disabled]=true style="width:25%;" placeholder="width" />
                                <label style="margin:10px;"> X </label>
                                <label style="margin:10px;"> Height </label>
                                <input type="number" class="form-control" [(ngModel)]="packageProfileAssetItem.height.value" name="heightValue" [disabled]=true style="width:25%;" placeholder="height" />
                            </div>
                        
                        <div style="clear: both;"></div>
                    </div>
                </div>
                <div style="width:48% ; display:inline-block; margin-left:10px;">
                    <div class="sub-border">
                        <dropdown-help-checkbox [labelText]=defaultFinish.text [content]=defaultFinish.value [chkBox]=true [chkBoxLabel]=defaultFinish.chkBoxLabel [chkBoxValue]=packageProfileAssetItem.wrapped.value [currentValue]=packageProfileAssetItem.finish.value [disable]=true></dropdown-help-checkbox>
                    </div>
                    <div class="sub-border">
                        <div>
                            <dropdown-help-checkbox [labelText]=defaultSubstrate.text [content]=defaultSubstrate.value [currentValue]=packageProfileAssetItem.substrate.value [disable]=true></dropdown-help-checkbox>
                        </div>
                        <div style="margin-top:10px">
                            <label style="margin-right:15px;width:80px">{{defaultFlexibility.text}}:</label>
                            <div *ngFor="let item of defaultFlexibility.value" style="padding-left:10px;display:inline-block;width:130px">
                                <input type="radio" name="flexibility" [checked]="item==packageProfileAssetItem.flexibility.value" [disabled]=true style="margin:2px 3px 0 0; cursor:pointer;" />
                                <label style="margin:0px 0px 3px 5px; cursor:pointer; font-weight: normal">{{item}}</label>
                            </div>
                            <div style="clear: both;"></div>
                        </div>
                        <div style="margin-top:10px">
                            <label style="margin-right:15px;width:80px">{{defaultCoarseness.text}}:</label>
                            <div *ngFor="let item of defaultCoarseness.value" style="padding-left:10px;display:inline-block; width:130px">
                                <input type="radio" name="coarseness" [checked]="item==packageProfileAssetItem.coarseness.value" [disabled]=true style="margin:2px 3px 0 0; cursor:pointer;" />
                                <label style="margin:0px 0px 3px 5px; cursor:pointer; font-weight: normal">{{item}}</label>
                            </div>
                            <div style="clear: both;"></div>
                        </div>
                        <div style="margin-top:10px;margin-bottom:7px">
                            <label style="margin-right:15px;width:80px">{{defaultPerspective.text}}:</label>
                            <div *ngFor="let item of defaultPerspective.value" style="padding-left:10px;display:inline-block;width:130px">
                                <input type="radio" name="perspective" [checked]="item==packageProfileAssetItem.perspective.value" [disabled]=true style="margin:2px 3px 0 0; cursor:pointer;" />
                                <label style="margin:0px 0px 3px 5px; cursor:pointer;font-weight: normal">{{item}}</label>
                            </div>
                            <div style="clear: both;"></div>
                        </div>
                        <div style="clear: both;"></div>
                    </div>
                </div>
            </div>
            <div style="clear: both;"></div>
            
            <div id="printingStyle" class="main-border" *ngIf="show==2">
                <div style="margin-top:10px">
                    <label style="margin-right:15px">{{defaultWhatIsBeingPrinted.text}}:</label>
                    <div *ngFor="let item of defaultWhatIsBeingPrinted.value" style="padding-left:10px;display:inline-block; width:130px">
                        <input type="radio" name="printObject" [checked]="item==packageProfileAssetItem.print.value" [disabled]=true style="margin:2px 3px 0 0; cursor:pointer;" />
                        <label style="margin:0px 0px 3px 5px; cursor:pointer; font-weight: normal">{{item}}</label>
                    </div>
                    <div style="clear: both;"></div>
                </div>
                <div style="margin-top:10px">
                    <label style="margin-right:15px">{{defaultDarkOrLightPrinting.text}}:</label>
                    <div *ngFor="let item of defaultDarkOrLightPrinting.value" style="padding-left:8px;display:inline-block; width:130px">
                        <input type="radio" name="DarkOrLightPrinting" [checked]="item==packageProfileAssetItem.density.value" [disabled]=true style="margin:2px 3px 0 0; cursor:pointer;" />
                        <label style="margin:0px 0px 3px 5px; cursor:pointer; font-weight: normal">{{item}}</label>
                    </div>
                    <div style="clear: both;"></div>
                </div>
                <div style="margin-top:10px">
                    <label style="margin-right:15px">{{defaultPrintContinuityStyle.text}}:</label>
                    <div *ngFor="let item of defaultPrintContinuityStyle.value" style="padding-left:10px;display:inline-block; width:130px">
                        <input type="radio" name="PrintContinuityStyle" [checked]="item==packageProfileAssetItem.continuity.value" [disabled]=true style="margin:2px 3px 0 0; cursor:pointer;" />
                        <label style="margin:0px 0px 3px 5px; cursor:pointer; font-weight: normal">{{item}}</label>
                    </div>
                    <div style="clear: both;"></div>
                </div>
            </div>

            <div id="dubugInfo" class="main-border" *ngIf="show==3">
                <div id="dubugInfoTable"  class="table-responsive" style="overflow-x:visible;">
                    <table class="uni-table" style="margin: 10px 0px;">
                        <tr>
                            <th class ='uni-th'>Keyword</th>
                            <th class ='uni-th'>Value</th>
                            <th class ='uni-th'>Description</th>
                        </tr>
                        <tr *ngFor="let item of runTimeParameters">
                            <td style="text-align:left;">{{item.name}}</td>
                            <td><input type="text" [(ngModel)]="item.value" name="{{item.name}}" [disabled]=true /></td>
                            <td style="text-align:left;">{{item.description}}</td>
                        </tr>
                    </table>
                </div>
            </div>
        </form>
    `,
    styleUrls: ['public/css/mainArea/breadcrumb.css', 'public/css/common/modal.css', 'public/css/mainArea/view.css', 'public/css/common/table.css', 'public/css/common/anchorButton.css']
})

export class ViewPublishedPackageProfile implements OnInit, OnDestroy {
    assetType: AssetType = AssetType.PackageProfile;
    packageProfileAssetItem: PackageProfileAssetItem = null;
    defaultImageUrl: string;
    index: number;
    private editMode = 'readOnly';
    private defaultName = null;
    defaultIntro = packageProfileDescription;
    // Default values will be moved to message.ts-----------------------------------------------------------------
    defaultTypeOfSymbology = defaultTypeOfSymbology;
    defaultPrintingTechnique = defaultPrintingTechnique;
    defaultSubstrate = defaultSubstrate;
    defaultFinish = defaultFinish;
    defaultFlexibility = defaultFlexibility;
    defaultCoarseness = defaultCoarseness
    defaultPerspective = defaultPerspective
    defaultWhatIsBeingPrinted = defaultWhatIsBeingPrinted
    defaultDarkOrLightPrinting = defaultDarkOrLightPrinting;
    defaultPrintContinuityStyle = defaultPrintContinuityStyle;
    runTimeParameters: any;
    //--------------------------------------------------------------------------------------------------------------------
    show: number = 1;
    showPrintingStyle: boolean = false;
    private subscription: Subscription;
    private querySubscription: Subscription;
    customPlugs: string[] = ['a'];

    familyId: string = null;
    familyName: string = null;
    productId: string = null;
    productName: string = null;

    constructor(private route: ActivatedRoute, private packageProfileSvc: DataService, private router: Router, private cdr: ChangeDetectorRef, private ms: MessageService, private userSvc: UsersService) {

    }

    ngOnInit() {
        this.defaultImageUrl = 'public/img/' + PackageProfileAssetItem.getDefaultImageUrl(this.assetType);
        this.subscription = this.route.params.subscribe(
            (params: any) => {
                if (params.hasOwnProperty('itemIndex')) {
                    this.index = +params['itemIndex'];
                }
                this.packageProfileAssetItem = new PackageProfileAssetItem(this.assetType, 'Loading...', '', '', '');
                this.packageProfileAssetItem.init();
                this.packageProfileSvc.onGetPublishedPackageProfile(this.index).subscribe(
                    data => this.onGetPackageProfile(data),
                    error => this.onGetError(error)
                );

                this.cdr.detectChanges();
            }
        );
        this.querySubscription = this.route.queryParams.subscribe(
            (queryParams: any) => {
                this.familyId = queryParams['familyId'];
                this.familyName = queryParams['familyName'];
                this.productId = queryParams['productId'];
                this.productName = queryParams['productName'];
            }
        );
    }

    onClose() {
        this.backToProduct();
    }

    publishedFamily() {
        this.router.navigate(['Operator/publishedFamily']);
    }

    backToFamily() {
        this.router.navigate(['Operator/viewPublishedFamily', this.familyId]);
    }

    backToProduct() {
        this.router.navigate(['Operator/viewPublishedProduct', this.productId], { queryParams: { familyName: this.familyName, familyId: this.familyId } });
    }

    display(event) {
        if (event.shiftKey) {
            this.showPrintingStyle = true;
            this.runTimeParameters = default_runTimeParameters;
            if (this.packageProfileAssetItem.engineParameters != null && this.packageProfileAssetItem.engineParameters.length > 0) {
                this.runTimeParameters = this.packageProfileAssetItem.engineParameters;
            } else {
                this.packageProfileAssetItem.engineParameters = default_runTimeParameters;
            }
        }
        else {
            this.showPrintingStyle = false;
        }
    }

    getDisplayName() {
        let name = this.packageProfileAssetItem.name;
        if (name != null && name.length > 30) {
            return name.slice(0, 29) + "...";
        }
        return name;
    }

    onGetPackageProfile(jsonData: JSON) {
        console.log(jsonData);
        const status = jsonData.hasOwnProperty("status") ? jsonData["status"] : '';
        if (status !== "SUCCESS") {
            this.onGetError(jsonData);
            return;
        } else {
            var data = jsonData["data"];
            if (data != null) {
                if (data instanceof Array) {
                    if (data.length > 0) {
                        this.packageProfileAssetItem = PackageProfileAssetItem.parse(data[0]);
                    }
                } else {
                    this.packageProfileAssetItem = PackageProfileAssetItem.parse(data);
                }
            }
        }
    }

    onGetError(jsonData: JSON) {
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