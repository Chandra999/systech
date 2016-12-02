import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PreferenceItem } from '../../common/preferenceItem';
import { PreferenceList } from '../../common/preferenceList';
@Component({
    selector: 'unisecure-preferences',
    template: `
    <div class="topnav uni-card2" style="position:fixed; top:68px; padding:0px; color :white; z-index:1">
        <div style="overflow:auto">
            <div style="overflow:hidden;height:44px;text-align:center;z-index:1">
               <a  title="Preferences">
                  <i style="text-align:center;display:block;"></i>Preferences
               </a>
            </div>
        </div>
    </div>
    <div>
         <div>
              <div class="row" style="margin-left:20px; margin-right:30px">
                   <Card *ngFor="let item of PREFER_LIST" [preferenceItem]=item></Card>
              </div>
          </div>
     </div>
    ` ,
    styleUrls: ['public/css/topBanner/topBanner.css']
})

export class PreferencesComponent {

    constructor(private router: Router) {
        //empty
    }

    PREFER_LIST: PreferenceItem[] = [
        new PreferenceItem(PreferenceList.DISPLAY),
        new PreferenceItem(PreferenceList.USER_ACCOUNT)
    ];
}
