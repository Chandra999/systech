import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { DataService } from '../services/Assets.service';
import { emailValidator } from '../administrator/validators/addUser.validators';
import { MessageService } from '../services/message.service';
import { Message } from './message';

@Component({
    selector: 'error-handler',
    templateUrl: 'public/html/message/message-utility.component.html',
    // directives: [FORM_DIRECTIVES],
    styleUrls: ['public/css/login/login.css'],
})

export class MessageUtilityComponent implements OnInit {
    public showError: boolean;
    constructor(private ms: MessageService) {
        this.showError = false;
    }

    ngOnInit() {
        this.registerHandlers();
    }

    private registerHandlers() {
        this.ms.messageAdded$.subscribe(jsonData => this.onGetError(jsonData));
    }

    public handleError(jsonData: JSON) {
       this.showError = true;
        console.log(jsonData);
        const status = jsonData.hasOwnProperty("status") ? jsonData["status"] : '';
        const message = jsonData.hasOwnProperty("message") ? jsonData["message"] : '';
        // if (status == 'SUCCESS') {           
        //     this.ms.displayRawMessage(new Message(status, 'DNA Created', '', '', ''), this.customPlugs)
        //         .subscribe((value) => console.log(value));
        // }
        if (status == 'ERROR') {
            this.ms.displayRawMessage(new Message(status, JSON.parse(message).msgs[0].message, JSON.parse(message).msgs[0].action, JSON.parse(message).msgs[0].suggestion, JSON.parse(message).prefix), this.customPlugs)
                .subscribe((value) => {
                    console.log(value);
                    this.showError = true;
                });
        }
    }

    onGetError(jsonData: JSON) {
        console.log(jsonData);
        const status = jsonData.hasOwnProperty("status") ? jsonData["status"] : '';
        const message = jsonData.hasOwnProperty("message") ? jsonData["message"] : '';
        // if (status == 'SUCCESS') {           
        //     this.ms.displayRawMessage(new Message(status, 'DNA Created', '', '', ''), this.customPlugs)
        //         .subscribe((value) => console.log(value));
        // }
        if (status == 'ERROR') {
            this.ms.displayRawMessage(new Message(status, JSON.parse(message).msgs[0].message, JSON.parse(message).msgs[0].action, JSON.parse(message).msgs[0].suggestion, JSON.parse(message).prefix), this.customPlugs)
                .subscribe((value) => {
                    console.log(value);
                    this.showError = true;
                });
        }
    }
}
