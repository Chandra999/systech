import { Component, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PreferenceItem } from '../../common/preferenceItem';
import { PreferenceList } from '../../common/preferenceList';

@Component({
  selector: 'preferenceCard',
  templateUrl: 'public/html/mainArea/preferenceCard.template.html',
  styleUrls: ['public/css/mainArea/circularNavAdmin.css'],
  inputs: ['preferenceItem']
})

export class PreferenceCardComponent {

  preferenceItem: PreferenceItem;

  constructor(private router: Router, private route: ActivatedRoute) {
    //empty
  }

  onClick() {
    if (this.preferenceItem.visible && this.preferenceItem.displayName == 'Users/Groups') {
      this.router.navigate(['usergroups'], { relativeTo: this.route });
      console.log(this.preferenceItem.item);
    }
    else if (this.preferenceItem.visible && this.preferenceItem.displayName == 'DNA') {
      this.router.navigate(['dna'], { relativeTo: this.route });
      console.log(this.preferenceItem.item);
    }
  }

}

