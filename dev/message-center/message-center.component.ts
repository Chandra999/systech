import { Component, OnInit, ElementRef, trigger, state, style, transition, animate } from '@angular/core';
import { MessageService } from '../services/message.service';
import { MessageComponent } from './message/message.component';
import { Message } from './message';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { SearchBoxComponent } from './nav-bar/search-box/search-box.component';
import { UsersService } from '../services/User.service';
import { DisplayPreference } from '../common/displayPreference';

/**
 * Systech Standard Message Center Component
 * To use: place <message-center></message-center> in a relatively-positioned box. 
 * This box should have overflow-x hidden to prevent scrolling during init animations.
 * See MessageService for function calls and subscriptions.
 */
@Component({
  selector: 'message-center',
  templateUrl: 'public/html/message/message-center.component.html',
  styleUrls: ['public/css/message/message-center.component.css'],
  animations: [
    trigger('animate', [
      state('visible', style({ 'right': 12 })),
      transition('visible => void', [animate('250ms ease-out', style({ 'right': '-315px' }))]),
      transition('void => visible', [style({ 'right': '-315px' }), animate('500ms ease-out', style({ 'right': 12 }))])
    ]),
    trigger('hover', [
      state('inactive', style({})),
      state('active', style({
        transform: 'translateY(-2px)',
        'box-shadow': '0px 1px 5px rgba(0,0,0,.5)'
      })),
      transition('inactive => active', animate('100ms linear')),
      transition('active => inactive', animate('100ms linear'))
    ])
  ]
})

export class MessageCenterComponent implements OnInit {
  // Config vars //
  /**
   * The dynWidth of the message center
   * NOTE: Change styles for animations in '@animate' trigger to match (right: -(messageCenterdynWidth+15px))
   */
  public messageCenterWidth = 300;

  /**
   * Maximum number of messages before scrollbar appears
   */
  private maxMessages: number = 3;
  //=========================

  // Template vars //
  private show: boolean = false;
  private messages: Message[] = [];
  private messageKeys: string[] = [];
  private imgHover: string = 'inactive';
  private showTag: boolean = false;
  private dynWidth: number = this.messageCenterWidth;
  private scrollbar: string = 'hidden';
  private maxheight: string = null;
  //Message Location
  displayPreference: DisplayPreference = null;
  location: string = '';
  bottom: boolean = true;

  constructor(private ms: MessageService, private er: ElementRef, private userSvc: UsersService) {
  }

  ngOnInit() {
    this.registerHandlers();

    if (this.userSvc.currentUser != null) {
      this.displayPreference = this.userSvc.currentUser.displayPreference;
      console.log(this.displayPreference);
      this.location = this.displayPreference.location;
      if (this.location == "Upper Right") {
        this.bottom = false;
      }
      this.maxMessages = this.displayPreference.maxMessages;
    } else if (sessionStorage.getItem('preferences') != '' || sessionStorage.getItem('user_token') != null) {
      this.location = (JSON.parse(sessionStorage.getItem('preferences')))[0].value;
      if (this.location == "Upper Right") {
        this.bottom = false;
      }
      this.maxMessages = (JSON.parse(sessionStorage.getItem('preferences')))[1].value;
    }
  }

  private registerHandlers() {
    this.ms.messageAdded$.subscribe(item => this.pop(item));
    this.ms.closeAll$.subscribe(item => this.closeAll());
    this.ms.toggle$.subscribe(item => this.toggle());
  }

  private refresh($event?) {
    setTimeout(this.refreshView, 1)
  }

  private refreshView = () => { // To preserve this context 
    /*     
      if (this.bottom) {
        
        var messageCenter = this.er.nativeElement
          .firstChild
          .querySelector("#message-center-bottom")
          .querySelector("#msgs");
          
      }
      else {
        //var messageCenter =  document.getElementById('msgsb');
     
        var messageCenter = this.er.nativeElement
          .firstChild
          .querySelector("#message-center")
          .querySelector("#msgs");
     
      }
      
      console.log(messageCenter);
*/
    if (this.messages.length === this.maxMessages) {
      console.log("maxmessages");

    } else if (this.messages.length > this.maxMessages) {
      //   messageCenter.style.overflow = "auto";
      this.scrollbar = 'auto';
      this.maxheight = '100px';
      this.dynWidth = this.messageCenterWidth + 17;
    }
    if (this.messages.length <= this.maxMessages) {
      this.scrollbar = 'hidden';
      this.maxheight = '140px';
      this.dynWidth = this.messageCenterWidth;
    }


    if (this.messages.length > 0) this.showTag = true;
    else this.showTag = false;


  }
  private closeAll() {
    this.show = false;
    this.showTag = false;
    setTimeout(() => {
      this.messages = [];
    }, 250);
  }

  private remove($event: any) {
    var x = this.messages.indexOf($event);
    this.messages.splice(x, 1);
    this.refresh();
    this.ms.returnMsg$.emit(true);
  }

  /* Display Events */

  //Image animation triggers

  private imgHoverOn() {
    this.imgHover = 'active';
  }

  private imgHoverOff() {
    this.imgHover = 'inactive';
  }

  private toggle() {
    this.show = !this.show;
  }

  private pop(m: Message) {
    this.messages = [m, ...this.messages];
    this.show = true;
    this.refresh();
  }

}
