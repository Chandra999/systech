
export class UserGroup {

  groupid: number;
  name: string;
  roles: string[];
  description: string;
  action: boolean;
  // jsonObject: any;
  // groupsJsonObject: any;

  constructor(groupid: number, name: string, description: string, roles: string[], action: boolean) {
    this.groupid = groupid;
    this.name = name;
    this.description = description;
    this.roles = roles;
    this.action = action;
    // this.jsonObject = {};
    // this.groupsJsonObject = {};
  }

  // updateJSONObject() {
  //   this.jsonObject.id = this.groupid;
  //   this.jsonObject.name = this.name;
  //   this.jsonObject.description = this.description;
  //   this.jsonObject.roles = this.roles;
  // }

  static parse(object: Object): UserGroup {
    var uniObjectTypeId: number = object.hasOwnProperty("uniObjectTypeId") ? object["uniObjectTypeId"] : 0;
    var pk_id: number = object.hasOwnProperty("id") ? object["id"] : 1;
    var n_value: string = object.hasOwnProperty("name") ? object["name"] : '';
    var d_value: string = object.hasOwnProperty("description") ? object["description"] : '';
    var r_value: string[] = object.hasOwnProperty("roleIdList") ? object["roleIdList"] : '';
    var a_value: boolean = object.hasOwnProperty("action") ? object["action"] : '';
    var usergroup: UserGroup = new UserGroup(pk_id, n_value, d_value, r_value, a_value);
    // usergroup.jsonObject = object;
    // usergroup.groupid = pk_id;
    return usergroup;
  }
}
