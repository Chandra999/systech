import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {EnumUtil} from '../common/EnumUtil';
import {AssetType} from '../common/assetType';
import {AssetItem} from '../common/assetItem';
import {FAMILY_LIST} from '../mock/list';
import {PRODUCT_LIST} from '../mock/list';
import {CALENDER_LIST} from '../mock/list';
import {CAMERA_LIST} from '../mock/list';
import {LIFECYCLE_LIST} from '../mock/list';
import {ITEMRUN_LIST} from '../mock/list';
import {DATETYPES} from '../mock/list';
import {EVENTS} from '../mock/list';
import 'rxjs/Rx';


@Injectable()
export class AssetsServices {
    _types: string[];


    constructor(private http: Http) {
        this._types = EnumUtil.getNames(AssetType);
    }

    getAssets(type: AssetType, refresh: boolean) {

        var fileName = '';
        let index = this._types.indexOf(EnumUtil.getEnumAsString(AssetType, type));
        console.log("constructor set index = " + index);
        console.log("constructor set index = " + type);
        switch (type) {
            case AssetType.Family:
                fileName = 'scence.json';
                return FAMILY_LIST;
            case AssetType.Product:
                fileName = 'Products.json';
                return PRODUCT_LIST;
            case AssetType.Calender:
                fileName = 'sites.json';
                return CALENDER_LIST;
            case AssetType.LifeCycle:
                fileName = 'environments.json';
                return LIFECYCLE_LIST;
            case AssetType.PackageProfile:
                fileName = 'guardians.json';
                return CAMERA_LIST;
            case AssetType.ItemRun:
                return ITEMRUN_LIST;

        }
        return null;
    }

    getItem(type: AssetType, index: number) {
        switch (type) {
            case AssetType.Family:
                return FAMILY_LIST[index];
            case AssetType.Product:
                return PRODUCT_LIST[index];
            case AssetType.Calender:
                return CALENDER_LIST[index];
            case AssetType.LifeCycle:
                return LIFECYCLE_LIST[index];
            case AssetType.PackageProfile:
                return CAMERA_LIST[index];
            case AssetType.ItemRun:
                return ITEMRUN_LIST[index];

        }
        return null;
    }
    getIndexOfItem(type: AssetType, item: AssetItem) {
        switch (type) {
            case AssetType.Family:
                return FAMILY_LIST.indexOf(item);
            case AssetType.Product:
                return PRODUCT_LIST.indexOf(item);
            case AssetType.Calender:
                return CALENDER_LIST.indexOf(item);
            case AssetType.LifeCycle:
                return LIFECYCLE_LIST.indexOf(item);
            case AssetType.PackageProfile:
                return CAMERA_LIST.indexOf(item);
            case AssetType.ItemRun:
                return ITEMRUN_LIST.indexOf(item);

        }

    }
    insertItem(type: AssetType, item: AssetItem) {
        switch (type) {
            case AssetType.Family:
                return FAMILY_LIST.push(item);
            case AssetType.Product:
                return PRODUCT_LIST.push(item);
            case AssetType.Calender:
                return CALENDER_LIST.push(item);
            case AssetType.LifeCycle:
                return LIFECYCLE_LIST.push(item);
            case AssetType.PackageProfile:
                return CAMERA_LIST.push(item);
            case AssetType.ItemRun:
                return ITEMRUN_LIST.push(item);
        }
    }


    deleteItem(type: AssetType, item: AssetItem) {
        switch (type) {
            case AssetType.Family:
                return FAMILY_LIST.splice(FAMILY_LIST.indexOf(item), 1);
            case AssetType.Product:
                return PRODUCT_LIST.splice(PRODUCT_LIST.indexOf(item), 1);
            case AssetType.Calender:
                return CALENDER_LIST.splice(CALENDER_LIST.indexOf(item), 1);
            case AssetType.LifeCycle:
                return LIFECYCLE_LIST.splice(LIFECYCLE_LIST.indexOf(item), 1);
            case AssetType.PackageProfile:
                return CAMERA_LIST.splice(CAMERA_LIST.indexOf(item), 1);
            case AssetType.ItemRun:
                return ITEMRUN_LIST.splice(ITEMRUN_LIST.indexOf(item), 1);

        }
    }

    updateItem(type: AssetType, index: number, item: AssetItem) {
        switch (type) {
            case AssetType.Family:
                FAMILY_LIST[index] = item;
                break;
            case AssetType.Product:
                PRODUCT_LIST[index] = item;
                break;
            case AssetType.Calender:
                CALENDER_LIST[index] = item;
                break;
            case AssetType.LifeCycle:
                LIFECYCLE_LIST[index] = item;
                break;
            case AssetType.PackageProfile:
                CAMERA_LIST[index] = item;
                break;
            case AssetType.ItemRun:
                ITEMRUN_LIST[index] = item;

        }
    }
    getDateTypes() {
        return DATETYPES;
    }

    getEvents() {
        return EVENTS;
    }

}
