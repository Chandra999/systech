import { Component } from '@angular/core';
import { welcomeDescription } from '../../common/messages';

@Component({
    selector: 'sys-welcome-tab',
    template: `
        <div style='display :block'>
            <div align='center'>
               <span class = "welcomeHeaderFont welcomeHeader"> Welcome to</span>
               <img src='public/img/SYS_UniSecure.png' alt='UniSecure' style="width:300px; top: 50%; margin-top: -22px;"/>
            </div>
            <div style="padding-left:10px;">
                <div *ngFor='let message of description'>
                    <p style='padding-left:200px; padding-right:200px; font-family:Montserrat,Arial,sans-serif !important; color:#3b73b9; font-size:18px;'>{{message}}</p>
                </div>
            </div>
        </div>

    `,
    styleUrls: ['public/css/mainArea/welcome.css']
})

export class OperatorWelcomeComponent {

    description: string[] = welcomeDescription;

    constructor() {
    }
}
