import {
  Component, OnInit, Input, ViewChild, ComponentFactoryResolver, ViewContainerRef,
  EventEmitter, trigger, state, style, transition, animate
} from '@angular/core';
import { Message } from '../message';
import { UsersService } from '../../services/User.service';
import { DisplayPreference } from '../../common/displayPreference';

@Component({
  selector: '[msgComp]',
  templateUrl: 'public/html/message/message.component.html',
  styleUrls: ['public/css/message/message.component.css'],
  outputs: ['closeMessage', 'expandMessage'],
  animations: [
    trigger('rotater', [
      state('collapsed', style({ transform: 'rotate(360deg)' })),
      state('expanded', style({ transform: 'rotate(180deg)' })),
      transition('collapsed => expanded', animate('100ms linear')),
      transition('expanded => collapsed', animate('100ms linear'))
    ]),
    trigger('expander', [
      state('expanded', style({ 'height': 'auto' })),
      state('collapsed', style({ 'height': 0 })),
      transition('expanded => void', [animate('50ms linear', style({ 'height': 0 }))]),
      transition('void => expanded', [animate('50ms linear')])
    ])
  ]
})
export class MessageComponent implements OnInit {

  @ViewChild('componentBody', { read: ViewContainerRef }) componentBody: ViewContainerRef;
  @Input() message: Message;
  @Input() key: string;

  private details: boolean = false;
  private detailsState: string = 'collapsed';

  public closeMessage: EventEmitter<Message> = new EventEmitter<Message>();
  public expandMessage: EventEmitter<boolean> = new EventEmitter<boolean>();
  displayPreference: DisplayPreference = null;
  enablePrefix: boolean = false;
  constructor(private res: ComponentFactoryResolver, private userSvc: UsersService) {

  }

  ngOnInit() {
    if (this.userSvc.currentUser != null) {
      this.displayPreference = this.userSvc.currentUser.displayPreference;
      console.log(this.displayPreference);
      if (!this.displayPreference.enablePrefix) {
        this.message.prefix = '';
      }
    } else {
      if (sessionStorage.getItem('preferences') != '' || sessionStorage.getItem('user_token') != null) {
        this.enablePrefix = (JSON.parse(sessionStorage.getItem('preferences')))[6].value;
        if (!this.enablePrefix) {
          this.message.prefix = '';
        }
      }
    }
  }

  toggleDetails() {
    this.details = !this.details;
    this.detailsState = this.details ? 'expanded' : 'collapsed';
    this.expandMessage.emit(true);
  }

  close() {
    this.closeMessage.emit(this.message);
  }

}
