import { Injectable, EventEmitter } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Message } from '../message-center/message';

/**
 * Systech Standard Message Center Service
 */
@Injectable()
export class MessageService {

  public messageAdded$: EventEmitter<Message>;  // Stream of added messages
  public returnMsg$: EventEmitter<any>; // Gets 'true' event when a toast is closed

  public closeAll$: EventEmitter<boolean>; // Gets true when close all button is pressed
  public toggle$: EventEmitter<boolean>; // Emits true when message center is toggled

  private messageUrl = "http://" + window.location.hostname + ':8080'+'/UniSecureErrors/rest/errors/';

  constructor(private http: Http) {
    this.messageAdded$ = new EventEmitter<Message>();
    this.returnMsg$ = new EventEmitter();

    this.closeAll$ = new EventEmitter<boolean>();
    this.toggle$ = new EventEmitter<boolean>();
  }

  /**
   * Sets the URL for the RESTful error message server
   */
  public setUrl(url: string): void {
    this.messageUrl = url;
  }

  public getMessages(prefix: string, langId: string, errorId: number) {
    let x = this.messageUrl + "?prefix=" + prefix + "&langId=" + langId;
    if (errorId)
      x = x + "&id=" + errorId;   // since number is undefined, not null (java)
    let pre = this.http.get(x).catch(this.handleError);
    let ret = pre.map(value => value.json());  // Get JS object
    return ret; // Observable, request will be made when this is subscribed to (imm. in example)
  }

  public getFormattedMessage(prefix: string, langId: string, errorId: number, plugs: string[]) {
    let x = this.messageUrl + "format?prefix=" + prefix + "&langId=" + langId + "&id=" + errorId;
    for (var plug of plugs) {
      x = x + "&plug=" + plug;
    }
    let pre = this.http.get(x).catch(this.handleError);
    let ret = pre.map(value => value.json());
    return ret;
  }

  public displayRawMessage(msg: Message, plugs?: string[], key?: string): Observable<boolean> {
    if (key) msg.key = key;
    return new Observable<boolean>((observer) => {
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
    observer.next(m);
    this.messageAdded$.emit(m);
    this.returnMsg$.subscribe(value => {
      observer.next(value); // Pass on event(s) when messages are closed (we can potentially get more info by changing the Observable type)
      observer.complete();
    });
  }

  private leftpad(id: number) {
    let res = '00000';
    res = res.slice(0, res.length - id.toString().length) + id;
    return res;
  }

  private handleError(error: any) {
    console.log(error);
    return Observable.throw(error);
  }
}