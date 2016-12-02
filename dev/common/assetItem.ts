import { AssetType } from './assetType';
import { DefaultConstants } from './default_values';
import { DescriptionEntry } from './extendedDescriptionEntry';

export class AssetItem {
    assetType: AssetType;
    name: string;
    description: string;
    imageUrl: string;
    profileId: number = 1;
    extendedDescription: Array<DescriptionEntry> = new Array<DescriptionEntry>();
    pkid: number;
    content: string;
    datakey: number;
    createDate: string;
    createDateForSorting: string;
    creatorName: string;
    updateDate: string;
    updateDateForSorting: string;
    updatorName: string;
    active: boolean;
    dirtyFlag: boolean;

    constructor(type: AssetType, name: string, description: string, imageUrl: string, descritonJson: string) {
        this.assetType = type;
        this.name = name;
        this.description = description;
        if (imageUrl == null || imageUrl == '') {
            imageUrl = DefaultConstants.DEFAULT_IMAGE_FOLDER_PATH + AssetItem.getDefaultImageUrl(type);
        }
        this.imageUrl = imageUrl;
        if (descritonJson != null && descritonJson != '') {
            try {
                var jsonObj = JSON.parse(descritonJson);
                if (jsonObj != null && jsonObj.length > 0) {
                    for (var index = 0; index < jsonObj.length; index++) {
                        let entry: DescriptionEntry = DescriptionEntry.parse(jsonObj[index]);
                        if (entry != null) {
                            this.addExtendedDescription(entry);
                        }
                    }
                }
            } catch (e) {
                console.log("invalid description JSON" + descritonJson);
            }
        }
    }

    addExtendedDescription(entry: DescriptionEntry) {
        this.extendedDescription.push(entry);
    }

    updateJSONObject() {
        this.pkid = this.pkid == 0 ? 1 : this.pkid;
        this["objectName"] = this.name;
        this.description = this.description;
        this.active = this.active;
        this["uniObjectTypeId"] = AssetItem.getUniTypeValue(this.assetType);
        this.profileId = this.profileId;
        this.datakey = this.datakey;
        this["descriptionEx"] = JSON.stringify(this.extendedDescription);
    }

    getExtendedDescription() {
        return this.extendedDescription;
    }

    static parse(object: Object): AssetItem {
        console.log(object);
        var n_value: string = object.hasOwnProperty("objectName") ? object["objectName"] : '';
        var uniObjectTypeId: number = object.hasOwnProperty("uniObjectTypeId") ? object["uniObjectTypeId"] : 0;
        var type: AssetType = AssetItem.getAssetType(uniObjectTypeId);
        var d_value: string = object.hasOwnProperty("description") ? object["description"] : '';
        var d_vale_ex: string = object.hasOwnProperty("descriptionEx") ? object["descriptionEx"] : '';
        if (type == AssetType.Product) {
            var imageId = object.hasOwnProperty("imageId") ? object["imageId"] : 0;
            var image: string = object.hasOwnProperty("image") ? object["image"] : null;
            if (imageId != null && imageId != 0 && image != null) {
                var imageUrl: string = image["imageURL"];
                imageUrl = DefaultConstants.DEFAULT_BASEURL + imageUrl;
            }
        }
        else {
            var imageUrl: string = object.hasOwnProperty("imageUrl") ? object["imageUrl"] : AssetItem.getDefaultImageUrl(type);
            imageUrl = DefaultConstants.DEFAULT_IMAGE_FOLDER_PATH + imageUrl;
        }

        console.log(imageUrl);
        var newItem: AssetItem = new AssetItem(type, n_value, d_value, imageUrl, d_vale_ex);
        var profle_id: number = object.hasOwnProperty("profileId") ? object["profileId"] : 0;
        newItem.profileId = profle_id;
        var pk_id: number = object.hasOwnProperty("pkid") ? object["pkid"] : 0;
        newItem.pkid = pk_id;
        var data_key: number = object.hasOwnProperty("datakey") ? object["datakey"] : 0;
        newItem.datakey = data_key;
        var cN_value: string = object.hasOwnProperty("creatorName") ? object["creatorName"] : '';
        newItem.creatorName = cN_value;
        var cD_value: string = object.hasOwnProperty("createDate") ? object["createDate"] : null;
        newItem.createDate = this.adjustDate(cD_value);
        newItem.createDateForSorting = cD_value;
        var uN_value: string = object.hasOwnProperty("updatorName") ? object["updatorName"] : '';
        newItem.updatorName = uN_value;
        var uD_value: string = object.hasOwnProperty("updateDate") ? object["updateDate"] : null;
        if (uD_value != null && uD_value != undefined && uD_value != '') {
            newItem.updateDate = this.adjustDate(uD_value);
            newItem.updateDateForSorting = uD_value;
        } else {
            newItem.updateDate = null;
            newItem.updateDateForSorting = new Date().toISOString();
        }
        if (object["content"] != undefined || object["content"] != null) {
            var content_value = object.hasOwnProperty("content") ? object["content"] : '';
            newItem.content = content_value;
        }
        var active_value: boolean = object.hasOwnProperty("active") ? object["active"] : true;
        newItem.active = active_value;
        newItem.dirtyFlag = false
        return newItem;
    }
    static adjustDate(date) {
        if (date != null && date != undefined) {
            var firstPart = date.slice(0, date.length - 2);
            var secondPart = date.slice(date.length - 2, date.length);
            date = firstPart + ":" + secondPart;
        }
        return date;
    }
    static getDefaultImageUrl(assetType: AssetType) {
        switch (assetType) {
            case AssetType.Family:
                return 'unisecure_icon_family_nav.png';
            case AssetType.Product:
                return 'unisecure_icon_product_nav.png';
            case AssetType.Calender:
                return 'unisecure_icon_calendar.svg';
            case AssetType.LifeCycle:
                return 'unisecure_icon_cycle.svg';
            case AssetType.PackageProfile:
                return 'unisecure_icon_packageprofile_nav.png';
            case AssetType.ItemRun:
                return 'unisecure_icon_itemrun.svg';
            case AssetType.ItemAcquisition:
            case AssetType.ItemAuthentication:
            case AssetType.UserAccess:
            case AssetType.UserChange:
            case AssetType.AssetManagement:
            case AssetType.LifecycleChanges:
            case AssetType.Action:
                return 'web_icon_action.svg';
            case AssetType.View:
                return 'web_icon_action.svg';
        }
        return 'image_place_holder.png';
    }
    static getDisplayName(assetType: AssetType) {
        switch (assetType) {
            case AssetType.Family:
                return 'Family';
            case AssetType.Product:
                return 'Products';
            case AssetType.Calender:
                return 'Calendar';
            case AssetType.LifeCycle:
                return 'Life Cycle';
            case AssetType.PackageProfile:
                return 'Package Profile';
            case AssetType.ItemRun:
                return 'Item Run';
            case AssetType.ItemAcquisition:
            case AssetType.ItemAuthentication:
            case AssetType.UserAccess:
            case AssetType.UserChange:
            case AssetType.AssetManagement:
            case AssetType.LifecycleChanges:
            case AssetType.Action:
                return 'Action';
            case AssetType.View:
                return 'View';
            case AssetType.PublishedFamily:
                return 'Published Family';
        }
        return '';
    }
    static getUniTypeValue(assetType: AssetType) {
        switch (assetType) {
            case AssetType.Product:
                return 10;
            case AssetType.Calender:
                return 8;
            case AssetType.LifeCycle:
                return 9;
            case AssetType.Family:
                return 12;
            case AssetType.ItemRun:
                return 13;
            case AssetType.ItemAcquisition:
                return 15;
            case AssetType.ItemAuthentication:
                return 16;
            case AssetType.UserAccess:
                return 17;
            case AssetType.UserChange:
                return 18;
            case AssetType.AssetManagement:
                return 19;
            case AssetType.LifecycleChanges:
                return 20;
            case AssetType.Action:
                return 23;
            case AssetType.PackageProfile:
                return 25;
            case AssetType.View:
                return 26;
            case AssetType.Dna:
                return 27;
        }
        return 1;
    }
    static getAssetType(uniTypeValue: number) {
        if (uniTypeValue === 12) {
            return AssetType.Family;
        }
        if (uniTypeValue === 10) {
            return AssetType.Product;
        }
        if (uniTypeValue === 8) {
            return AssetType.Calender;
        }
        if (uniTypeValue === 9) {
            return AssetType.LifeCycle;
        }
        if (uniTypeValue === 25) {
            return AssetType.PackageProfile;
        }
        if (uniTypeValue === 13) {
            return AssetType.ItemRun;
        }
        if (uniTypeValue === 15) {
            return AssetType.ItemAcquisition;
        }
        if (uniTypeValue === 16) {
            return AssetType.ItemAuthentication;
        }
        if (uniTypeValue === 17) {
            return AssetType.UserAccess;
        }
        if (uniTypeValue === 18) {
            return AssetType.UserChange;
        }
        if (uniTypeValue === 19) {
            return AssetType.AssetManagement;
        }
        if (uniTypeValue === 20) {
            return AssetType.LifecycleChanges;
        }
        if (uniTypeValue === 23) {
            return AssetType.Action;
        }
        if (uniTypeValue === 25) {
            return AssetType.PackageProfile;
        }
        if (uniTypeValue === 27) {
            return AssetType.Dna;
        }
        if (uniTypeValue === 28) {
            return AssetType.PublishedFamily;
        }
        return AssetType.PublishedFamily;
    }
    static isOperatorType(assetType: AssetType) {
        return (assetType === AssetType.ItemAcquisition
            || assetType === AssetType.ItemAuthentication
            || assetType === AssetType.UserAccess
            || assetType === AssetType.UserChange
            || assetType === AssetType.AssetManagement
            || assetType === AssetType.LifecycleChanges
            || assetType === AssetType.Action);
    }
    static isArray(element: any) {
        return Object.prototype.toString.call(element) === '[object Array]';
    }
}