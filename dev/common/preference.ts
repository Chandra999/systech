export class Preference {
    name: string;
    value: string;
    pkid:number;
    profileId:number;
    userId:string;
    displayName:string;
    valueList:string[] = [];
    
    constructor(key: string, value: string) {
        this.name = key;
        this.value = value;
    }

    static parse(object: Object): Preference {
        var name: string = object.hasOwnProperty("name") ? object["name"] : '';
        var value: string = object.hasOwnProperty("value") ? object["value"] : '';
        var pkid: number = object.hasOwnProperty("pkid") ? object["pkid"] : 0;
        var profileId: number = object.hasOwnProperty("profileId") ? object["profileId"] : 1;
        var userId: string = object.hasOwnProperty("userId") ? object["userId"] : '';
        var displayName: string = object.hasOwnProperty("displayName") ? object["displayName"] : '';
        let valueList = object.hasOwnProperty("valueList") ? object["valueList"] : '';
        var values = [];
        if (Array.isArray(valueList)) {
             for (var index = 0; index < valueList.length; index++) {
                values.push(valueList[index]);
            }
        }
        let userPreference : Preference= new Preference(name,value);
        userPreference.pkid = pkid;
        userPreference.profileId= profileId;
        userPreference.userId = userId;
        userPreference.displayName = displayName;
        userPreference.valueList = values;
        return userPreference;
    }
}