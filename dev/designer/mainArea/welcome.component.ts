import { Component } from '@angular/core';
import { AssetType } from '../../common/assetType';
import { Router } from '@angular/router';
import { WelcomeGraph } from './welcome.directive';
import { welcomeDescription } from '../../common/messages';

@Component({
    selector: 'unisecure-welcome-tab',
    template: `
          <div style='display :block'>
              <div align='center'>
               <span class = "welcomeHeaderFont welcomeHeader"> Welcome to</span>
               <img src='public/img/SYS_UniSecure.png' alt='UniSecure' style="width:300px; top: 50%; margin-top: -22px;"/>
               </div>
               <div>
                    <div *ngFor='let message of description'>
                        <p style='padding-left :200px; padding-right:200px; font-family: Montserrat ,Arial, sans-serif; !important; color:#3b73b9; font-size: 18px;'>{{message}}</p>
                    </div>
                </div>
          </div>
          <div align='center' style='overflow: auto; width:100px; height:350px;' sys-welcome  (welcomNodeClicked)='onNodeClicked($event)' >
          </div>
         <div style = 'float:right;  padding-right: 200px'> <span style="margin-right: 5px;"> Required </span> <hr id="required" style='display:inline-block; width:50px; text-align:center;  margin: 0;' /><br>
         <span style="margin-right: 10px"> Optional </span><hr id="optional" style='display:inline-block; width:50px;text-align:center;  margin: 0 auto' />
         </div>
    `,
    styleUrls: ['public/css/mainArea/welcome.css']

})

export class DesignerWelcomeComponent {

    description: string[] = welcomeDescription;

    constructor(private router: Router) {
        //empty
    }

    onNodeClicked(value) {
        if (value !== null) {
            let type = value.type;
            if (type === 'Family') {
                this.router.navigate([AssetType.Family, { editMode: 'create' }]);
            } else if (type === 'Product') {
                this.router.navigate([AssetType.Product, { editMode: 'create' }]);
            } else if (type === 'Calender') {
                console.log("Calender");
            } else if (type === 'LifeCycle') {
                console.log("Life Cycle");
            } else if (type === 'PackageProfile') {
                this.router.navigate([AssetType.PackageProfile, { editMode: 'create' }]);
            } else if (type === 'ItemRun') {
                console.log("Item Run");
            }

        }
    }
}