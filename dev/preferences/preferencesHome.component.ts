import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'systech-unisecure-preferences',
    template: `
        <div id= "main-content" style="position:absolute;top:115px; height:100%;">
            <router-outlet></router-outlet>
        </div>
    `,
})

export class PreferencesHomeComponent {

    constructor(private _router: Router) {
        //empty
    }
}
