import { Component, ChangeDetectorRef, OnInit, ViewChild } from '@angular/core';
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
            <li><a (click)= "assetTypeSelected()">{{displayName}}</a> </li>
           <li>
                <a>		
                    <span class="glyphicon glyphicon-asterisk" style="margin-left:2px; font-size:12px" [hidden]=!packageProfileAssetItem.dirtyFlag></span>		
                    {{packageProfileAssetItem.name == null ? 'New Package Profile' : getDisplayName()}}		
                </a>
            </li> 
        </ul>
        <message-center></message-center>
        <form id="newPackage" class="assetForm uni-card-2" (ngSubmit)='onSave()' #f='ngForm'>
            <span class="glyphicon glyphicon-remove formClose" (click)="onClose()" title="Close"></span>
            <div class="fixed-action-btn" style="width:16%; top:200px; right:0px; margin-top:-10px;">
                <a class="btn-floating btn-large" title="Options">
                <span class="glyphicon glyphicon-pencil" style="margin:11px 0 0 11px; font-size:18px;"></span>
                </a>
                <ul style="padding-left:0px;">
                    <li>
                        <button type="submit" [disabled]="f.form.invalid || !packageProfileAssetItem.dirtyFlag" class="btn-floating" title="Save">
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
            <uni-name-description [assetType]=assetType [imageUrl]=defaultImageUrl [assetItem]=packageProfileAssetItem [formCtrl]="f" [intro]=defaultIntro></uni-name-description>
            <div style="margin-bottom:10px;">
                <label (click)="show=1; showPrintingStyle=false;" [class.changeBorder]="show==1" style="margin-right:20px; border-bottom: 4px solid #58595b; height:23px; cursor:pointer; min-width:120px; text-align:center;">Package Details</label>
                <label (click)="show=2; display($event)" [class.changeBorder]="show==2" style="margin-right:20px;  border-bottom: 4px solid #58595b; height:23px; cursor:pointer; min-width:110px; text-align:center;">Printing Style</label>
                <label (click)="show=3" [class.changeBorder]="show==3" style="margin-right:20px; border-bottom: 4px solid #58595b; height:23px; cursor:pointer; min-width:160px; text-align:center;" *ngIf="showPrintingStyle==true">Runtime Parameters</label>
            </div>
            <div id="packageDetails" class="main-border" style="width: 85%" *ngIf="show==1">
                <div style="width:48%; float:left;display:inline-block;margin-left:10px;margin-right:10px">
                    <div class="sub-border" >
                        <dropdown-help-checkbox [labelText]=defaultPrintingTechnique.text [content]=defaultPrintingTechnique.value [chkBox]=true [chkBoxLabel]=defaultPrintingTechnique.chkBoxLabel [help]=true [chkBoxValue]=packageProfileAssetItem.halftone.value [currentValue]=packageProfileAssetItem.technique.value (selectedValue)="packageProfileAssetItem.technique.value=$event; onContentChange()" (checkBoxValue)="packageProfileAssetItem.halftone.value=$event; onContentChange()"></dropdown-help-checkbox>
                    </div>
                    <div class="sub-border" style="margin-top:15px;padding-top:18px;">
                        <dropdown-help-checkbox  [labelText]=defaultTypeOfSymbology.text [content]=defaultTypeOfSymbology.value [chkBox]=true [chkBoxLabel]=defaultTypeOfSymbology.chkBoxLabel [help]=true [chkBoxValue]=packageProfileAssetItem.serialized.value [currentValue]=packageProfileAssetItem.symbology.value (selectedValue)="packageProfileAssetItem.symbology.value=$event; onContentChange()" (checkBoxValue)="packageProfileAssetItem.serialized.value=$event; onContentChange()"></dropdown-help-checkbox>
                            <label style="font-weight:100;">Symbology Size (in millimeters)</label>
                            <div style="display:flex;">
                                <label style="margin:10px;"> Width </label>
                                <input type="number" class="form-control" [(ngModel)]="packageProfileAssetItem.width.value" name="widthValue" (ngModelChange)="onContentChange()" style="width:25%;" placeholder="width" />
                                <label style="margin:10px;"> X </label>
                                <label style="margin:10px;"> Height </label>
                                <input type="number" class="form-control" [(ngModel)]="packageProfileAssetItem.height.value" name="heightValue" (ngModelChange)="onContentChange()" style="width:25%;" placeholder="height" />
                            </div>
                        
                        <div style="clear: both;"></div>
                    </div>
                </div>
                <div style="width:48% ; display:inline-block; margin-left:10px;">
                    <div class="sub-border">
                        <dropdown-help-checkbox  [labelText]=defaultFinish.text [content]=defaultFinish.value [chkBox]=true [chkBoxLabel]=defaultFinish.chkBoxLabel [chkBoxValue]=packageProfileAssetItem.wrapped.value [currentValue]=packageProfileAssetItem.finish.value (selectedValue)="packageProfileAssetItem.finish.value=$event; onContentChange()" (checkBoxValue)="packageProfileAssetItem.wrapped.value=$event; onContentChange()"></dropdown-help-checkbox>
                    </div>
                    <div class="sub-border">
                        <div>
                            <dropdown-help-checkbox  [labelText]=defaultSubstrate.text [content]=defaultSubstrate.value [currentValue]=packageProfileAssetItem.substrate.value (selectedValue)="packageProfileAssetItem.substrate.value=$event; onContentChange()"></dropdown-help-checkbox>
                        </div>
                        <div style="margin-top:10px">
                            <label style="margin-right:15px;width:80px">{{defaultFlexibility.text}}:</label>
                            <div *ngFor="let item of defaultFlexibility.value" style="padding-left:10px;display:inline-block;width:130px">
                                <input type="radio" name="flexibility" (click)="setFlexibility(item); onContentChange()" [checked]="item==packageProfileAssetItem.flexibility.value" style="margin:2px 3px 0 0; cursor:pointer;" />
                                <label style="margin:0px 0px 3px 5px; cursor:pointer; font-weight: normal">{{item}}</label>
                            </div>
                            <div style="clear: both;"></div>
                        </div>
                        <div style="margin-top:10px">
                            <label style="margin-right:15px;width:80px">{{defaultCoarseness.text}}:</label>
                            <div *ngFor="let item of defaultCoarseness.value" style="padding-left:10px;display:inline-block; width:130px">
                                <input type="radio" name="coarseness" (click)="setCoarseness(item); onContentChange()" [checked]="item==packageProfileAssetItem.coarseness.value" style="margin:2px 3px 0 0; cursor:pointer;" />
                                <label style="margin:0px 0px 3px 5px; cursor:pointer; font-weight: normal">{{item}}</label>
                            </div>
                            <div style="clear: both;"></div>
                        </div>
                        <div style="margin-top:10px;margin-bottom:7px">
                            <label style="margin-right:15px;width:80px">{{defaultPerspective.text}}:</label>
                            <div *ngFor="let item of defaultPerspective.value" style="padding-left:10px;display:inline-block;width:130px">
                                <input type="radio" name="perspective" (click)="setPerspective(item); onContentChange()" [checked]="item==packageProfileAssetItem.perspective.value" style="margin:2px 3px 0 0; cursor:pointer;" />
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
                        <input type="radio" name="printObject" (click)="setWhatIsBeingPrinted(item); onContentChange()" [checked]="item==packageProfileAssetItem.print.value" style="margin:2px 3px 0 0; cursor:pointer;" />
                        <label style="margin:0px 0px 3px 5px; cursor:pointer; font-weight: normal">{{item}}</label>
                    </div>
                    <div style="clear: both;"></div>
                </div>
                <div style="margin-top:10px">
                    <label style="margin-right:15px">{{defaultDarkOrLightPrinting.text}}:</label>
                    <div *ngFor="let item of defaultDarkOrLightPrinting.value" style="padding-left:8px;display:inline-block; width:130px">
                        <input type="radio" name="DarkOrLightPrinting" (click)="setPrinting(item); onContentChange()" [checked]="item==packageProfileAssetItem.density.value" style="margin:2px 3px 0 0; cursor:pointer;" />
                        <label style="margin:0px 0px 3px 5px; cursor:pointer; font-weight: normal">{{item}}</label>
                    </div>
                    <div style="clear: both;"></div>
                </div>
                <div style="margin-top:10px">
                    <label style="margin-right:15px">{{defaultPrintContinuityStyle.text}}:</label>
                    <div *ngFor="let item of defaultPrintContinuityStyle.value" style="padding-left:10px;display:inline-block; width:130px">
                        <input type="radio" name="PrintContinuityStyle" (click)="setPrintStyle(item); onContentChange()" [checked]="item==packageProfileAssetItem.continuity.value" style="margin:2px 3px 0 0; cursor:pointer;" />
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
                            <td><input type="text" [(ngModel)]="item.value" name="{{item.name}}" (ngModelChange)="onContentChange()" /></td>
                            <td style="text-align:left;">{{item.description}}</td>
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
    styleUrls: ['public/css/mainArea/breadcrumb.css', 'public/css/common/modal.css', 'public/css/mainArea/view.css', 'public/css/common/table.css', 'public/css/common/anchorButton.css']
})

export class PackageProfileEditComponent implements OnInit {
    assetType: AssetType = AssetType.PackageProfile;
    packageProfileAssetItem: PackageProfileAssetItem = null;
    displayName: string;
    defaultImageUrl: string;
    index: number;
    private editMode = 'create';
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
    customPlugs: string[] = ['a'];

    //-----------------------------------------------ConfirmModal-------------------
    @ViewChild('confirmModal')
    confirmModal: ModalComponent;
    confirmTitle: string = '';
    message: string = '';
    showCancel: boolean = false;
    okButtonLabel: string = 'Ok';
    cancelButtonLabel: string = 'No';
    //-----------------

    constructor(private route: ActivatedRoute, private packageProfileSvc: DataService, private router: Router, private cdr: ChangeDetectorRef, private ms: MessageService, private userSvc: UsersService) {

    }

    ngOnInit() {
        this.defaultImageUrl = 'public/img/' + PackageProfileAssetItem.getDefaultImageUrl(this.assetType);
        this.displayName = PackageProfileAssetItem.getDisplayName(this.assetType);
        this.subscription = this.route.params.subscribe(
            (params: any) => {
                if (params.hasOwnProperty('itemIndex')) {
                    this.editMode = 'edit';
                    this.index = +params['itemIndex'];
                }
                if (this.editMode === 'edit') {
                    this.packageProfileAssetItem = new PackageProfileAssetItem(this.assetType, 'Loading...', '', '', '');
                    this.packageProfileAssetItem.init();
                    this.packageProfileSvc.getPackageProfile(this.assetType, this.index).subscribe(
                        data => this.onGetPackageProfile(data),
                        error => this.onGetError(error)
                    );
                }
                else {
                    this.packageProfileAssetItem = new PackageProfileAssetItem(this.assetType, this.defaultName, '', this.defaultImageUrl, '');
                    this.packageProfileAssetItem.init();
                }
                this.cdr.detectChanges();
            }
        );
    }

    onContentChange() {
        this.packageProfileAssetItem.dirtyFlag = true;
    }

    onCancel() {
        this.router.navigate(['Designer/assets', this.assetType]);
    }

    onClose() {
        if (this.packageProfileAssetItem.dirtyFlag == true) {
            this.openModal("Do you want to save the changes you made to \'" + this.packageProfileAssetItem.name + "'?", "", true);
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
        this.onCancel()
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

    onSave() {
        if (this.packageProfileAssetItem.dirtyFlag == false) {
            this.save(true);
        }
        else {
            this.save(false);
        }
    }

    save(showDialog: boolean) {
        this.packageProfileAssetItem.updateProfileParameters();
        this.packageProfileAssetItem.updateJSONObject();
        console.log(this.packageProfileAssetItem);
        if (this.editMode === 'edit') {
            this.packageProfileAssetItem.updatorName = this.userSvc.getCurrentUserName();
            this.packageProfileSvc.postPackageProfile(this.packageProfileAssetItem).subscribe(
                data => this.onAddEntity(data, showDialog),
                error => this.onGetError(error)
            );
        }
        else {
            this.packageProfileSvc.putPackageProfile(this.packageProfileAssetItem).subscribe(
                data => this.onAddEntity(data, showDialog),
                error => this.onGetError(error)
            );
        }
        this.packageProfileAssetItem.dirtyFlag = false;
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
            this.packageProfileAssetItem.dirtyFlag = false;
        }
    }

    onAddEntity(jsonData: JSON, showDialog: boolean) {
        const status = jsonData.hasOwnProperty("status") ? jsonData["status"] : '';
        if (status !== "SUCCESS") {
            this.onGetError(jsonData);
            if (!showDialog) {
                if (this.editMode === 'edit') {
                    var displayMsg = "Failed to update \'" + this.packageProfileAssetItem.name + '\'.';
                } else {
                    var displayMsg = "Failed to create \'" + this.packageProfileAssetItem.name + '\'.';
                }
            }
        }
        else if (!showDialog) {
            if (this.editMode === 'edit') {
                var displayMsg = "Package Profile '" + this.packageProfileAssetItem.name + "' is updated successfully.";
            } else {
                var displayMsg = "New Package Profile '" + this.packageProfileAssetItem.name + "' is created successfully.";
                this.editMode = 'edit';
            }
            this.packageProfileAssetItem.dirtyFlag = false;
            this.onGetPackageProfile(jsonData);
        }
        this.ms.displayRawMessage(new Message(status, displayMsg, '', '', ''), this.customPlugs)
            .subscribe((value) => console.log(value));
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

    updateEngineParameters() {
        this.packageProfileAssetItem.engineParameters = this.runTimeParameters;
    }

    setFlexibility(value) {
        this.packageProfileAssetItem.flexibility.value = value;
    }

    setCoarseness(value) {
        this.packageProfileAssetItem.coarseness.value = value;
    }

    setPerspective(value) {
        this.packageProfileAssetItem.perspective.value = value;
    }

    setWhatIsBeingPrinted(value) {
        this.packageProfileAssetItem.print.value = value;
    }

    setPrinting(value) {
        this.packageProfileAssetItem.density.value = value;
    }

    setPrintStyle(value) {
        this.packageProfileAssetItem.continuity.value = value;
    }

}