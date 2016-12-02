import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PreferenceItem } from '../../common/preferenceItem';
import { PreferenceCardComponent } from './preferenceCard.component';
import { PreferenceList } from '../../common/preferenceList';
@Component({
    selector: 'unisecure-admin-welcome',
    template: `
    <div class="topnav uni-card2" style="position:fixed; top:68px; padding:0px; color :white; z-index:1">
        <div style="overflow:auto">
            <div style="overflow:hidden;height:44px;text-align:center;z-index:1">
               <a  title="System Preferences">
                  <i style="text-align:center;display:block;"></i>System Preferences
               </a>
            </div>
        </div>
    </div>
    <div>
         <div>
              <div class="row" style="margin-left:20px; margin-right:30px">
                   <preferenceCard *ngFor="let item of PREFER_LIST" [preferenceItem]=item></preferenceCard>
              </div>
          </div>
     </div>
    ` ,
    styleUrls: ['public/css/topBanner/topBanner.css']
})

export class AdministratorWelcomeComponent {

    constructor(private routeParams: ActivatedRoute, private router: Router) {
        //empty
    }

    PREFER_LIST: PreferenceItem[] = [
        new PreferenceItem(PreferenceList.LDAP),
        new PreferenceItem(PreferenceList.User),
        new PreferenceItem(PreferenceList.DNA),
    ];
}
