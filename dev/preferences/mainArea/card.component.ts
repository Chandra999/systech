import { Component, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PreferenceItem } from '../../common/preferenceItem';
import { PreferenceList } from '../../common/preferenceList';

@Component({
  selector: 'Card',
  templateUrl: 'public/html/mainArea/preferenceCard.template.html',
  styleUrls: ['public/css/mainArea/circularNavAdmin.css'],
  inputs: ['preferenceItem']
})

export class CardComponent {

  preferenceItem: PreferenceItem;

  constructor(private router: Router, private route: ActivatedRoute) {
    //empty
  }

  onClick() {
    console.log(this.preferenceItem.displayName);
    if (this.preferenceItem.displayName == "Display") {
      this.router.navigate(['Display'], { relativeTo: this.route });
    }
    else if (this.preferenceItem.displayName == "Account Information") {
      this.router.navigate(['Account'], { relativeTo: this.route });
    }
  }

}

