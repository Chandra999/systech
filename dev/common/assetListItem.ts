import {AssetItem} from './assetItem';

export class AssetListItem {
    chkBox: boolean;
    assetItem: AssetItem;
    constructor(item: AssetItem) {
        this.assetItem = item;
        this.chkBox = false;
    }
}