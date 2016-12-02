import { Component, OnInit } from '@angular/core';
import { MessageService } from '../../../services/message.service';

@Component({
    selector: 'app-search-box',
    template: `<div id="searchBox" style="float:right">
                <form (ngSubmit)="search()">
                    <div id="searchForm">
                        <input type="text" autocomplete="off" [(ngModel)]="errorQuery" name="error" (keyup)="errorQuery = errorQuery.toUpperCase()" id="search" placeholder="Find by ID"
                        />
                        <button type="submit" id="searchButton"><img width="15px" height="15px" src='data:image/svg+xml;utf8,<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="512px" height="512px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve"> <path d="M445,386.7l-84.8-85.9c13.8-24.1,21-50.9,21-77.9c0-87.6-71.2-158.9-158.6-158.9C135.2,64,64,135.3,64,222.9 c0,87.6,71.2,158.9,158.6,158.9c27.9,0,55.5-7.7,80.1-22.4l84.4,85.6c1.9,1.9,4.6,3.1,7.3,3.1c2.7,0,5.4-1.1,7.3-3.1l43.3-43.8 C449,397.1,449,390.7,445,386.7z M222.6,125.9c53.4,0,96.8,43.5,96.8,97c0,53.5-43.4,97-96.8,97c-53.4,0-96.8-43.5-96.8-97 C125.8,169.4,169.2,125.9,222.6,125.9z"/> </svg>'/></button>
                    </div>
                    <span id="searchError">{{searchError}}</span>
                </form>
            </div>`,
    styles: [`
            div#searchBox {
                position: absolute;
                right: 20px;
                bottom: 5px;
            }

            div#searchForm {
                position: relative;
                display: inline-block;
            }

            input#search {
                border-radius: 3px;
                border: 1px solid #ccc;
                box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);
                font-size: 10px;
                text-transform: uppercase;
            }

            button#searchButton {
                transition: 50ms;
                width: 17px;
                height: 12px;
                margin-left: -17px;
                padding: 0;
                border: none;
                background: transparent;
                position: absolute;
                right: 0;
                bottom: 3px;
                opacity: .3;
            }

            button#searchButton:hover {
                transition: 50ms;
                opacity: .8;
            }

            span#searchError {
                font-size: 11px;
            }
            `]
})

export class SearchBoxComponent implements OnInit {
    private errorQuery: string = '';
    private searchError: string = '';

    constructor(private ms: MessageService) { }

    ngOnInit() {
    }

    private search() {
        let q = this.errorQuery;
        if (q.length <= 3) {
            this.searchError = 'Enter a valid message ID';
            return;
        }
        this.searchError = '';
        let pref = q.slice(0, 3);
        let id = q.slice(3);
        if (!Number.parseInt(id.slice(id.length - 1))) id = id.slice(0, id.length - 1);
        if (!Number.parseInt(id)) {
            this.searchError = 'Invalid ID format';
            return;
        }
        this.ms.displayMessage(pref, null, Number.parseInt(id))
            .subscribe(value => {   // TODO Revise to include localization
                if (!value || value["Error"]) {
                    this.searchError = 'Message not found';
                } else if (value.key) {
                    value.src = "SEARCH RESULT";
                }
            })
    }

}
