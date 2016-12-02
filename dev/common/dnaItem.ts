import { AssetType } from './assetType';
import { AssetItem } from './assetItem';

export class DnaItem {
    assetType: AssetType;
    assetItem: AssetItem;
    name: string;
    isModifiable: boolean;
    isSearchable: boolean;
    datatype: string;
    value: string;
    active: boolean;
    description: string;
    objectName: string;
    profileId: number;
    uniObjectTypeId: number;
    updatorName: string;
    imageId: number;
    createDate: string;
    creatorName: string;
    pkid: number;
    content: string;
    jsonObject: any;


    constructor(active: boolean, content: string, objectName: string, profileId: number) {
        this.active = active;
        this.content = content;
        this.objectName = objectName;
        this.profileId = 1;
        this.uniObjectTypeId = AssetItem.getUniTypeValue(AssetType.Dna);
        this.jsonObject = {};

    }

    createJSONObject() {
        this.jsonObject.active = this.active;
        this.jsonObject.content = this.content;
        this.jsonObject.objectName = this.objectName;
        this.jsonObject.profileId = 1;
        this.jsonObject.uniObjectTypeId = 27;
    }

    updateJSONObject() {
        this.jsonObject.pkid = this.pkid;
        this.jsonObject.active = this.active;
        this.jsonObject.content = this.content;
        this.jsonObject.objectName = this.objectName;
        this.jsonObject.profileId = 1;
        this.jsonObject.uniObjectTypeId = 27;

    }
}