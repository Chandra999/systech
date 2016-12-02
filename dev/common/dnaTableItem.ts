import { AssetType } from './assetType';
import { AssetItem } from './assetItem';

export class DnaTableItem {
    name: string;
    isModifiable: boolean;
    isSearchable: boolean;
    datatype: string;
    value: Object;

    constructor(name: string, isModifiable: boolean, isSearchable: boolean, dataType: string, value: Object) {
        this.name = name;
        this.isModifiable = isModifiable;
        this.isSearchable = isSearchable;
        this.value = value;
        this.datatype = dataType;
    }
}