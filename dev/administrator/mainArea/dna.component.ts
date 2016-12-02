import { Component, Input, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http, Headers, RequestOptions } from '@angular/http';
import { DefaultConstants } from '../../common/default_values';
import { PreferenceItem } from '../../common/preferenceItem';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { dnaDescription, unlockDescription } from '../../common/messages';
import { DataService } from '../../services/Assets.service';
import { DnaItem } from '../../common/dnaItem';
import { AssetItem } from '../../common/assetItem';
import { MessageService } from '../../services/message.service';
import { Message } from '../../message-center/message';
import { DnaTableItem } from '../../common/dnaTableItem';

@Component({
    selector: 'unisecure-dna',
    template: `
    <div class="topnav uni-card2" style="position:fixed; top:68px; padding:0px; color :white; z-index:1">
    <div style="overflow:auto">
        <div style="overflow:hidden;height:44px;text-align:center;z-index:1">
            <a title="DNA">
                <i style="text-align:center;display:block;"></i>DNA
            </a>
        </div>
    </div>
    </div>
    <div>
    <ul style="margin-left:20px;" id="breadcrumb">
        <li><a (click)="homeSelected()">System Preferences</a> </li>
        <li><a> DNA </a> </li>
    </ul>
    </div>
     <div style="display: flex;">
        <i style="margin-left:30px;color:#3b73b9;cursor:pointer;" class="{{ visible ? 'glyphicon glyphicon-triangle-top gly-flip-vertical' : 'glyphicon glyphicon-triangle-top' }}" (click)="headerCollapse()"> </i>
        <div [hidden]="visible" style="display:flex; margin-left:10px;align-items:center;">
            <img  src={{image}} style="width:80px; height:80px; margin:0 25px 0 0; ">
            <span style="color:#3b73b9">{{defaultintro}} </span>
            <div style="clear:both"> </div>
        </div>
    </div>
    <message-center></message-center>
     <div class="panel-group" oncontextmenu="return false" style=" margin:10px;">
        <div class="panel panel-default" style=" margin:10px;">
            <div class="panel-heading" style="background:#3b73b9">
                <a data-toggle="collapse" class="topItemIconLink" (click)="isExpanded= !isExpanded" href="#dnaattributes" style="color: white; text-decoration: none;">
                    <i [ngClass]="{'glyphicon' : true, 'glyphicon-triangle-right' : true,
                    'pull-left':true, 'triangle-glyphicon':true, 'rotate':true, 'down':!isExpanded }" style="margin: 2px 5px 0 0;"></i>
                    <h4 class="panel-title" style="color:#fff">DNA Attribute</h4>
                </a>
            </div>
            <div id="dnaattributes" class="panel-collapse collapse in">
                <div class="panel-body">
                    <div class="row" style="clear:both; padding-left:50px; padding-bottom:15px">
                        <div style= "width: 95%;">
                            <a class="btn btn-md" role="button" id="newDNA" (click)=clickAddDnaAttribute()>
                                 <i class="glyphicon glyphicon-plus" style="color:#3b73b9"></i>Add New DNA Attribute
                            </a>                            
                        </div>
                        <table [hidden]=visibleTable class ='uni-table' id="dna-attributes">
                        <tr>
                            <th width=30%  class ='uni-th'>Name</th>
                            <th width=15%  class ='uni-th'>Data Type</th>
                            <th width=40%  class ='uni-th'>Validation or Value</th>
                            <th width=10%  class ='uni-th'>Able to Modify</th>
                            <th width=5%  class ='uni-th'> </th>
                        </tr>  
                        <tr *ngFor="let dna of dnaContent; let i=index">
                            <td *ngIf="!edit[i]" class ='uni-td'> {{dna.name}} </td>
                            <td *ngIf="edit[i]" class ='uni-td'>  <input class="form-control" type="text"  [(ngModel)]="dna.name" placeholder="Name" required /></td>
                            <td class ='uni-td' *ngIf="edit[i]"> 
                               <select [(ngModel)]="dna.datatype" style="height:34px; width:100%">
                                  <option *ngFor="let type of dataTypes" value="{{type}}">{{type}}</option>
                                </select>
                            </td>
                        <td class ='uni-td' *ngIf="!edit[i]"> 
                                 {{dna.datatype}}
                        </td>
                        <td *ngIf="!edit[i]" class ='uni-td'> {{dna.value}} </td>
                        <td *ngIf="edit[i]" class ='uni-td'>  <input class="form-control" type="text" [(ngModel)]="dna.value"  placeholder="Validation or value" required /></td>
                        <td *ngIf="edit[i]" > 
                            <div class="editswitch">
                                <input type="checkbox"  [(ngModel)]="dna.isModifiable" class="editswitch-checkbox" id="myeditswitchs" checked>
                                <label class="editswitch-label" for="myeditswitchs">
                                <span class="editswitch-inner"></span>
                                <span class="editswitch-switch"></span>
                                </label>  
                             </div>                              
                         </td> 
                         <td *ngIf="!edit[i]"> 
                            <p *ngIf="dna.isModifiable">  Yes</p>
                            <p *ngIf="!dna.isModifiable"> No </p>
                                                     
                         </td>
                         
                        <td>
                              <span *ngIf="!edit[i]" (click)= "editRow(i)" class="glyphicon glyphicon-edit" title="Edit DNA attributes" style="margin:5px 0 5px 5px; color:#4ec600 ; cursor:pointer;"></span>
                              <span *ngIf="edit[i]" (click)= "updateRow(i,dna)" class="glyphicon glyphicon-saved" title="Update DNA attributes" style="margin:5px 0 5px 5px; color:#4ec600 ; cursor:pointer;"></span>
                              <span (click)= "deleteRow(i)" title="Delete" class="glyphicon glyphicon-remove" style="margin:5px 0 5px 5px; color:#343332; cursor:pointer;"></span>
                        </td>
                        </tr> 
                         <tr [hidden]=showNewDnaAddRow>
                                <td class="uni-td"><input class="form-control" type="text" [(ngModel)]="newDnaName" placeholder="Name" required /></td>
                                <td class="uni-td">
                                <select style="height:34px; width:100%" [(ngModel)]="newDnaDatatype">
                                  <option *ngFor="let type of dataTypes" value="{{type}}">{{type}}</option>
                                </select>
                                </td>
                                <td class="uni-td">
                                    <input class="form-control" type="text" [(ngModel)]="newDnaValue"  placeholder="Validation or Value" required pattern="[a-zA-Z0-9_ ]*" />
                                </td>
                                <td class="uni-td">
                                <div class="editswitch">
                                     <input type="checkbox"  class="editswitch-checkbox" [(ngModel)]="newDnaEdit" id="neweditswitch" checked>
                                     <label class="editswitch-label" for="neweditswitch">
                                      <span class="editswitch-inner"></span>
                                      <span class="editswitch-switch"></span>
                                     </label>  
                                </div>                               
                                </td>
                                <td>
                                 <span (click)="createDna(newDnaName,newDnaDatatype,newDnaValue,newDnaEdit,newDnaSearch); newDnaName=null; newDnaDatatype=null; newDnaValue=null; newDnaEdit=false;" class="glyphicon glyphicon-saved" title="Create DNA" style="margin:5px 0 5px 5px; color:#343332; cursor:pointer;"></span>
                                 <span (click)="cancel(); newDnaName=null; newDnaDatatype=null; newDnaValue=null; newDnaEdit=false;" title="Delete" class="glyphicon glyphicon-remove" style="margin:5px 0 5px 5px; color:#343332; cursor:pointer;"></span>
                                </td>
                            </tr>                                       
                    </table>                 
                </div>         
            </div>
        </div>
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
                 <button type="button"  class='uni-button' (click)="cancelClicked()" style="float: right">{{cancelButtonLabel}}</button>
                 <button type="button"  class='uni-button' (click)="okClicked()" style="float: right;margin-right:5px">{{okButtonLabel}}</button>
            </modal-footer>
        </modal>  
    `,
    styleUrls: ['public/css/mainArea/breadcrumb.css', 'public/css/common/table.css', 'public/css/navigator/sence_assets.css', 'public/css/common/modal.css', 'public/css/mainArea/edit_assets.css'],
})

export class DNAComponent implements OnInit {

    visible: boolean = false;
    image: string = DefaultConstants.DEFAULT_IMAGE_FOLDER_PATH + PreferenceItem.getDefaultImageUrl('DNA');
    defaultintro = dnaDescription;
    dataTypes: Array<string> = ["String", "Date", "Date Time", "Time", "Enumeration", "Integer", "Number"];
    showNewDnaAddRow: boolean = true;
    editable: boolean = false;
    edit: boolean[] = [];
    visibleTable: boolean = false;
    dnaAttributes: any = [];
    dnaContent: any = [];
    newDna: DnaItem = null;
    customPlugs: string[] = ['a'];
    tempPkid: number;
    tempId: number;


    //-------------------------------Alert Modal -------------------------------------------

    @ViewChild('confirmModal')
    confirmModal: ModalComponent;
    confirmTitle: string = '';
    message: string = '';
    showCancel: boolean = false;
    okButtonLabel: string = 'Delete';
    cancelButtonLabel: string = 'No';

    constructor(public http: Http, private router: Router, private adminSvc: DataService, private ms: MessageService) {
        //empty
    }


    ngOnInit() {
        this.loadDnaAttributes();

    }

    loadDnaAttributes() {
        this.adminSvc.getDnaAttributes().subscribe(
            data => this.onGetDnaAttributes(data),
            error => this.onGetDnaError(error)
        )
    }

    onGetDnaAttributes(jsonData: JSON) {
        const status = jsonData.hasOwnProperty("status") ? jsonData["status"] : '';
        if (status != "SUCCESS") {
            this.onGetDnaError(jsonData);
        }
        else if (status == 'SUCCESS') {
            this.dnaAttributes = [];
            var dnaitems = jsonData["data"];
            if (dnaitems != null && dnaitems.length > 0) {
                for (var index = 0; index < dnaitems.length; index++) {
                    if (dnaitems[index] != null) {
                        this.dnaAttributes.push(dnaitems[index]);
                        this.dnaContent.push(new DnaTableItem(dnaitems[index].name, dnaitems[index].isModifiable, dnaitems[index].isSearchable, dnaitems[index].datatype, dnaitems[index].value));
                        this.edit[index] = false;
                    }
                }
                console.log(this.dnaAttributes);
                console.log(this.dnaContent);
            }
        }
    }

    onGetDnaError(jsonData: JSON) {
        console.log(jsonData);
    }

    homeSelected() {
        this.router.navigate(['Administrator']);
    }

    headerCollapse() {
        this.visible = !this.visible;
    }

    clickAddDnaAttribute() {
        if (this.visibleTable == false) {
            this.showNewDnaAddRow = false;
        }
        this.visibleTable = false;
    }

    updateRow(id: number, dna: any) {
        var pid = this.dnaAttributes[id].pkid;
        this.newDna = new DnaItem(true, '', '', 1);
        this.newDna.pkid = pid;
        this.newDna.objectName = dna.name;
        this.newDna.content = '';
        this.newDna.name = dna.name;
        this.newDna.isModifiable = dna.isModifiable;
        this.newDna.isSearchable = false;
        this.newDna.datatype = dna.datatype;
        this.newDna.value = dna.value;
        this.adminSvc.updateDnaAttributes(this.newDna).subscribe(
            data => this.onUpdateError(data),
            error => this.onUpdateError(error),
            () => { console.log('Authentication Complete') }
        );
        this.edit[id] = !this.edit[id];
    }


    editRow(id: number) {
        this.edit[id] = !this.edit[id];
    }

    deleteRow(id: number) {
        if (id != null && id != undefined) {
            var pid = this.dnaAttributes[id].pkid;
            this.tempPkid = pid;
            this.tempId = id;
            this.openModal("Are you sure you want to delete " + this.dnaContent[id].name + " ?", "", true);
        }
        else {
            alert("No id present");
        }
    }

    openModal(title: string, message: string, showCancel: boolean) {
        this.confirmTitle = title;
        this.message = message == null ? '' : message;
        this.showCancel = showCancel;
        this.okButtonLabel = this.showCancel ? "Delete" : "Ok";
        this.confirmModal.open();
    }

    okClicked() {
        this.confirmModal.close();
        if (this.showCancel) {
            if (this.okButtonLabel == "Delete") {
                this.adminSvc.deleteDnaAttribute(this.tempPkid).subscribe(
                    data => this.onDeleteError(data),
                    error => this.onDeleteError(error),
                    () => { console.log('Authentication Complete') }
                );
            }
        }

        this.tempPkid = null;
    }

    cancelClicked() {
        this.confirmModal.close();
    }

    createDna(newDnaName: string, newDnaDatatype: string, newDnaValue: string, newDnaEdit: boolean, newDnaSearch: boolean) {
        if (newDnaEdit == null) {
            newDnaEdit = false;
        }
        this.newDna = new DnaItem(true, '', '', 1);
        this.newDna.objectName = newDnaName;
        this.newDna.isModifiable = newDnaEdit;
        this.newDna.isSearchable = false;
        this.newDna.datatype = newDnaDatatype;
        this.newDna.value = newDnaValue;
        this.newDna.name = newDnaName;
        if (this.newDna.datatype == null) {
            var message = "Data Type can not be null or empty.";
            this.ms.displayRawMessage(new Message('error', message, null, null, null), this.customPlugs)
                .subscribe((value) => console.log(value));
        }
        else if (this.newDna.value == null) {
            var message = "Value can not be null or empty.";
            this.ms.displayRawMessage(new Message('error', message, null, null, null), this.customPlugs)
                .subscribe((value) => console.log(value));
        }
        else {
            this.adminSvc.addDnaAttribute(this.newDna).subscribe(
                data => this.onGetError(data),
                error => this.onGetError(error),
                () => { console.log('Authentication Complete') }
            );
        }
    }

    onDeleteError(jsonData: JSON) {
        console.log(jsonData);
        const status = jsonData.hasOwnProperty("status") ? jsonData["status"] : '';
        const message = jsonData.hasOwnProperty("message") ? jsonData["message"] : '';
        if (status == 'SUCCESS') {
            this.dnaAttributes.splice(this.tempId, 1);
            this.dnaContent.splice(this.tempId, 1);
            this.edit.splice(this.tempId, 1);
            this.tempId = null;
            this.ms.displayRawMessage(new Message(status, message, '', '', ''), this.customPlugs)
                .subscribe((value) => console.log(value));
        }
        else if (status == 'ERROR') {
            this.ms.displayRawMessage(new Message(status, JSON.parse(message).msgs[0].message, JSON.parse(message).msgs[0].action, JSON.parse(message).msgs[0].suggestion, JSON.parse(message).prefix), this.customPlugs)
                .subscribe((value) => console.log(value));
        }

    }
    onGetError(jsonData: JSON) {
        console.log(jsonData);
        const status = jsonData.hasOwnProperty("status") ? jsonData["status"] : '';
        const message = jsonData.hasOwnProperty("message") ? jsonData["message"] : '';
        if (status == 'SUCCESS') {
            this.dnaAttributes = [];
            this.dnaContent = [];
            this.edit = [];
            this.showNewDnaAddRow = !this.showNewDnaAddRow;
            this.loadDnaAttributes();
            this.ms.displayRawMessage(new Message(status, 'DNA Created', '', '', ''), this.customPlugs)
                .subscribe((value) => console.log(value));
        }
        else if (status == 'ERROR') {
            this.ms.displayRawMessage(new Message(status, JSON.parse(message).msgs[0].message, JSON.parse(message).msgs[0].action, JSON.parse(message).msgs[0].suggestion, JSON.parse(message).prefix), this.customPlugs)
                .subscribe((value) => console.log(value));
        }

    }

    onUpdateError(jsonData: JSON) {
        console.log(jsonData);
        const status = jsonData.hasOwnProperty("status") ? jsonData["status"] : '';
        const message = jsonData.hasOwnProperty("message") ? jsonData["message"] : '';
        if (status == 'SUCCESS') {
            this.ms.displayRawMessage(new Message(status, 'DNA Updated', '', '', ''), this.customPlugs)
                .subscribe((value) => console.log(value));
        }
        else if (status == 'ERROR') {
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
    deleteTop() {
        this.visibleTable = !this.visibleTable;
    }

    cancel() {
        this.showNewDnaAddRow = !this.showNewDnaAddRow;

    }


}