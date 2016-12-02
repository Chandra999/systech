import { AssetType } from './assetType';
import { DefaultConstants } from './default_values';

export class DescriptionEntry {
    user: string;
    description: string;
    date: string;

    constructor(name: string, description: string, date: string) {
        this.user = name;
        this.description = description;
        this.date = date;
    }

    static parse(object: Object): DescriptionEntry {
        var n_value: string = object.hasOwnProperty("user") ? object["user"] : '';
        var d_value: string = object.hasOwnProperty("description") ? object["description"] : '';
        var date: string = object.hasOwnProperty("date") ? object["date"] : '';
        return new DescriptionEntry(n_value, d_value, date);
    }

}
