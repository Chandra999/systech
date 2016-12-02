import {AssetType} from './assetType';
import {DefaultConstants} from './default_values';
import {DescriptionEntry} from './extendedDescriptionEntry';
import {AssetItem} from './assetItem';

export class ViewAssetItem extends AssetItem {
    UUID: string = null;
    img: string;
    constructor(type: AssetType, name: string, description: string, imageUrl: string, descritonJson: string) {
        super(type, name, description, imageUrl, descritonJson);
    }
    static parse(object: Object): ViewAssetItem {
        var n_value: string = object.hasOwnProperty("objectName") ? object["objectName"] : '';
        var uniObjectTypeId: number = object.hasOwnProperty("uniObjectTypeId") ? object["uniObjectTypeId"] : 0;
        var type: AssetType = AssetItem.getAssetType(uniObjectTypeId);
        var d_value: string = object.hasOwnProperty("description") ? object["description"] : '';
        var d_vale_ex: string = object.hasOwnProperty("descriptionEx") ? object["descriptionEx"] : '';
        var imageUrl: string = object.hasOwnProperty("imageUrl") ? object["imageUrl"] : AssetItem.getDefaultImageUrl(type);
        imageUrl = DefaultConstants.DEFAULT_IMAGE_FOLDER_PATH + imageUrl;
        var newItem: ViewAssetItem = new ViewAssetItem(type, n_value, d_value, imageUrl, d_vale_ex);
        var profle_id: number = object.hasOwnProperty("profileId") ? object["profileId"] : 0;
        newItem.profileId = profle_id;
        var pk_id: number = object.hasOwnProperty("pkid") ? object["pkid"] : 0;
        newItem.pkid = pk_id;
        var uu_id: string = object.hasOwnProperty("uuid") ? object["uuid"] : '0';
        newItem.UUID = uu_id;
        var img_src = object.hasOwnProperty("image") ? object["image"] : '';
        if (img_src != null) {
            newItem.img = img_src.imageURL;
        }
        return newItem;
    }
}