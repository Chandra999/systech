import {AssetType} from './assetType';
import {DefaultConstants} from './default_values';
import {DescriptionEntry} from './extendedDescriptionEntry';
import {AssetItem} from './assetItem';
export var ACTION_REQUEST_SUBTYPES: string[] = ["Product", "UPC", "Serial", "User Name", "Email"];
export var ASSET_STATE: string[] = ["Delete", "Archive"];
export class OperatorAssetItem extends AssetItem {
    requestGroup: string = 'Activity Action';
    requestType: string = '';
    requestSubType: string = '';
    fromDate: Date = new Date();   // Stetting From Date to Today,s Date
    endDate: Date = new Date();     // Stetting To Date to Today,s Date
    action: string = 'Delete';
    value: string[] = [];
    singleValue: string = '';
    family: string = 'Any';
    uuid: string = null;
    constructor(type: AssetType, name: string, description: string, imageUrl: string, descritonJson: string) {
        super(type, name, description, imageUrl, descritonJson);
        this.requestType = OperatorAssetItem.getRequestType(this.assetType);
        this.requestSubType = OperatorAssetItem.getDefaultRequestSubType(this.assetType);
    };
    static parse(object: Object): OperatorAssetItem {
        var n_value: string = object.hasOwnProperty("objectName") ? object["objectName"] : '';
        var uniObjectTypeId: number = object.hasOwnProperty("uniObjectTypeId") ? object["uniObjectTypeId"] : 0;
        var type: AssetType = AssetItem.getAssetType(uniObjectTypeId);
        var d_value: string = object.hasOwnProperty("description") ? object["description"] : '';
        var d_vale_ex: string = object.hasOwnProperty("descriptionEx") ? object["descriptionEx"] : '';
        var imageUrl: string = object.hasOwnProperty("imageUrl") ? object["imageUrl"] : AssetItem.getDefaultImageUrl(type);
        imageUrl = DefaultConstants.DEFAULT_IMAGE_FOLDER_PATH + imageUrl;
        var newItem: OperatorAssetItem = new OperatorAssetItem(type, n_value, d_value, imageUrl, d_vale_ex);
        var profle_id: number = object.hasOwnProperty("profileId") ? object["profileId"] : 0;
        newItem.profileId = profle_id;
        var pk_id: number = object.hasOwnProperty("pkid") ? object["pkid"] : 0;
        newItem.pkid = pk_id;
        var uu_id: string = object.hasOwnProperty("uuid") ? object["uuid"] : '0';
        newItem.uuid = uu_id;
        var data_key: number = object.hasOwnProperty("datakey") ? object["datakey"] : 0;
        newItem.datakey = data_key;
        var requestGroup_value = object.hasOwnProperty('requestGroup') ? object['requestGroup'] : 'Activity Action';
        newItem.requestGroup = requestGroup_value;
        var requestType_value = object.hasOwnProperty('requestType') ? object['requestType'] : 'Item Authentication';
        newItem.requestType = requestType_value;
        var requestSubType_value = object.hasOwnProperty('requestSubType') ? object['requestSubType'] : 'User Name';
        newItem.requestSubType = requestSubType_value;
        //------------------------------------
        var keys_value: string = object.hasOwnProperty("keys") ? object["keys"] : '';
        if (Array.isArray(keys_value)) {
            for (var index = 0; index < keys_value.length; index++) {
                var key = keys_value[index];
                if (key.hasOwnProperty('value')) {
                    let filterValue = key['value'];
                    if (Array.isArray(filterValue)) {
                        if (newItem.requestSubType === 'UPC' || newItem.requestSubType === 'Serial') {
                            for (var v_index = 0; v_index < filterValue.length; v_index++) {
                                newItem.value.push(filterValue[v_index]);
                            }
                        } else {
                            newItem.singleValue = filterValue.length > 0 ? filterValue[0] : null;
                        }
                    }
                } else if (key.hasOwnProperty('fromDate')) {
                    let fromDatevalue: string = key['fromDate'];
                    newItem.fromDate = (fromDatevalue == null || fromDatevalue == '') ? new Date() : new Date(fromDatevalue);
                } else if (key.hasOwnProperty('endDate')) {
                    let endDatevalue: string = key['endDate'];
                    newItem.endDate = (endDatevalue == null || endDatevalue == '') ? new Date() : new Date(endDatevalue);
                } else if (key.hasOwnProperty('action')) {
                    newItem.action = key['action'];
                }
            }
        }
        //------------------------------------
        // if (object["content"] != undefined || object["content"] != null) {
        //     var content_value = object.hasOwnProperty("content") ? object["content"] : '';
        //     newItem.content = content_value;
        //     newItem.parseContentProperties();
        // }
        return newItem;
    }
    updateKey(preview: boolean, run: boolean) {
        this["keys"] = [];
        this["keys"].push({ 'fromDate': this.fromDate });
        this["keys"].push({ 'endDate': this.endDate });
        if (this.requestSubType === 'UPC' || this.requestSubType === 'Serial') {
            this["keys"].push({ 'value': this.value });
            this["keys"].push({ 'family': this.family });
        } else {
            this.value.splice(0, this.value.length);
            this.value.push(this.singleValue);
            if (preview == true) {
                this["keys"].push({ 'value': this.singleValue });
            } else {
                this["keys"].push({ 'value': this.value });
            }
        }
        if (run == true) {
            this["keys"].push({ 'action': this.action });
        }
        if (preview == true) {
            this["respondSize"] = "100";
            // this["uuid"] = this.pkid;
        }
    }
    // parseContentProperties() {
    //     if (this.content != null) {
    //         var jsonObj = JSON.parse(this.content);
    //         this.requestGroup = jsonObj.hasOwnProperty('requestGroup') ? jsonObj['requestGroup'] : 'Activity Action';
    //         this.requestType = OperatorAssetItem.getRequestType(this.assetType);
    //         this.requestSubType = jsonObj.hasOwnProperty('requestSubType') ? jsonObj['requestSubType'] : 'User Name';
    //         var keys_value: string = jsonObj.hasOwnProperty("keys") ? jsonObj["keys"] : '';
    //         if (Array.isArray(keys_value)) {
    //             for (var index = 0; index < keys_value.length; index++) {
    //                 var key = keys_value[index];
    //                 if (key.hasOwnProperty('value')) {
    //                     let filterValue = key['value'];
    //                     if (Array.isArray(filterValue)) {
    //                         if (this.requestSubType === 'UPC' || this.requestSubType === 'Serial') {
    //                             for (var v_index = 0; v_index < filterValue.length; v_index++) {
    //                                 this.value.push(filterValue[v_index]);
    //                             }
    //                         } else {
    //                             this.singleValue = filterValue.length > 0 ? filterValue[0] : '';
    //                         }
    //                     }
    //                 } else if (key.hasOwnProperty('fromDate')) {
    //                     let fromDatevalue: string = key['fromDate'];
    //                     this.fromDate = (fromDatevalue == null || fromDatevalue == '') ? new Date() : new Date(fromDatevalue);
    //                 } else if (key.hasOwnProperty('endDate')) {
    //                     let endDatevalue: string = key['endDate'];
    //                     this.endDate = (endDatevalue == null || endDatevalue == '') ? new Date() : new Date(endDatevalue);
    //                 } else if (key.hasOwnProperty('action')) {
    //                     this.action = key['action'];
    //                 }
    //             }
    //         }
    //     }
    // }
    // updateContentProperties() {
    //     var content = this.updateContent(false, true);
    //     this.content = JSON.stringify(content);
    // }
    // updateContent(preview: boolean, run: boolean): any {
    //     var content = {};
    //     content['requestGroup'] = this.requestGroup;
    //     content['requestType'] = this.requestType;
    //     content['requestSubType'] = this.requestSubType;
    //     content["keys"] = [];
    //     content["keys"].push({ 'fromDate': this.fromDate });
    //     content["keys"].push({ 'endDate': this.endDate });
    //     if (this.requestSubType === 'UPC' || this.requestSubType === 'Serial') {
    //         content["keys"].push({ 'value': this.value });
    //         content["keys"].push({ 'family': this.family });
    //     } else {
    //         this.value.splice(0, this.value.length);
    //         this.value.push(this.singleValue);
    //         if (preview == true) {
    //             content["keys"].push({ 'value': this.singleValue });
    //         } else {
    //             content["keys"].push({ 'value': this.value });
    //         }
    //     }
    //     if (run == true) {
    //         content["keys"].push({ 'action': this.action });
    //     }
    //     if (preview == true) {
    //         content["respondSize"] = "100";
    //         content["UUID"] = this.pkid;
    //     }
    //     return content;
    // }
    setRequestType(requestType: string) {
        let previousType = this.assetType;
        if (requestType == null || requestType === '') {
            //set to default
            this.assetType = AssetType.Action;
        } else if (requestType === 'Item Acquisition') {
            this.assetType = AssetType.ItemAcquisition;
        } else if (requestType === 'Item Authentication') {
            this.assetType = AssetType.ItemAuthentication;
        } else if (requestType === 'User Access') {
            this.assetType = AssetType.UserAccess;
        } else if (requestType === 'User Change') {
            this.assetType = AssetType.UserChange;
        } else if (requestType === 'Asset Management') {
            this.assetType = AssetType.AssetManagement;
        } else if (requestType === 'Lifecyle Changes') {
            this.assetType = AssetType.LifecycleChanges;
        } else if (requestType === 'Action') {
            this.assetType = AssetType.Action;
        }
        this.requestType = requestType;
        if (previousType != this.assetType) {
            let previousType = this.requestSubType;
            this.requestSubType = OperatorAssetItem.getDefaultRequestSubType(this.assetType);
            if (previousType != this.requestSubType) {
                if (this.value != null) {
                    this.value.splice(0, this.value.length);
                }
            }
        }
    }
    static getRequestType(assetType: AssetType) {
        switch (assetType) {
            case AssetType.Family:
            case AssetType.Product:
            case AssetType.Calender:
            case AssetType.LifeCycle:
            case AssetType.PackageProfile:
            case AssetType.ItemRun:
                return '';
            case AssetType.ItemAcquisition:
                return 'Item Acquisition';
            case AssetType.ItemAuthentication:
                return 'Item Authentication';
            case AssetType.UserAccess:
                return 'User Access';
            case AssetType.UserChange:
                return 'User Change';
            case AssetType.AssetManagement:
                return 'Asset Management';
            case AssetType.LifecycleChanges:
                return 'Lifecyle Changes';
            case AssetType.Action:
                return 'Action';
        }
        return '';
    }
    static getDefaultRequestSubType(assetType: AssetType) {
        switch (assetType) {
            case AssetType.Family:
            case AssetType.Product:
            case AssetType.Calender:
            case AssetType.LifeCycle:
            case AssetType.PackageProfile:
            case AssetType.ItemRun:
                return '';
            case AssetType.ItemAcquisition:
                return 'Serial';
            case AssetType.ItemAuthentication:
            case AssetType.UserAccess:
            case AssetType.UserChange:
            case AssetType.AssetManagement:
            case AssetType.LifecycleChanges:
            case AssetType.Action:
                return 'User Name';
        }
        return '';
    }
}