import { Component, Input, EventEmitter, OnInit } from '@angular/core';

@Component({
    selector: 'dropdown-help-checkbox',
    inputs: ['labelText', 'content', 'chkBox', 'chkBoxLabel', 'help', 'chkBoxValue', 'currentValue', 'disable'],
    outputs: ['selectedValue', 'checkBoxValue'],
    template: `
        <div id="PackageProfileDropDown" style="margin-bottom:15px;">
            <label id="labelDropDown">{{labelText}}</label><img src='{{helpImage}}' *ngIf="help==true" style="width:22px; height:22px; float:right; margin-top:-4px; cursor:pointer;" title="help"> 
            <select id="selectDropDownValue" style="width: 85%;" [(ngModel)]="currentValue" (ngModelChange)="getSelectedValue()" class="form-control" required [disabled]=disable>
                <option id="optionDropDown" *ngFor="let data of content" value={{data}}>{{data}}</option>
            </select>
            <div id="containsCheckBox" *ngIf="chkBox==true" style="margin:5px 5px 0px 20px; display:inline-flex;">
                <input id="checkkBox" type="checkbox" [(ngModel)]="chkBoxValue" (ngModelChange)="getChkBoxValue()" [disabled]=disable/><label style="font-weight:100; margin:2px 0px 0px 5px;">{{chkBoxLabel}}</label>
            </div>
        </div>
    `
})

export class DropDownHelpCheckBox implements OnInit {

    currentValue: string = null;
    chkBoxValue: boolean = null;
    helpImage = 'public/img/icon-help.png';
    content: Array<string>;
    selectedValue: EventEmitter<Object> = new EventEmitter();
    checkBoxValue: EventEmitter<Object> = new EventEmitter();
    disable: boolean = false;

    ngOnInit() {
        if (this.currentValue == null || this.currentValue == undefined) {
            this.currentValue = this.content[0];
        }
        if (this.chkBoxValue == null || this.chkBoxValue == undefined) {
            this.chkBoxValue = false;
        }
        // this.getSelectedValue();
        // this.getChkBoxValue();
    }

    getSelectedValue() {
        this.selectedValue.emit(this.currentValue);
    }

    getChkBoxValue() {
        this.checkBoxValue.emit(this.chkBoxValue);
    }
}