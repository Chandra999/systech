import { Component } from '@angular/core';

@Component({
    selector: 'systech-unisecure',
    template: `
        <unisecure-top></unisecure-top>
        <div id= "main-content" style="height:100%">
            <router-outlet></router-outlet>
        </div>
    `,
})

export class AppComponent {
}
