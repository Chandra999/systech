import { Component } from '@angular/core';
import { AdministratorWelcomeComponent } from './mainArea/welcome.component';


@Component({
    selector: 'systech-unisecure-admin',
    template: `
        <div id= "main-content" style="position:relative;top:115px; height:100%;">
                 <router-outlet></router-outlet>
         </div>
    `,
})

export class AdministratorAppComponent {

    constructor() {
        //empty
    }
}
