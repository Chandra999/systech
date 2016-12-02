import { AssetType } from './assetType';
import { DefaultConstants } from './default_values';
import { DescriptionEntry } from './extendedDescriptionEntry';
import { AssetItem } from './assetItem';
export class ProductAssetItem extends AssetItem {
    UUID: string = null;
    productId: string;
    serialized: boolean = true;
    productIdDetails: ProductIdDetails = new ProductIdDetails(null, null, null);
    packageProfile: PackageProfile = new PackageProfile(null, null, null);
    dna: Array<any> = [];
    img: string;
    imgUrl: string;

    constructor(type: AssetType, name: string, description: string, imageUrl: string, descritonJson: string) {
        super(type, name, description, imageUrl, descritonJson);
    }

    static parse(object: Object): ProductAssetItem {
        var n_value: string = object.hasOwnProperty("objectName") ? object["objectName"] : '';
        var uniObjectTypeId: number = object.hasOwnProperty("uniObjectTypeId") ? object["uniObjectTypeId"] : 0;
        var type: AssetType = AssetItem.getAssetType(uniObjectTypeId);
        var d_value: string = object.hasOwnProperty("description") ? object["description"] : '';
        var d_vale_ex: string = object.hasOwnProperty("descriptionEx") ? object["descriptionEx"] : '';
        var imageUrl: string = object.hasOwnProperty("imageUrl") ? object["imageUrl"] : AssetItem.getDefaultImageUrl(type);
        imageUrl = DefaultConstants.DEFAULT_IMAGE_FOLDER_PATH + imageUrl;
        var newItem: ProductAssetItem = new ProductAssetItem(type, n_value, d_value, imageUrl, d_vale_ex);
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
        var imgUrl_src = object.hasOwnProperty("imageUrl") ? object["imageUrl"] : '';
        if (imgUrl_src != null) {
            newItem.imgUrl = imgUrl_src;
        }
        var productId_value: string = object.hasOwnProperty("productId") ? object["productId"] : null;
        newItem.productId = productId_value;
        var serialized_value: boolean = object.hasOwnProperty("serialized") ? object["serialized"] : false;
        newItem.serialized = serialized_value;
        var dna_value: Array<any> = object.hasOwnProperty("dna") ? object["dna"] : null;
        if (dna_value == null) {
            dna_value = [];
        }
        newItem.dna = dna_value;
        var packageProfile_value: PackageProfile = object.hasOwnProperty("packageProfile") ? object["packageProfile"] : null;
        if (packageProfile_value == null) {
            packageProfile_value = new PackageProfile(null, null, null);
        }
        newItem.packageProfile = packageProfile_value;
        var productIdDetails_value: ProductIdDetails = object.hasOwnProperty("productIdDetails") ? object["productIdDetails"] : new ProductIdDetails(null, null, null);
        if (productIdDetails_value == null) {
            productIdDetails_value = new ProductIdDetails(null, null, null);
        }
        newItem.productIdDetails = productIdDetails_value;
        return newItem;
    }
}

export class ProductIdDetails {
    type: string;
    start: string;
    length: string
    constructor(type, start, length) {
        this.type = type;
        this.start = start;
        this.length = length;
    }
    static parse(object: Object): PackageProfile {
        var type_item = object.hasOwnProperty("type") ? object["type"] : null;
        var start_item = object.hasOwnProperty("start") ? object["start"] : null;
        var length_item = object.hasOwnProperty("length") ? object["length"] : null;
        var item: PackageProfile = new PackageProfile(type_item, start_item, length_item);
        return item;
    }
}

export class PackageProfile {
    pkid: number;
    uuid: string;
    name: string
    constructor(pkid, uuid, name) {
        this.pkid = pkid;
        this.uuid = uuid;
        this.name = name;
    }
    static parse(object: Object): PackageProfile {
        var pkid_item = object.hasOwnProperty("pkid") ? object["pkid"] : 0;
        var uuid_item = object.hasOwnProperty("uuid") ? object["uuid"] : null;
        var name_item = object.hasOwnProperty("name") ? object["name"] : null;
        var item: PackageProfile = new PackageProfile(pkid_item, uuid_item, name_item);
        return item;
    }
}