import {DefaultConstants} from './default_values';
import {welcomeLDAP} from './messages';
import {welcomeUser} from './messages';
import {welcomeDNA} from './messages';
import {welcomeDisplay} from './messages';
import {welcomeUserAccount} from './messages';
import {PreferenceList} from './preferenceList';

export class PreferenceItem {
  item: PreferenceList;
  name: string;
  description: string;
  imageUrl: string;
  displayName: string;
  visible: boolean;
  constructor(item: PreferenceList) {
    this.name = name;
    this.description = PreferenceItem.getDescription(item);
    this.imageUrl = DefaultConstants.DEFAULT_IMAGE_FOLDER_PATH + PreferenceItem.getDefaultImageUrl(item);
    console.log(this.imageUrl);
    this.displayName = PreferenceItem.getDisplayName(item);
    this.visible = PreferenceItem.getAccess(item);
  }

  static getAccess(item) {
    switch (item) {
      case 'LDAP':
        return false;
      case 'User':
        return true;
      case 'DNA':
        return true;
      case 'Display':
        return true;
      case 'UserAccount':
        return true;
    }
    return false;

  }

  static getDefaultImageUrl(name) {
    switch (name) {
      case 'LDAP':
        return 'unisecure_icon_ldap.svg';
      case 'User':
        return 'unisecure_icon_usergroup.svg';
      case 'DNA':
        return 'unisecure_icon_dna.svg';
      case 'Display':
        return 'unisecure_icon_display.png';
      case 'UserAccount':
        return 'unisecure_icon_usergroup.svg';

    }
    return 'image_place_holder.png';
  }

  static getDisplayName(name) {
    switch (name) {
      case 'LDAP':
        return 'LDAP';
      case 'User':
        return 'Users/Groups';
      case 'DNA':
        return 'DNA';
      case 'Display':
        return 'Display';
      case 'UserAccount':
        return 'Account Information';
    }
    return '';

  }
  static getDescription(name) {
    switch (name) {
      case 'LDAP':
        return welcomeLDAP;
      case 'User':
        return welcomeUser;
      case 'DNA':
        return welcomeDNA;
      case 'Display':
        return welcomeDisplay;
      case 'UserAccount':
        return welcomeUserAccount;
    }
    return '';
  }
}
