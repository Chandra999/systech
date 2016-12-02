import {UserGroup} from './usergroup';
import {DEFAULT_IMAGE_URL} from '../common/defaultHost';

export class UserItem {
  uid: number;
  userName: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  imageURL: string;
  imageId: number;
  groupsJson: any;
  userGroupList: any = [];
  jsonObject: any;
  jsonInvitationObject: any;
  uuid: number;
  selectedUserGroups: Array<UserGroup> = new Array<UserGroup>();
  vPassword: string;
  useGravatar: boolean;
  invalidatePassword: boolean;

  constructor(uid: number, username: string, password: string, firstname: string, lastname: string, email: string, imageId: number, imageName: string, isSyncGravatar: boolean, invalidatePassword: boolean) {
    this.uid = uid;
    this.userName = username;
    this.password = password;
    this.firstName = firstname;
    this.lastName = lastname;
    this.email = email;
    this.imageId = imageId;
    this.imageURL = imageName;
    this.useGravatar = isSyncGravatar;
    this.invalidatePassword = invalidatePassword;
    this.jsonObject = {};
    this.jsonInvitationObject = {};
  
  }

  updateJSONObject() {
    this.jsonObject.userName = this.userName;
    this.jsonObject.firstName = this.firstName;
    this.jsonObject.lastName = this.lastName;
    this.jsonObject.email = this.email;
    this.jsonObject.password = this.password;
    this.jsonObject.imageURL = this.imageURL;
    this.jsonObject.useGravatar = this.useGravatar;
    this.jsonObject.invalidatePassword = this.invalidatePassword;
    this.jsonObject.userGroupList = this.userGroupList;
  }

  updatJSONObject() {
    this.jsonObject.userName = this.userName;
    this.jsonObject.firstName = this.firstName;
    this.jsonObject.lastName = this.lastName;
    this.jsonObject.email = this.email;
    this.jsonObject.imageURL = this.imageURL;
    this.jsonObject.useGravatar = this.useGravatar;
    this.jsonObject.invalidatePassword = this.invalidatePassword;
    this.jsonObject.userGroupList = this.userGroupList;
  }

  updateInvitationJSONObject() {
    this.jsonInvitationObject.userName = this.userName;
    this.jsonInvitationObject.password = this.password;
    this.jsonInvitationObject.firstName = this.userName;
    this.jsonInvitationObject.lastName = this.lastName;
    this.jsonInvitationObject.email = this.email;

  }
  static parse(object: Object): UserItem {
    var id_value: number = object.hasOwnProperty("pkid") ? object["pkid"] : '';
    var u_value: string = object.hasOwnProperty("userName") ? object["userName"] : '';
    var p_value: string = object.hasOwnProperty("password") ? object["password"] : '';
    var f_value: string = object.hasOwnProperty("firstName") ? object["firstName"] : '';
    var l_value: string = object.hasOwnProperty("lastName") ? object["lastName"] : '';
    var email: string = object.hasOwnProperty("email") ? object["email"] : '';
    var image_id: number = object.hasOwnProperty("imageId") ? object["imageId"] : '';
    var sync: boolean = object.hasOwnProperty("useGravatar") ? object["useGravatar"] : '';
    var invPwd: boolean = object.hasOwnProperty("invalidatePassword") ? object["invalidatePassword"] : '';
   var imageName: string = object.hasOwnProperty("imagePath") ? object["imagePath"] : '';
    // imageName = DEFAULT_IMAGE_URL + imageName
    var newItem: UserItem = new UserItem(id_value, u_value, p_value, f_value, l_value, email, image_id, imageName, sync, invPwd);
    newItem.jsonObject = object;
    var uu_id: number = object.hasOwnProperty("uniuid") ? object["uniuid"] : 0;
    newItem.uuid = uu_id;
    var selGroup: any = object.hasOwnProperty("userGroupList") ? object["userGroupList"] : '';
    newItem.userGroupList = selGroup;
    return newItem;
  }
}
