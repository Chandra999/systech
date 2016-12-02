import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from '../../services/Assets.service';
import { OperatorAssetItem } from '../../common/operator_assetItem';
import { AssetType } from '../../common/assetType';
import { setUserName, setSerial, ActivityTypes } from '../../common/newActivityAction';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { ActionRecord } from '../../common/action_record';
import { actionDescription, action_filterCriteria_Description } from '../../common/messages';
import { OperatorIntegraionService } from '../../services/OperatorIntegraion.service';
import { RunNow, ReportItem, DataList } from '../../common/operatorRunNow';
import * as moment from 'moment';
import { MessageService } from '../../services/message.service';
import { Message } from '../../message-center/message';
import { UsersService } from '../../services/User.service';
import { Subscription } from "rxjs/Rx";
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'action-new-activity',
    template: `
        <ul id='breadcrumb' >
            <li><a (click)= 'assetTypeSelected()'>{{assetType}}</a> </li>
            <li>
                <a>
                   <span class="glyphicon glyphicon-asterisk" style="margin-left:2px; font-size:12px" [hidden]=!operatorAssetItem.dirtyFlag></span>
                   {{operatorAssetItem.name == null ? 'New Action Activity' : getDisplayName()}}
                </a>
            </li>
        </ul>
        <message-center></message-center>
        <br>
        <form id="newActivity" class="assetForm uni-card-2" #actionFrom="ngForm" (ngSubmit)='onSave()'>
            <span class="glyphicon glyphicon-remove formClose" (click)="onClose()" title="Close"></span>
            <div class="fixed-action-btn" style="width:16%; top:185px; right:0px; margin-top:-10px">
                <a class="btn-floating btn-large" title="Options">
                    <span class="glyphicon glyphicon-pencil" style="margin:11px 0 0 11px; font-size:18px;"></span>
                </a>
                <ul style="padding-left:0px;">
                    <li>
                        <button type="button" class="btn-floating" [disabled]="actionFrom.form.invalid" (click)="onRunNow()" title="Run Now">
                            <span class="glyphicon glyphicon-play" style="margin-top:10px;"></span>
                        </button>
                    </li>
                    <li>
                        <button type="submit" [disabled]="actionFrom.form.invalid || !operatorAssetItem.dirtyFlag" class="btn-floating" title="Save">
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
            <div>
                <uni-name-description [assetType]=assetType [assetItem]=operatorAssetItem [intro]=defaultIntro [imageUrl]=defaultImageUrl [formCtrl]="actionFrom"></uni-name-description>
                <div class="panel-group" oncontextmenu="return false">
                    <div class="panel panel-default">
                        <div class="panel-heading">
                            <a data-toggle="collapse" class="topItemIconLink" (click)="isExpandedFC = !isExpandedFC" href="#criteria" style="color:white; text-decoration:none;">
                                <i  [ngClass]="{'glyphicon' : true, 'glyphicon-triangle-right' : true,
                                'pull-left':true, 'triangle-glyphicon':true, 'rotate':true, 'down':!isExpandedFC }" style="margin: 2px 5px 0 0;"></i>
                                <h4 class="panel-title">Filtering Criteria</h4>
                            </a>
                        </div>
        
                        <div id="criteria" class="panel-collapse collapse in">
                            <div class="panel-body">
                                <p style="margin-top:15px;">{{filterCriteriaIntro}}</p>
                                <br>
                                <label for="activityType">Activity Type</label>
                                <div style="width:66.5%">
                                    <select [ngModel]="operatorAssetItem.requestType" name="operatorAssetItemRequestType" (change)="onRequestChange($event)" class="form-control" placeholder="Select Activity Type" required>
                                        <option *ngFor="let type of activityTypes; let i = index" value="{{type.typeName}}"  [selected]="checkSelect(type.typeName,i)"  >{{type.typeName}}</option>
                                    </select>
                                </div>
                                
                                <div class="row" style="margin:25px 0 0 0;" id="itemAuthentication" *ngIf="operatorAssetItem.requestType=='Item Authentication'">
                                    <label style="display:inline-flex; cursor:pointer;">
                                        <input type="radio" name="options" (click)="updateRequestSubType('User Name')" [checked]="'User Name' === operatorAssetItem.requestSubType" style="margin: 2px 3px 0 0;" >
                                        <span style="font-weight:100;">User Name</span>
                                    </label>
                                    <label style="margin-left:60px; display:inline-flex; cursor:pointer;">
                                        <input type="radio" name="options" (click)="updateRequestSubType('Email')" [checked]="'Email' === operatorAssetItem.requestSubType" style="margin: 2px 3px 0 0;" >
                                        <span style="font-weight:100;">Email</span>
                                    </label>
                                    <div id="keyValue">
                                        <label for="userName" style="display:block; margin-top:20px;">{{operatorAssetItem.requestSubType}}</label>
                                          <div *ngIf="operatorAssetItem.requestSubType=='User Name'" style="width:66.5%; display:inline-block;">
                                            <input class="form-control" type="text" id="txtBoxUserName" pattern="[a-zA-Z0-9_]*" [(ngModel)]="operatorAssetItem.singleValue" name="operatorAssetsingleValue" (ngModelChange)="onContentChange()"  />
                                        </div>
                                        <div *ngIf="operatorAssetItem.requestSubType=='Email'" style="width:66.5%; display:inline-block;">
                                            <input class="form-control" type="email" id="txtBoxUserName" [(ngModel)]="operatorAssetItem.singleValue" name="operatorAssetsingleValue" (ngModelChange)="onContentChange()"  />
                                        </div>
                                    </div>
                                </div>
                                 <div class="row" style="margin:25px 0 0 0;" id="itemAcquisition" *ngIf="operatorAssetItem.requestType =='Item Acquisition'">
                                    <label for="family">Family</label>
                                    <div style="width:66.5%">
                                        <select [(ngModel)]="operatorAssetItem.family" name="operatorAssetItemFamily" (ngModelChange)="onContentChange()" class="form-control" required>
                                            <option selected>Any</option>
                                        </select>
                                    </div>
                                    <label style="display:inline-flex; margin:25px 0 20px 0; cursor:pointer;">
                                        <input type="radio" name="options" (click)="updateRequestSubType('Serial')" [checked]="'Serial' === operatorAssetItem.requestSubType" style="margin: 2px 3px 0 0;"/>
                                        <span style="font-weight:100;">Serial</span>
                                    </label>
                                    <label style="display:inline-flex; margin:25px 0 20px 60px; cursor:pointer;">
                                        <input type="radio" name="options" (click)="updateRequestSubType('UPC')" [checked]="'UPC' === operatorAssetItem.requestSubType" style="margin: 2px 3px 0 0;">
                                        <span style="font-weight:100;">UPC</span>
                                    </label>
                                   
                                    <div id="filterBySerialOrUPC"  >
                                        <label for="serial(s)" *ngIf="'Serial' === operatorAssetItem.requestSubType">Serial(s): </label>
                                        <label for="upcs" *ngIf="'UPC' === operatorAssetItem.requestSubType">UPC(s): </label>
                                        <span *ngFor="let v of operatorAssetItem.value">
                                            <span class="label label-info" style="font-size:100%; font-weight:100; display:inline-flex; margin-top:5px; background-color:#8dc63f;cursor:default;" title="{{v}}">
                                                <p style="width:60px;overflow:hidden;margin:0px;text-overflow:ellipsis;">{{v}}</p>
                                                <span class="glyphicon glyphicon-remove" style="font-size:10px; margin:2.3px 0 0 3px; cursor:pointer;" (click)="removeValue(v)" aria-hidden="true" title="Remove this value"></span>
                                            </span>&nbsp;
                                        </span>
                                        <span *ngIf="addAreaDisplayed">
                                            <span style="display:inline-flex;">
                                                <input class="form-control" [(ngModel)]="valueToAdd" [ngModelOptions]="{standalone: true}" (ngModelChange)="onContentChange()" maxlength="255" style="width:50%;height:25px;margin-top: 5px;" required/>
                                                <em class="glyphicon glyphicon-ok text-muted" aria-hidden="true" (click)="addValue(valueToAdd);valueToAdd='';" style="cursor:pointer;margin:10px 0 0 3px;"></em>
                                            </span>
                                        </span>
                                        <span *ngIf="!addAreaDisplayed">
                                            <span style="display:inline-block; margin-left: 5px;cursor:pointer;">
                                                <em class="glyphicon glyphicon-plus" aria-hidden="true" (click)="displayAddArea()" title="Click to add a new value"></em>
                                            </span>
                                        </span>
                                    </div>
                                </div> 
                                               
                                <div class="row" style="margin-left:0px;">
                                    <div style="margin-top:20px; display:flex" id="selectDates">
                                         <div style="width:32%; display:inline-block;" id="selectFromDate">
                                            <label for="selectEndDate">From Date</label>
                                            <div class="input-group">
                                                <input class="form-control" placeholder="yyyy-mm-dd" name="fdp" [(ngModel)]="displayFromDate" (ngModelChange)="setDate(displayFromDate, 'from')" ngbDatepicker [dayTemplate]="customDay" [markDisabled]="isDisabled" #f="ngbDatepicker">
                                                <div class="input-group-addon" (click)="f.toggle()" >
                                                    <span class="glyphicon glyphicon-calendar" style="cursor:pointer;"></span>
                                                </div>
                                            </div>
                                        </div>
                                    <div style="width:32%; display:inline-block;" id="selectToDate">
                                        <label for="selectEndDate">To Date</label>
                                        <div class="input-group">
                                            <input class="form-control" placeholder="yyyy-mm-dd" name="tdp" [(ngModel)]="displayToDate" (ngModelChange)="setDate(displayToDate, 'end')" ngbDatepicker [dayTemplate]="customDay" [markDisabled]="isDisabled" #t="ngbDatepicker">
                                            <div class="input-group-addon" (click)="t.toggle()" >
                                                <span class="glyphicon glyphicon-calendar" style="cursor:pointer;"></span>
                                            </div>
                                         </div>
                                    </div>
                                </div>
                                    
                                <div style="margin-top:40px;" id="preview">
                                    <button type="button" class="uni-button" (click)="onPreview()">Preview</button>
                                </div>
                                <div id="previewTable"  class = "table-responsive" style="overflow-x:visible;">
                                        <table class="uni-table" style="margin: 10px 0px;">
                                            <tr>
                                                <th *ngFor = "let column of getDisplayColumns()">{{column}}</th>
                                            </tr>
                                            <tr *ngFor="let item of previewRecords">
                                                <td *ngFor="let value of getDiaplyValues(item)"> <div style="min-height: 15px; ">{{value}}</div></td>
                                            </tr>
                                        </table> 
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="panel panel-default">
                        <div class="panel-heading">
                            <a data-toggle="collapse" class="topItemIconLink" (click)="isExpandedATC= !isExpandedATC" href="#apply" style="color:white; text-decoration:none;">
                                <i [ngClass]="{'glyphicon' : true, 'glyphicon-triangle-right' : true,
                                'pull-left':true, 'triangle-glyphicon':true, 'rotate':true, 'down':!isExpandedATC }" style="margin: 2px 5px 0 0;"></i>
                                <h4 class="panel-title">Apply These Changes</h4>
                            </a>
                        </div>
                        <div id="apply" class="panel-collapse collapse in">
                            <div class="panel-body">
                                <label for="newState" style="margin-top:20px;">New State</label>
                                <div style="width:31%">
                                    <select [(ngModel)]="operatorAssetItem.action" name="operatorAssetItemAction" (ngModelChange)="onContentChange()" class="form-control" required>
                                        <option value="Archive">Archive</option>
                                        <option value="Delete">Delete</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="panel panel-default">
                        <div class="panel-heading">
                            <a data-toggle="collapse" class="topItemIconLink" (click)="isExpandedR= !isExpandedR" href="#reports" style="color:white; text-decoration:none;">
                                <i [ngClass]="{'glyphicon' : true, 'glyphicon-triangle-right' : true,
                                'pull-left':true, 'triangle-glyphicon':true, 'rotate':true, 'down':!isExpandedR }" style="margin: 2px 5px 0 0;"></i>
                                <h4 class="panel-title">Reports</h4>
                            </a>
                        </div>
                        <div id="reports" class="panel-collapse collapse in">
                            <div class="panel-body" *ngIf="reportData!=null">
                                <div>    
                                    <span style="position: relative;left: 14px;float: right;">
                                        <label for="activityType" style="color:#58595b;">All Reports</label><span class="form-control" style="display:inline;background-color:#58595b;border:0px solid #58595b;padding:2px;color:white;margin:15px;">{{aType}}</span>
                                        <label for="completed" style="color:#4ec600;">Completed</label><span class="form-control"  style="display:inline;background-color:#4ec600;border:0px solid #4ec600;padding:2px;color:white;margin:15px;">{{completed}}</span>
                                        <label for="failed" style="color:#a94442">Failed</label><span class="form-control" style="display:inline;background-color:#a94442;border:0px solid #a94442;padding:2px;color:white;margin:15px;">{{failed}}</span>
                                    </span>
                                </div>
                                <table class="uni-table" style="margin: 10px 0px;width:100%;">
                                    <tr>
                                        <th style="width:33%;">State</th>
                                        <th style="width:33%;">Start Time</th>
                                        <th style="width:33%;">Elapsed Time</th>
                                    </tr>
                                    <tr *ngFor="let allReports of reportData; let i=index">
                                        <td COLSPAN=3 width=100% style="margin:0px;padding:0px; padding:0 0 0 0px !important;" >
                                            <div style= "display: table; width:100%; height:30px">
                                                <div style="display:table-cell; width:33%; border-right: 1px solid white; padding:5px;  text-overflow: ellipsis;">
                                                    <a (click)="allReports.openFlag = !allReports.openFlag;">
                                                        <i [ngClass]="{'glyphicon' : true, 'glyphicon-triangle-right' : true, 'pull-left':true, 'triangle-glyphicon':true, 'rotate':true, 'down':allReports.openFlag }"
                                                        style="margin: 2px 5px 0 0; color:#343332; cursor:pointer;">
                                                        </i>
                                                        <label style="color:#343332; text-overflow: ellipsis; cursor:pointer;">{{allReports.heading.state}}</label>
                                                    </a>
                                                </div>
                                                <div style="display:table-cell; width:33%; border-right: 1px solid white;padding:5px">{{allReports.heading.TimeStarted}}</div>
                                                <div style="display:table-cell; width:33%; border-right: 1px solid white;padding:5px">{{allReports.heading.ElapsedTime}}</div>  
                                            </div>
                                            <div *ngIf="allReports.openFlag==true" style="width:100%; padding:0px; margin:0px">            
                                                <div style="border:2px solid #3b73b9">
                                                        <div style="background-color: #3b73b9;color: white;height: 26px;"><span style="position:relative;top: 6px;">Overview</span></div>
                                                        <div style="height:50px;position: relative; background-color: white;">
                                                            <div style="padding:10px 15px;">
                                                                <div class="row" style="position: relative;bottom: 6px;">
                                                                    <div class="col-xs-6">Cloud : {{allReports.record.report.Overview.Cloud}} </div>
                                                                    <div class="col-xs-6"></div>
                                                                </div>
                                                                <div class="row">
                                                                    <div class="col-xs-6">Start time : {{allReports.record.report.Overview.TimeStarted}}</div>
                                                                    <div class="col-xs-6">Elapsed Time : {{allReports.record.report.Overview.ElapsedTime}} </div>
                                                                </div>
                                                            </div>    
                                                        </div>
                                                        <div style="background-color: #3b73b9;color: white;height: 26px;"><span style="position:relative;top: 6px;">Criteria</span></div>
                                                        <div style="height:50px;position: relative; background-color: white;">
                                                            <div style="padding:10px 15px;">
                                                                <div class="row" style="position: relative;bottom: 6px;">
                                                                    <div class="col-xs-6">Activity : {{allReports.record.report.Criteria.requestType}}</div>
                                                                    <div class="col-xs-6">{{allReports.record.report.Criteria.requestSubType}} :  {{allReports.record.report.Criteria.value}}</div>
                                                                </div>
                                                                <div class="row">
                                                                    <div class="col-xs-6">From Date : {{allReports.record.report.Criteria.fromDate}}</div>
                                                                    <div class="col-xs-6">End Date : {{allReports.record.report.Criteria.endDate}}</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    <div style="background-color: #3b73b9;color: white;height: 26px;"><span style="position:relative;top: 6px;">Action</span></div>
                                                        <div style="position: relative; background-color: white;">
                                                            <div style="padding:10px 15px;">
                                                                <div class="row">
                                                                    <div class="col-xs-6">Action   :{{allReports.record.report.Action}} </div>
                                                                </div>
                                                            </div> 
                                                        </div>
                                                    <div style="background-color: #3b73b9;color: white;height: 26px;"><span style="position:relative;top: 6px;">Summary</span></div>
                                                    <div style="position: relative; background-color: white;">
                                                        <div style="padding:10px 15px;">
                                                            <div class="row">
                                                                <div class="col-xs-6">Scan(s) Processed : {{allReports.record.report.Summary.scanProcessed}}</div>
                                                            </div>
                                                        </div>        
                                                    </div>  
                                                </div>
                                            </div> 
                                        </td>
                                    </tr>
                                </table> 
                            </div>
                            <div class="panel-body" *ngIf="reportData==null">
                                <hr style="margin:0 50px 10px 50px;">
                                <label style="font-weight:700; font-size:18px; margin-left:30%; color:#8dc63f;">No Report Generated</label>
                                <hr style="margin:10px 50px 0 50px;">
                            </div>
                        </div>
                    </div>
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
                 <button type="button" [hidden] = "!showCancel" class='uni-button' (click)="cancelClicked()" style="float: right">{{cancelButtonLabel}}</button>
                 <button type="button" [disabled]="actionFrom.form.invalid" class='uni-button' (click)="okClicked()" style="float: right;margin-right:5px">{{okButtonLabel}}</button>
            </modal-footer>
        </modal>
        <modal #runNowModal style="color:#0458A2;">
            <modal-header [show-close]="true" style="height:30px !important;"></modal-header>
            <modal-body>
                <div *ngIf="response==null" class='container2'>
                   <a style="font-size:x-large;">
                        <span class="glyphicon glyphicon-refresh glyphicon-refresh-animate" style="color:#8dc63f;"></span>
                        {{loadingMsg}}
                    </a>
                </div>
                <div *ngIf="response!=null" class='container2' style="font-size:15px;">
                    <div style="border:2px solid #3b73b9">
                        <div style="background-color:#3b73b9; color:white;"><label style="padding:5px 0 0 10px;">Overview</label></div>
                        <div style="position:relative; background-color:white;">
                            <div style="padding:10px 15px;">
                                <div class="row">
                                    <div class="col-xs-6">Cloud : {{reportItem.state}}</div>
                                </div>
                                <div class="row">
                                    <div class="col-xs-6">Start time : {{reportItem.report.Overview.TimeStarted}}</div>
                                    <div class="col-xs-6">Elapsed Time : {{reportItem.report.Overview.ElapsedTime}} </div>
                                </div>
                            </div>    
                        </div>
                        <div style="background-color: #3b73b9;color:white;"><label style="padding:5px 0 0 10px;">Criteria</label></div>
                        <div style="position: relative; background-color: white;">
                            <div style="padding:10px 15px;">
                                <div class="row">
                                    <div class="col-xs-6">Activity : {{reportItem.report.Criteria.requestType}}</div>
                                    <div class="col-xs-6">{{reportItem.report.Criteria.requestSubType}} : {{reportItem.report.Criteria.value}}</div>
                                </div>
                                <div class="row">
                                    <div class="col-xs-6" style="padding:0 0 0 15px;">From Date : {{reportItem.report.Criteria.fromDate}}</div>
                                    <div class="col-xs-6"style="padding:0 0 0 15px;">End Date : {{reportItem.report.Criteria.endDate}}</div>
                                </div>
                            </div>
                        </div>
                        <div style="background-color: #3b73b9;color:white;"><label style="padding:5px 0 0 10px;">Action</label></div>
                        <div style="position: relative; background-color: white;">
                            <div style="padding:10px 15px;">
                                <div class="row">
                                    <div class="col-xs-6">Action : {{reportItem.report.Action}} </div>
                                </div>
                            </div> 
                        </div>
                        <div style="background-color: #3b73b9;color:white;"><label style="padding:5px 0 0 10px;">Summary</label></div>
                        <div style="position: relative; background-color: white;">
                            <div style="padding:10px 15px;">
                                <div class="row">
                                    <div class="col-xs-6">Scan(s) Processed : {{reportItem.report.Summary.scanProcessed}}</div>
                                </div>
                            </div>        
                        </div>  
                    </div>
                </div>     
            </modal-body>
            <modal-footer>
                 <button type="button" class='uni-button' (click)="runNowModal.close()" style="float: right;margin-right:5px">Ok</button>
            </modal-footer>
        </modal>
    `,
    styleUrls: ['public/css/mainArea/breadcrumb.css', 'public/css/common/table.css', 'public/css/mainArea/view.css', 'public/css/navigator/sence_assets.css', 'public/css/common/anchorButton.css', 'public/css/common/modal.css']
})

export class ActionNewActivity implements OnInit {
    //-----------------------------------------------Declaration-------------------
    assetType: AssetType = AssetType.Action;
    operatorAssetItem: OperatorAssetItem = null;
    private editMode = 'create';
    addAreaDisplayed: boolean;
    index: number;
    defaultImageUrl: string;
    previewRecords: ActionRecord[] = [];
    @ViewChild('confirmModal')
    confirmModal: ModalComponent;
    @ViewChild('runNowModal')
    runNowModal: ModalComponent;
    confirmTitle: string = '';
    message: string = '';
    showCancel: boolean = false;
    okButtonLabel: string = 'Ok';
    cancelButtonLabel: string = 'No';
    //descriptions
    private defaultIntro = actionDescription;
    private filterCriteriaIntro = action_filterCriteria_Description;

    headerValue: string[] = [];

    response = null;
    loadingMsg = "Loading...";
    reportItem: ReportItem = null;
    reportData: Array<any> = null;
    customPlugs: string[] = ['a'];
    private subscription: Subscription;

    //-----------------------------------------------Declaration-------------------

    //-----------------------------------------------Default Values------------------
    activityTypes = ActivityTypes.getTypesOfActivity();
    //-----------------------------------------------Default Values------------------

    // ------------------------------------------------Date Picker---------------------
    todaysDate: Date = new Date(); // Get today's date to be maxDate for To Date
    displayFromDate: NgbDateStruct;       // To Display From Date
    displayToDate: NgbDateStruct;         // To Display From Date


    setDate(date: NgbDateStruct, type) {
        if (type == 'from') {
            this.operatorAssetItem.fromDate.setFullYear(date.year);
            this.operatorAssetItem.fromDate.setMonth(date.month - 1);
            this.operatorAssetItem.fromDate.setDate(date.day);
        }
        else if (type == 'end') {
            this.operatorAssetItem.endDate.setFullYear(date.year);
            this.operatorAssetItem.endDate.setMonth(date.month - 1);
            this.operatorAssetItem.endDate.setDate(date.day);
        }
        this.operatorAssetItem.dirtyFlag = true;
    }

    dateFilter(d: Date): boolean {
        return true;
    }
    // ------------------------------------------------Date Picker---------------------

    constructor(private router: Router, private route: ActivatedRoute, private cdr: ChangeDetectorRef, private ms: MessageService, private operatorSvc: DataService, private previewSvc: OperatorIntegraionService, private userSvc: UsersService) {
    }

    setDisplayDates() {
        this.displayFromDate = { year: this.operatorAssetItem.fromDate.getFullYear(), month: this.operatorAssetItem.fromDate.getMonth() + 1, day: this.operatorAssetItem.fromDate.getDate() };
        this.displayToDate = { year: this.operatorAssetItem.endDate.getFullYear(), month: this.operatorAssetItem.endDate.getMonth() + 1, day: this.operatorAssetItem.endDate.getDate() };
    }

    ngOnInit() {
        this.defaultImageUrl = 'public/img/' + OperatorAssetItem.getDefaultImageUrl(this.assetType);
        this.subscription = this.route.params.subscribe(
            (params: any) => {
                if (params.hasOwnProperty('itemIndex')) {
                    this.editMode = 'edit';
                    this.index = +params['itemIndex'];
                }
                if (this.editMode === 'edit') {
                    this.operatorAssetItem = new OperatorAssetItem(AssetType.ItemAuthentication, 'Loading...', '', '', '');
                    for (var v = length; v < 3; v++) {
                        this.previewRecords.push(new ActionRecord('', '', '', this.operatorAssetItem.requestSubType));
                    }
                    this.operatorSvc.getEntity(AssetType.Action, this.index).subscribe(
                        data => this.onGetEntity(data),
                        error => this.onGetError(error),
                        () => { this.displayReports(); }
                    );
                }
                else {
                    this.operatorAssetItem = new OperatorAssetItem(AssetType.ItemAuthentication, null, '', '', '');
                    this.setDisplayDates();
                    for (var v = length; v < 3; v++) {
                        this.previewRecords.push(new ActionRecord('', '', '', this.operatorAssetItem.requestSubType));
                    }
                }
                this.cdr.detectChanges();
            }
        );
    }

    assetTypeSelected() {
        this.onClose();
    }

    displayAddArea() {
        this.addAreaDisplayed = true;
    }

    addValue(value: string) {
        console.log(value);
        if (value != undefined && value != null && value != '') {
            this.operatorAssetItem.value.push(value);
            this.addAreaDisplayed = false;
        }
    }

    removeValue(value) {
        var index = this.operatorAssetItem.value.indexOf(value, 0);
        if (index != undefined) {
            this.operatorAssetItem.value.splice(index, 1);
        }
    }

    onPreview() {
        let requst: any = this.operatorAssetItem.updateKey(true, false);
        this.previewSvc.postPreview(requst).subscribe(
            data => this.onGetPreview(data),
            error => this.onGetError(error)
        );
    }

    onRunNow() {
        this.onSave();
        this.response = null;
        var body = new RunNow(this.operatorAssetItem);
        this.operatorSvc.getReport(body).subscribe(
            data => this.generateReport(data),
            error => { console.log(error), this.loadingMsg = "Failed to Generate Report." }
        );
        this.runNowModal.open();
    }

    generateReport(jsonData: JSON) {
        const status = jsonData.hasOwnProperty("status") ? jsonData["status"] : '';
        if (status !== "SUCCESS") {
            this.loadingMsg = "Failed to Generate Report."
            this.onGetError(jsonData);
        }
        else {
            this.response = jsonData;
            this.reportItem = ReportItem.parse(jsonData);
            this.operatorSvc.addReport(this.operatorAssetItem.pkid, jsonData).subscribe(
                data => this.onCall(data),
                error => this.onGetError(error),
                () => { this.displayReports() }
            );
        }
    }

    displayReports() {
        this.operatorSvc.showReports(this.operatorAssetItem.pkid, this.operatorAssetItem.requestType).subscribe(
            data => this.onGetReports(data),
            error => this.onGetError(error)
        );
    }

    onGetReports(jsonData: JSON) {
        console.log()
        const status = jsonData.hasOwnProperty("status") ? jsonData["status"] : '';
        if (status !== "SUCCESS") {
            this.onGetError(jsonData);
        }
        else {
            this.reportData = [];
            var entity = jsonData["data"];
            for (var i = 0; i < entity.length; i++) {
                var heading: DataList = DataList.parse(entity[i].dataList);
                var record = JSON.parse(entity[i].content);
                this.reportData.push({ "record": record, "heading": heading, "openFlag": false });
            }
        }
    }

    onCancel() {
        this.router.navigate(['Operator/assets', "Action"]);
    }

    onClose() {
        if (this.operatorAssetItem.dirtyFlag == true) {
            this.openModal("Do you want to save the changes you made to \'" + this.operatorAssetItem.name + "'?", "", true);
        }
        else {
            this.onCancel();
        }
    }

    onSave() {
        if (this.operatorAssetItem.dirtyFlag == false) {
            this.save(true);
        }
        else {
            this.save(false);
        }
    }

    save(showDialog: boolean) {
        this.operatorAssetItem.updateKey(false, true);
        this.operatorAssetItem.updateJSONObject();
        if (this.operatorAssetItem.value.length == 0) {
            var message;
            if (this.operatorAssetItem.requestSubType == 'Serial') {
                message = "Serial(s) can not be null or empty.";
            } else if (this.operatorAssetItem.requestSubType == 'UPC') {
                message = "UPC(s) can not be null or empty.";
            }
            this.ms.displayRawMessage(new Message('error', message, '', '', ''), this.customPlugs)
                .subscribe((value) => console.log(value));
        }
        // else if (this.operatorAssetItem.singleValue != null) {
        //     var message;
        //     if (this.operatorAssetItem.requestSubType == 'User Name') {
        //         message = "User Name can not be null or empty.";
        //     } else if (this.operatorAssetItem.requestSubType == 'Email') {
        //         message = "Email can not be null or empty.";
        //     }
        //     this.ms.displayRawMessage(new Message('error', message, '', '', ''), this.customPlugs)
        //         .subscribe((value) => console.log(value));
        // }
        else {
            if (this.editMode === 'edit') {
                this.operatorAssetItem.updatorName = this.userSvc.getCurrentUserName();
                this.operatorSvc.postAction(this.operatorAssetItem).subscribe(
                    data => this.onAddEntity(data, showDialog),
                    error => this.onGetError(error)
                );
            }
            else {
                this.operatorSvc.putAction(this.operatorAssetItem).subscribe(
                    data => this.onAddEntity(data, showDialog),
                    error => this.onGetError(error)
                );
            }
        }
        this.operatorAssetItem.dirtyFlag = false;
    }

    onAddEntity(jsonData: JSON, showDialog: boolean) {
        const status = jsonData.hasOwnProperty("status") ? jsonData["status"] : '';
        if (status !== "SUCCESS") {
            this.onGetError(jsonData);
            if (!showDialog) {
                if (this.editMode === 'edit') {
                    var displayMsg = "Failed to update \'" + this.operatorAssetItem.name + "\'.";
                } else {
                    var displayMsg = "Failed to create \'" + this.operatorAssetItem.name + "\'.";
                }
            }
        }
        else if (!showDialog) {
            if (this.editMode === 'edit') {
                var displayMsg = "Action \'" + this.operatorAssetItem.name + "\' is updated successfully.";
            } else {
                var displayMsg = "New Action \'" + this.operatorAssetItem.name + "\' is created successfully.";
                this.editMode = 'edit';
            }
            this.operatorAssetItem.dirtyFlag = false;
            this.onGetEntity(jsonData);
        }
        this.ms.displayRawMessage(new Message(status, displayMsg, '', '', ''), this.customPlugs)
            .subscribe((value) => console.log(value));
    }

    onGetEntity(jsonData: JSON) {
        const status = jsonData.hasOwnProperty("status") ? jsonData["status"] : '';
        if (status !== "SUCCESS") {
            this.onGetError(jsonData);
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
            this.operatorAssetItem.dirtyFlag = false;
            this.setDisplayDates();
            this.previewRecords.splice(0, this.previewRecords.length);
            this.resetPreviewRecords();
        }
    }

    onGetPreview(jsonData: JSON) {
        const status = jsonData.hasOwnProperty("state") ? jsonData["state"] : '';
        if (status !== "Success") {
            this.onGetError(jsonData);
            return;
        } else {
            var dataArray = jsonData["data"];
            this.previewRecords.splice(0, this.previewRecords.length);
            if (dataArray != null) {
                for (var i = 0; i < dataArray.length; i++) {
                    var record = ActionRecord.parse(dataArray[i], this.operatorAssetItem.requestSubType);
                    if (record != null) {
                        this.previewRecords.push(record);
                    }
                }
            }
            //alwasy keep at least 3 rows
            var length = this.previewRecords.length;
            if (length < 3) {
                for (var v = length; v < 3; v++) {
                    this.previewRecords.push(new ActionRecord('', '', '', this.operatorAssetItem.requestSubType));
                }
            }
        }
    }

    onCall(jsonData: JSON) {
        const status = jsonData.hasOwnProperty("status") ? jsonData["status"] : '';
        if (status !== "SUCCESS") {
            this.onGetError(jsonData);
        }
    }

    onGetError(jsonData: JSON) {
        const status = jsonData.hasOwnProperty("status") ? jsonData["status"] : '';
        const message = jsonData.hasOwnProperty("message") ? jsonData["message"] : '';
        if (status != 'SUCCESS') {
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

    onContentChange() {
        this.operatorAssetItem.dirtyFlag = true;
    }

    onRequestChange(value) {
        const selectValue: string = (<HTMLSelectElement>event.srcElement).value;
        if (selectValue !== this.operatorAssetItem.requestType) {
            let previousSubType = this.operatorAssetItem.requestSubType;
            this.operatorAssetItem.setRequestType(selectValue);
            if (previousSubType != this.operatorAssetItem.requestSubType) {
                this.updateRequestSubType(this.operatorAssetItem.requestSubType);
            }
            this.operatorAssetItem.dirtyFlag = true;
        }
    }

    updateRequestSubType(value: string) {
        this.operatorAssetItem.requestSubType = value;
        this.operatorAssetItem.singleValue = '';
        this.operatorAssetItem.value = [];
        this.operatorAssetItem.dirtyFlag = true;
        this.resetPreviewRecords();
    }

    resetPreviewRecords() {
        this.previewRecords.splice(0, this.previewRecords.length);
        for (var v = 0; v < 3; v++) {
            this.previewRecords.push(new ActionRecord('', '', '', this.operatorAssetItem.requestSubType));
        }
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
        this.onCancel();
        this.confirmModal.close();
    }

    getDisplayName() {
        let name = this.operatorAssetItem.name;
        if (name != null && name.length > 30) {
            return name.slice(0, 29) + "...";
        }
        return name;
    }

    checkSelect(value: string, index: number) {
        if (this.operatorAssetItem == null && index == 0) {
            return true;
        }
        if (this.operatorAssetItem.requestType == value) {
            return true;
        }
        if ((this.operatorAssetItem.requestType == null || this.operatorAssetItem.requestType == '') && index == 0) {
            return true;
        }
        return false;
    }

    getDisplayColumns() {
        return ActionRecord.displayColumns(this.operatorAssetItem.requestSubType);
    }

    getDiaplyValues(record: ActionRecord): string[] {
        if (record.type == 'User Name' || record.type == 'Email') {
            return [record.status, record.userName, record.email, record.addedOn, record.state];
        } else if (record.type == 'Serial') {
            return [record.status, record.serial, record.addedOn, record.state];
        } else if (record.type == 'UPC') {
            return [record.status, record.upc, record.addedOn, record.state];
        }
        return [record.status, record.userName, record.email, record.addedOn, record.state];
    }
}