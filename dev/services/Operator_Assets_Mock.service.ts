import { Injectable } from '@angular/core';
import { EnumUtil } from '../common/EnumUtil';
import { AssetType } from '../common/assetType';
import { AssetItem } from '../common/assetITem';
import { VIEW_LIST } from '../mock/list';
import { FAVORITE_LIST } from '../mock/list';
import { ACTION_LIST } from '../mock/list';
import { Http, Headers, Response } from '@angular/http';//Needed for http request
import 'rxjs/add/operator/map';//Needed for map in http request

@Injectable()
export class Operator_AssetsServices_Mock {
    _types: string[];
    constructor(private http: Http) {
        this._types = EnumUtil.getNames(AssetType);
    }

    getAssets(type: AssetType, refresh: boolean) {
        var fileName = '';
        let index = this._types.indexOf(EnumUtil.getEnumAsString(AssetType, type));
        console.log("constructor set index = " + index);
        switch (type) {
            case AssetType.View:
                fileName = 'View.json';
                return VIEW_LIST;
            case AssetType.Favorite:
                fileName = 'Favorite.json';
                return FAVORITE_LIST;
        }
        return null;
    }

    getItem(type: AssetType, index: number) {
        switch (type) {
            case AssetType.View:
                return VIEW_LIST[index];
            case AssetType.Favorite:
                return FAVORITE_LIST[index];
        }
        return null;
    }
    getIndexOfItem(type: AssetType, item: AssetItem) {
        switch (type) {
            case AssetType.View:
                return VIEW_LIST.indexOf(item);
            case AssetType.Favorite:
                return FAVORITE_LIST.indexOf(item);
        }
    }

    insertItem(type: AssetType, item: AssetItem) {
        switch (type) {
            case AssetType.View:
                return VIEW_LIST.push(item);
            case AssetType.Favorite:
                return FAVORITE_LIST.push(item);
        }
    }

    deleteItem(type: AssetType, item: AssetItem) {
        switch (type) {
            case AssetType.View:
                return VIEW_LIST.splice(VIEW_LIST.indexOf(item), 1);
            case AssetType.Favorite:
                return FAVORITE_LIST.splice(FAVORITE_LIST.indexOf(item), 1);
        }
    }

    updateItem(type: AssetType, index: number, item: AssetItem) {
        switch (type) {
            case AssetType.View:
                VIEW_LIST[index] = item;
                break;
            case AssetType.Favorite:
                FAVORITE_LIST[index] = item;
                break;
        }
    }
}
