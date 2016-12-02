import { Component, OnInit, Output, EventEmitter, ViewChild, Input } from '@angular/core';
import { AssetItem } from '../common/assetItem';
import { AssetType } from '../common/assetType';
import { FormGroup, FormBuilder, NgForm, Validators } from '@angular/forms';
import { createUniqueNameValidator } from '../validators/assets.validators';
import { HighlightPipe } from './highlight_pipe';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { DescriptionEntry } from '../common/extendedDescriptionEntry';
import { UsersService } from '../services/User.service';

@Component({
    selector: 'uni-name-description',
    template: `
        <div style="display:flex; align-items:center;">
            <img src={{imageUrl}} style="width:64px; height:64px; margin:0 5px 0 0;">
            <span>{{intro}}</span>
            <div style="clear:both"> </div>
        </div>
        <br>
        <div class="form-group form-group-sm">
            <label for="name">Name </label>
            <div style="width:66%" class="has-feedback">
                <input type="text" class="form-control" placeholder="Enter Name" #itemName='ngForm' value="itemName" [(ngModel)]='assetItem.name' name="itemName" (ngModelChange)="onNameChange()" [formControl]="form.controls['itemName']" id="name" maxlength="255" pattern="[a-zA-Z0-9_ ]*" />
                <span *ngIf="!itemName.pending && itemName.valid" style="color: #3b73b9; z-index:0;" class="glyphicon glyphicon-ok form-control-feedback text-success" aria-hidden="true"></span>
                <span *ngIf="!itemName.pending && !itemName.valid" style="color: #a94442; z-index:0;" class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>
                <span *ngIf="itemName.pending" class="glyphicon glyphicon-refresh glyphicon-refresh-animate text-muted form-control-feedback" aria-hidden="true"></span>
            </div>
            <span class='error' *ngIf='itemName.control.dirty'>
                <div *ngIf="itemName.control.hasError('required')" style="color: #a94442" >The field is required</div>
                <div *ngIf="itemName.control.hasError('uniqueName')" style="color: #a94442" >The name must be unique</div>
            </span>
        </div>
        <div style="width:70%">
            <label for="desciption">Description </label>
            <div style="display:inline;">
                <input style="float:left; width : 94.5%" class="form-control" maxlength="255" type="text" id="desciption" [(ngModel)]='assetItem.description'
                    (ngModelChange)="onDescriptionChange($event)" name="descriptionControl" placeholder="Enter Description">
                <div style="float:left;  width : 3% ;margin-top:5px; margin-left:2px;">
                    <span style="font-size:22px; color:#3b73b9; cursor:pointer;" class="glyphicon glyphicon-list-alt" (click)="open()"></span>
                </div>
                <modal #modal style="color:#0458A2;">
                    <modal-header [show-close]="true" style="background: rgb(167, 176, 190)">
                        <h4 class="modal-title" style="text-align: center;color:white">Comments</h4>
                    </modal-header>
                    <modal-body>
                        <div id="extexdedDescriptionBody" style="display:inline-block;width:100%;">
                            <div class="inner-addon left-addon" style="margin-left: 65%; margin-bottom:10px;">
                                <i class="glyphicon glyphicon-search"></i>
                                <input class="form-control" type="text" id="searchBox" [(ngModel)]="searchText" name="search" style="width:100%;border-color:#3b73b9"
                                    placeholder="Search">
                            </div>
                            <div id="descriptionContent" style="overflow-y:auto; max-height:300px;">
                                <form *ngFor="let data of tempDescriptionData" style="margin-right: 5px;">
                                    <fieldset style="border:1px solid #3b73b9">
                                        <legend>
                                            <p class="legendText" [innerHTML]="data.user | highlight: searchText">{{data.user}}</p>
                                            created on
                                            <p class="legendText" [innerHTML]="data.date | highlight: searchText">{{data.date}}</p>
                                        </legend>
                                        <p [innerHTML]="data.description | highlight: searchText" style="margin:0 0 0 20px; padding-right:3px; overflow-y:auto; max-height:85px;">
                                            {{data.description}}
                                        </p>
                                    </fieldset>
                                </form>
                            </div>
                            <label style="margin-top: 10px;">New Comment</label>
                            <textarea rows="4" [(ngModel)]='newDescriptinEntry' name="desciptionContent" (ngModelChange)="onCommentsChange()" maxlength="4000"
                                (keyup)="0" style="color:#356cb5"  [disabled]=disable></textarea>
                            <button type="button" [ngClass]="{'uni-button':newDescriptinEntry!='','uni-button-disabled':newDescriptinEntry==''}" (click)='addDescription(newDescriptinEntry)'
                                [disabled]="newDescriptinEntry=='' || disable" style="margin-top:2%;">Add</button>
                            <br>
                        </div>
                    </modal-body>
                    <modal-footer>
                        <button type="button" class='uni-button' (click)="okClicked(newDescriptinEntry)" [disabled]=disable style="float: right;">Ok</button>
                        <button type="button" class='uni-button' (click)="canelDescription()" [disabled]=disable style="float: right;margin-right:4px">Cancel</button>
                    </modal-footer>
                </modal>
                <div style="clear:both"></div>
            </div>
        </div>
        <br>
    `,
    styleUrls: ['public/css/mainArea/view.css', 'public/css/common/modal.css', 'public/css/common/searchNfilter.css']
})

export class NameDescriptionComponent implements OnInit {

    @Input("intro") intro: string;
    @Input("assetType") assetType: AssetType;
    @Input("assetItem") assetItem: AssetItem;
    @Input("formCtrl") formCtrl: NgForm;
    @Input("imageUrl") imageUrl: string;
    @Input("disable") disable: boolean = false;
    form: FormGroup;

    displayName: string;
    index: number;

    nameControl = 'assetItem.nameField';
    descriptionControl = 'assetItem.descriptionField';
    formOutPut: EventEmitter<Object> = new EventEmitter();
    tempDescriptionData: any[];
    newDescriptinEntry: string = '';

    @ViewChild('modal')
    modal: ModalComponent;

    constructor(private userSvc: UsersService, private formBuilder: FormBuilder) {
        this.form = formBuilder.group({
            itemName: ['', Validators.required]
        })
    }

    ngOnInit() {
        if (this.assetItem === null) {
            this.assetItem = new AssetItem(this.assetType, '', '', this.imageUrl, '');
        }
        this.newDescriptinEntry = '';
        this.form.valueChanges.subscribe(value => {
            if (this.form.dirty) {
                this.formCtrl.form = this.form;
                this.assetItem.dirtyFlag = true;
            }
        })
    }

    onNameChange() {
        // if (this.assetItem.name.match((/[a-zA-Z0-9_]+/g))) {
        //     this.assetItem.name = this.assetItem.name.trim();
        // }
        // if (!this.assetItem.name.replace(/\s/g, '').length) {
        //     if (this.assetItem.name.match((/[a-zA-Z0-9_]+/g))) {
        //         this.assetItem.name = this.assetItem.name.trim();
        //     }
        // }
    }

    onDescriptionChange(eventValue: string) {
        this.assetItem.dirtyFlag = true;
        this.assetItem.description = eventValue;
    }

    onCommentsChange() {
        this.assetItem.dirtyFlag = true;
    }

    copyExtendedDescriptonArray(source: DescriptionEntry[], target: DescriptionEntry[]) {
        if (source != null && source.length > 0) {
            for (var index = 0; index < source.length; index++) {
                let entry: DescriptionEntry = source[index];
                if (entry != null) {
                    target.push(new DescriptionEntry(entry.user, entry.description, entry.date));
                }
            }
        }
    }

    open() {
        this.tempDescriptionData = [];
        this.copyExtendedDescriptonArray(this.assetItem.extendedDescription, this.tempDescriptionData);
        if (this.tempDescriptionData.length > 0) {
            this.tempDescriptionData.reverse();
        }
        this.modal.open();
    }

    addDescription(description) {
        var user = this.userSvc.getCurrentUserName();
        this.assetItem.dirtyFlag = true;
        if (this.tempDescriptionData.length > 0) {
            this.tempDescriptionData.reverse();
        }
        this.tempDescriptionData.push(new DescriptionEntry(user, description, new Date().toLocaleString()));
        this.tempDescriptionData.reverse();
        this.newDescriptinEntry = '';
    }

    okClicked(description) {
        this.assetItem.extendedDescription = [];
        if (description != null && description != undefined && description != '') {
            this.addDescription(description);
        }
        this.copyExtendedDescriptonArray(this.tempDescriptionData.reverse(), this.assetItem.extendedDescription);
        this.clear();
        this.close();
    }

    canelDescription() {
        this.clear();
        this.close();
    }

    clear() {
        this.tempDescriptionData = [];
        this.newDescriptinEntry = '';
    }

    close() {
        this.modal.close();
    }
}
