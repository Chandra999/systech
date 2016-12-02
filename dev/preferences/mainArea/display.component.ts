import { Component, Input, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PreferenceItem } from '../../common/preferenceItem';
import { PreferenceList } from '../../common/preferenceList';
import { DisplayPreference } from '../../common/displayPreference';
import { UsersService } from '../../services/User.service';
import { DataService } from '../../services/Assets.service';
import { MessageService } from '../../services/message.service';
import { MessageCenterComponent } from '../../message-center/message-center.component';
import { Message } from '../../message-center/message';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { RouterLink, ActivatedRoute, Data } from '@angular/router';


@Component({
  selector: 'Display',
  template: `
  <div class="topnav uni-card2" style="position:fixed; top:68px; padding:0px; color :white; z-index:1">
   <div style="overflow:auto">
      <div style="overflow:hidden;height:44px;text-align:center;z-index:1">
         <a title="Display Preferences">
         <i style="text-align:center;display:block;"></i>Display Preferences
         </a>
      </div>
   </div>
</div>
<div>
<ul style="margin-left:20px;position:fixed;" id="breadcrumb">
   <li><a (click)="onCancel()"> Preferences</a> </li>
   <li><a> <span class="glyphicon glyphicon-asterisk" style="margin-left:2px;" [hidden]=!editMode></span> Display Preferences</a> </li>
</ul>
</div>

<form id="updatePreference">
   <div class="col-xs-18 col-sm-6 col-md-3">
      <div class="unisecure-display-box thumbnail" style="display:table;" >
         <div style="width:900px;height:300px;">
            <div style="float:left;width:45%;" class="left-form">
               <div style="margin-top:25px">
                  <label>Message Bar Location</label>
                  <div class="clearBoth"></div>
                  <div>
                     <select [(ngModel)]="displayPreference.location" name="displayPreferencelocation" class="form-control" (ngModelChange)="onContentChange()">
                     <option *ngFor="let location of locations; let i = index" value="{{location}}" [selected]="displayPreference.location == location" >{{location}}</option>
                     </select>
                  </div>
               </div>
               <div style="margin-top:25px">
                  <label>Messages before scrollbar is shown</label>
                  <div class="clearBoth"></div>
                  <div>
                     <select [(ngModel)]="displayPreference.maxMessages" name="displayPreferenceMaxMessages" class="form-control" (ngModelChange)="onContentChange()" >
                     <option *ngFor="let number of numMessages;let i = index" value="{{number}}" [selected]="displayPreference.maxMessages == number">{{number}}</option>
                     </select>
                  </div>
               </div>
               <div style="margin-top:25px">
                  <label style="float:left;"> Enable Mesage Prefix : </label>
                <div class="msgswitch" style="margin-left:300px">
                     <input type="checkbox" [(ngModel)]="displayPreference.enablePrefix" (click)="enablePrefix()" name="msgswitch" class="form-control"  class="msgswitch-checkbox" id="mymsgswitch" checked>
                     <label class="msgswitch-label" for="mymsgswitch" >
                     <span class="msgswitch-inner"></span>
                     <span class="msgswitch-switch"></span>
                     </label>
                  </div> 
               </div>  
            </div>
            <div style="float:right;width:45%;" class="right-form">
               <div style="margin-top:25px">
                  <label>How many Cards per Page</label>
                  <div class="clearBoth"></div>
                  <div>
                     <select [(ngModel)]="displayPreference.numOfCards" name="displayPreferenceNumOfCards" class="form-control" (ngModelChange)="onContentChange()">
                     <option *ngFor="let card of numCards" value="{{card}}" [selected]="displayPreference.numOfCards == card">{{card}}</option>
                     </select>
                  </div>
               </div>

               <div style="margin-top:25px">
                  <label>Actions Default Layout</label>
                  <div class="clearBoth"></div>
                  <div>
                     <select [(ngModel)]="displayPreference.actionsLayout" name="displayPreferenceActionsLayout" class="form-control" (ngModelChange)="onContentChange()">
                     <option *ngFor="let layout of layouts" value="{{layout}}"  [selected]="displayPreference.actionsLayout == layout">{{layout}}</option>
                     </select>
                  </div>
               </div>
               <div style="margin-top:25px">
                  <div>
                  <span><a class="yes-button" [ngClass]="{'yes-button': displayPreference.enableMessages, 'no-button':!displayPreference.enableMessages}" style="width:220px" (click)="enableMessages()">Enable hidden messages</a></span>
                </div> 
               </div>
            </div>
            
               <div class="fixed-action-btn" style="z-index:0; top:175px;left:1000px;">
                 <message-center></message-center>
                  <a class="btn-floating btn-large" title="Options">
                  <span class="glyphicon glyphicon-pencil" style="margin:11px 0 0 11px; font-size:18px;"></span>
                  </a>
                  <ul style="padding-left:0px; margin-bottom:-8px;">
                     <li>
                    <button class="btn-floating" style="border:0;margin-left:-5px;" [disabled]="!editMode" title="Save">                         
                            <span class="glyphicon glyphicon-floppy-save" style="margin-top:10px;" (click)="onSubmit()"></span>
                      </button>              
                     </li>
                     <li>
                        <a class="btn-floating" (click)="restoreDefault()" title="Restore to Default">
                        <span class="glyphicon glyphicon-refresh" style="margin-top:10px;"></span>
                        </a>
                     </li>
                     <li>
                        <a class="btn-floating" (click)="onCancel()" title="Cancel">
                        <span class="glyphicon glyphicon-remove" style="margin-top:10px;"></span>
                        </a>
                     </li>
                  </ul>
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
                <div class="message">{{msg}}</div>
            </div>
        </div>
    </modal-body>
    <modal-footer>
        <button type="button" class='uni-button' (click)="cancelClicked()" style="float: right">{{cancelButtonLabel}}</button>
        <button type="button"  class='uni-button' (click)="okClicked()" style="float: right;margin-right:5px">{{okButtonLabel}}</button>
    </modal-footer>
</modal>

<modal #messageModal style="color:#0458A2;">
    <modal-header [show-close]="false" style="height:30px !important"></modal-header>
    <modal-body>
        <div class='container2' style="min-height:70px">
            <div>
                <img src='public/img/alert_transparent_green_bright_2.png' class='iconDetails'>
            </div>
            <div style='margin-left:80px;word-wrap: break-word; '>
                <div class="message">{{confirmTitle}}</div>
                <div class="message" style="margin:20px 20px 20px">{{msg1}}</div>
            </div>
        </div>
    </modal-body>
    <modal-footer>
       
    </modal-footer>
</modal>
   
  `,
  styleUrls: ['public/css/mainArea/breadcrumb.css', 'public/css/topBanner/topBanner.css', 'public/css/app.css', 'public/css/mainArea/edit_assets.css', 'public/css/common/anchorButton.css', 'public/css/mainArea/view.css', 'public/css/common/table.css', 'public/css/common/modal.css'],
  // providers: [MessageService],
  // directives: [FORM_DIRECTIVES, MessageCenterComponent, MODAL_DIRECTIVES]
})

export class DisplayComponent implements OnInit {

  locations: Array<string> = ["Upper Right", "Bottom Right"];

  layouts: Array<string> = ["Card View", "List View"];

  numMessages: Array<number> = [];

  numCards: Array<number> = [];

  editMode: boolean;

  displayPreference: DisplayPreference = null;
  prefix: string;
  langId: string;
  messages: string;
  plugs: string[] = [''];

  updatePreference: FormGroup;

  location: string = '';
  layout: string = '';
  message: number = 0;
  cards: number = 0;
  msgs: boolean = false;
  enableprefix: boolean = false;
  customPlugs: string[] = ['a'];
  utility: boolean = true;

  //-----------------------------------------------ConfirmModal-------------------
  @ViewChild('confirmModal')
  confirmModal: ModalComponent;
  confirmTitle: string = '';
  msg: string = '';
  showCancel: boolean = false;
  okButtonLabel: string = 'Ok';
  cancelButtonLabel: string = 'No';
  //-----------------
  //-----------------------------------------------ConfirmModal-------------------
  @ViewChild('messageModal')
  messageModal: ModalComponent;
  msg1: string = 'All hidden messages are shown.';
  //-----------------


  constructor(private router: Router, private ms: MessageService, private route: ActivatedRoute, private userSvc: UsersService, private assetsSvc: DataService) {
    //empty
  }

  ngOnInit() {
    for (var i = 4; i <= 24; i = i + 4) {
      this.numCards.push(i);
    }
    for (var i = 1; i <= 5; i++) {
      this.numMessages.push(i);
    }

    if (this.userSvc.currentUser != null) {
      this.displayPreference = this.userSvc.currentUser.displayPreference;
      console.log(this.displayPreference);
    }
    if (this.displayPreference == null) {
      this.displayPreference = new DisplayPreference(this.userSvc.currentUser);
      console.log(this.displayPreference);
    }

    this.location = this.displayPreference.location;
    this.layout = this.displayPreference.actionsLayout;
    this.message = this.displayPreference.maxMessages;
    this.cards = this.displayPreference.numOfCards;
    this.msgs = this.displayPreference.enableMessages;
    this.enableprefix = this.displayPreference.enablePrefix;
  }

  restoreDefault() {
    this.displayPreference.location = this.location;
    this.displayPreference.actionsLayout = this.layout;
    this.displayPreference.maxMessages = this.message;
    this.displayPreference.numOfCards = this.cards;
    this.displayPreference.enableMessages = this.msgs;
    this.displayPreference.enablePrefix = this.enableprefix;
    this.editMode = false;
  }

  enableMessages() {
    this.editMode = true;
    this.displayPreference.enableMessages = !this.displayPreference.enableMessages;
    if (this.displayPreference.enableMessages) {
      this.messageModal.open();
    }
  }

  enableAnimation() {
    this.editMode = true;
    this.displayPreference.enableAnimation = !this.displayPreference.enableAnimation;
  }


  enablePrefix() {
    this.editMode = true;
    this.displayPreference.enablePrefix = !this.displayPreference.enablePrefix;
  }

  onContentChange() {
    this.editMode = true;
  }

  onSubmit() {
    this.displayPreference.updatePreferenceJSONObject();
    this.assetsSvc.updatePreference(this.displayPreference.preferenceList).subscribe(
      data => this.updatehandleError(data),
      error => this.updatehandleError(error)
    );

  }


  homeSelected() {
    this.router.navigate(['Welcome']);
  }

  updatehandleError(error: any) {
    if (error.status == 'ERROR') {
      if (error.message != null) {
        let jsonMsgs = JSON.parse(error.message);
        if (jsonMsgs.msgs != null && jsonMsgs.msgs.length > 0) {
          let msg = jsonMsgs.msgs[0];
          let msgId = "" + msg.id;
          while (msgId.length < 6) {
            msgId = "0" + msgId;
          }
          let prefix = jsonMsgs.prefix + msgId + jsonMsgs.langId.charAt(0).toUpperCase();
          this.ms.displayRawMessage(new Message(error.status, msg.message, msg.action, msg.suggestion, prefix), this.customPlugs)
            .subscribe((value) => console.log(value));
        }
      }
    }
    else if (error.status == 'SUCCESS') {
      this.editMode = false;
      if (sessionStorage.getItem('preferences') != '') {
        var pref = sessionStorage.getItem('preferences');
        var prefArray = JSON.parse("[" + pref + "]")[0];
        prefArray[0].value = this.displayPreference.location;
        prefArray[1].value = this.displayPreference.maxMessages;
        prefArray[2].value = this.displayPreference.enableMessages;
        prefArray[3].value = this.displayPreference.numOfCards;
        prefArray[5].value = this.displayPreference.actionsLayout;
        prefArray[6].value = this.displayPreference.enablePrefix;
        sessionStorage.removeItem('preferences');
        sessionStorage.setItem('preferences', JSON.stringify(prefArray));
      }
      if (this.utility) {
        this.ms.displayRawMessage(new Message(error.status, error.message, '', '', ''), this.customPlugs)
          .subscribe((value) => console.log(value));
      }
    }
  }

  onCancel() {
    if (this.editMode == true) {
      this.openModal("Do you want to save the changes you made ?", "", true);
    }
    else {
      this.router.navigate(['../'], { relativeTo: this.route });
    }
  }

  openModal(title: string, message: string, showCancel: boolean) {
    this.confirmTitle = title;
    this.msg = message == null ? '' : message;
    this.showCancel = showCancel;
    this.okButtonLabel = this.showCancel ? "Yes" : "Ok";
    this.confirmModal.open();
  }

  okClicked() {
    this.confirmModal.close();
    if (this.showCancel) {
      if (this.okButtonLabel == "Yes") {
        this.utility = false;
        this.onSubmit();
        this.router.navigate(['../'], { relativeTo: this.route });
      }
    }
  }

  cancelClicked() {
    this.restoreDefault();
    this.confirmModal.close();
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}

