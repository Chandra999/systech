import { Component, OnInit, Output, EventEmitter, ViewChild, trigger, state, style, transition, animate } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { DataService } from '../services/Assets.service';
import { emailValidator } from '../administrator/validators/addUser.validators';
import { MessageService } from '../services/message.service';
import { Message } from './message';
import { Error } from './error';
import { Config } from './config';

@Component({
    selector: 'message-utility',
    templateUrl: 'public/html/message/message-utility.component.html',
    // directives: [FORM_DIRECTIVES],
    styleUrls: ['public/css/login/login.css', 'public/css/css/message/message-utility.component.css'],
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

export class MessageUtilityComponent implements OnInit {
    public showError: boolean;
    public msg: Message;
    private messageUrl = "http://" + window.location.hostname + ':8080' + '/UniSecureErrors/rest/errors/';
    public customPlugs: string[] = ['a'];
    constructor(private http: Http) {
        this.showError = false;
    }

    ngOnInit() {
        //this.registerHandlers();
    }

    /**
     * Sets the URL for the RESTful error message server
     */
    public setUrl(url: string): void {
        this.messageUrl = url;
    }
    private registerHandlers() {
        //this.ms.messageAdded$.subscribe(jsonData => this.onGetError(jsonData));
    }

    public handleError(jsonData: JSON, customError?: boolean, msg?: Message) {
        this.showError = true;
        //const status = jsonData.hasOwnProperty("status") ? jsonData["status"] : 'ERROR';
        const status = jsonData.hasOwnProperty("status") ? jsonData["status"] : '';
        var message: string = '';
        var action: string = '';
        var suggestion: string = '';
        var prefix: string = '';

        try {
            if (!customError) {
                message = jsonData.hasOwnProperty("message") ? jsonData["message"] : '';
                action = JSON.parse(message).msgs[0].action;
                suggestion = JSON.parse(message).msgs[0].suggestion;
                prefix = JSON.parse(message).prefix;
                msg = new Message(status, message, action, suggestion, prefix);
            } else {

            }
            this.displayRawMessage(msg, this.customPlugs)
                .subscribe((value) => {
                    console.log(value);
                    if (value)
                        this.msg = value;
                    this.showError = true;
                });
        }
        catch (ex) {
            this.handleUnknownError(ex);
        }

    }

    public closeError() {
        this.showError = false;
    }

    public getMessages(prefix: string, langId: string, errorId: number) {
        let x = this.messageUrl + "?prefix=" + prefix + "&langId=" + langId;
        if (errorId)
            x = x + "&id=" + errorId;   // since number is undefined, not null (java)
        let pre = this.http.get(x).catch(this.handleUnknownError);
        let ret = pre.map(value => value.json());  // Get JS object
        return ret; // Observable, request will be made when this is subscribed to (imm. in example)
    }

    public getFormattedMessage(prefix: string, langId: string, errorId: number, plugs: string[]) {
        let x = this.messageUrl + "format?prefix=" + prefix + "&langId=" + langId + "&id=" + errorId;
        for (var plug of plugs) {
            x = x + "&plug=" + plug;
        }
        let pre = this.http.get(x).catch(this.handleUnknownError);
        let ret = pre.map(value => value.json());
        return ret;
    }

    public displayRawMessage(msg: Message, plugs?: string[], key?: string): Observable<any> {
        if (key) msg.key = key;
        return new Observable<any>((observer) => {
            this.displayMsg({ 'msgs': [msg] }, observer, plugs);
        })
    }

    public displayMessage(prefix: string, langId: string, errorId: number, plugs?: string[]): Observable<any> {
        var res = new Observable((observer) => {
            if (prefix == null || !errorId) { // Not cool (must be 1 unique message)
                console.log("Prefix and ErrorId cannot be null");
                observer.next(null);
                observer.complete();
                return;
            }
            if (!plugs) {
                this.getMessages(prefix, langId, errorId).subscribe(value => {
                    if (value["Error"]) { // Returned by backend for invalid prefix
                        //alert("Error in MESSAGE SERVICE: " + value["Error"]);
                        observer.next(value); // Return error message
                        observer.complete();
                    }
                    else {
                        if (value.msgs[0]) {
                            let key: string = (prefix + this.leftpad(errorId) + value.msgs[0].type.substring(0, 1)).toUpperCase();
                            value.msgs[0].key = key;
                        }
                        this.displayMsg(value, observer, plugs);  // Pass observer on to toaster handler
                    }
                });
            }
            else {
                this.getFormattedMessage(prefix, langId, errorId, plugs).subscribe(value => {
                    if (value["Error"]) { // Returned by backend for invalid prefix
                        //alert("Error in MESSAGE SERVICE: " + value["Error"]);
                        observer.next(value); // Return error message
                        observer.complete();
                    }
                    else {
                        if (value.msgs[0]) {
                            let key: string = (prefix + this.leftpad(errorId) + value.msgs[0].type.substring(0, 1)).toUpperCase();
                            value.msgs[0].key = key;
                        }
                        this.displayMsg(value, observer);  // Pass observer on to toaster handler
                    }
                });
            }
        });
        return res;
    }

    private displayMsg(msg: any, observer: any, plugs?: string[]) {
        var target: Message = msg.msgs[0];

        if (!target) {  // i.e. array index out of bounds
            console.error("Error: No message could be found");
            observer.next(false);
            observer.complete();
            return;
        }

        if (plugs) {
            for (var i = 0; i < plugs.length; i++) {
                target.message = target.message.replace('{' + (i).toString() + '}', plugs[i]);  // Plug numbers start at 1
            }
        }
        var m: Message = {
            type: target.type,
            message: target.message,
            action: target.action,
            suggestion: target.suggestion,
            prefix: target.prefix,
            key: target.key,
            src: "server"
        }

        this.msg = m;
        observer.next(m);
    }

    private leftpad(id: number) {
        let res = '00000';
        res = res.slice(0, res.length - id.toString().length) + id;
        return res;
    }

    private handleUnknownError(error: any) {
        console.log(error);
        return Observable.throw(error);
    }
}
