export var setUserName: string = 'username';
export var setSerial: string = 'serial';

export class ActivityTypes {

    public static getTypesOfActivity(): any[] {
        var activityTypes: any[] = [
            { "uniObjectTypeId": 15, "typeName": "Item Authentication" },
            { "uniObjectTypeId": 16, "typeName": "Item Acquisition" },
        ];
        return activityTypes;
    }

}