import { AssetType } from './assetType';
import { DefaultConstants } from './default_values';
import { DescriptionEntry } from './extendedDescriptionEntry';
import { AssetItem } from './assetItem';

export var default_runTimeParameters =
    [
        {
            "name": "interoff_0",
            "value": "0.75",
            "description": "VM IVA threshold (2D only)"
        },
        {
            "name": "interoff_1",
            "value": "0.40",
            "description": "BB IVA threshold (2D only)"
        },
        {
            "name": "interoff_2",
            "value": "0.375",
            "description": "AvG IVA threshold (2D only)"
        },
        {
            "name": "interoff_3",
            "value": "0.70",
            "description": "PL IVA threshold (2D only)"
        },
        {
            "name": "interoff_4",
            "value": "0.50",
            "description": "PB IVA threshold (2D only)"
        },
        {
            "name": "smband_0",
            "value": "0.1",
            "description": "Upper indeterminate band (2D only)"
        },
        {
            "name": "smband_1",
            "value": "-0.1",
            "description": "Lower indeterminate band (2D only)"
        },
        {
            "name": "gn_corr_threshold",
            "value": "0.2",
            "description": "Minimum pass score for this product (1D only)"
        },

        {
            "name": "ipconstant",
            "value": "80",
            "description": "Internal profile extraction setting (2D only)"
        },
        {
            "name": "ipavgsegment",
            "value": "20",
            "description": "Internal profile extraction setting (2D only)"
        },
        {
            "name": "max_coc",
            "value": "10",
            "description": "Minimum image sharpness requirement"
        },

        {
            "name": "glcm_thresh",
            "value": "99",
            "description": "Photocopy detection setting, 99 = off"
        },
        {
            "name": "pval_thresh",
            "value": "99",
            "description": "Photocopy detection setting, 99 = off"
        },
        {
            "name": "rsqvm_thresh",
            "value": "0",
            "description": "Photocopy detection setting, 0 = off"
        },
        {
            "name": "subvm_thresh",
            "value": "0",
            "description": "Photocopy detection setting, 0 = off"
        },
        {
            "name": "subpl_thresh",
            "value": "0",
            "description": "Photocopy detection setting, 0 = off"
        },
        {
            "name": "subpb_thresh",
            "value": "0",
            "description": "Photocopy detection setting, 0 = off"
        },
        {
            "name": "subvmnc_thresh",
            "value": "-99",
            "description": "Photocopy detection setting, -99 = off"
        },
        {
            "name": "subprofilelnc_thresh",
            "value": "-99",
            "description": "Photocopy detection setting, -99 = off"
        },
        {
            "name": "subprofilebnc_thresh",
            "value": "-99",
            "description": "Photocopy detection setting, -99 = off"
        },

        {
            "name": "mechanical_damage_trimming",
            "value": "0",
            "description": "MDA on/off, 1 = on"
        },
        {
            "name": "iva_mdi_thresh",
            "value": "0.2",
            "description": "MDA trim setting"
        },
        {
            "name": "use_hid_as_fp",
            "value": "0",
            "description": "Debug – HID performance test mode"
        },
        {
            "name": "logger",
            "value": "0",
            "description": "Debug – turns on server logging text file"
        },
        {
            "name": "verbose",
            "value": "0",
            "description": "Debug – turns on verbose mode for logging"
        },
        {
            "name": "show_vuid",
            "value": "0",
            "description": "Debug – sends VUID to UniScan"
        },
        {
            "name": "show_score_on_phone",
            "value": "0",
            "description": "Debug – sends score margin value to UniScan"
        },
        {
            "name": "use_mda",
            "value": "1",
            "description": "Use 1D MDA"
        },
        {
            "name": "version",
            "value": "2.1",
            "description": "Engine Version Override"
        },
        {
            "name": "hid2_hit_accumulator_size",
            "value": "100",
            "description": "HID culled list length"
        },
        {
            "name": "use_sorethumb",
            "value": "0",
            "description": "Dynamic Thresholding Classification Switch"
        },
        {
            "name": "use_lv_features",
            "value": "1",
            "description": "Use low variability 2D feature extraction (for non-serialiized 2D)"
        },
        {
            "name": "hp1width",
            "value": "400",
            "description": "High Pass Upper"
        },
        {
            "name": "lp1width",
            "value": "20",
            "description": "Low Pass Upper"
        },
        {
            "name": "lp2width",
            "value": "30",
            "description": "Low Pass Lower"
        },
        {
            "name": "hp2width",
            "value": "10",
            "description": "High Pass Lower"
        },
        {
            "name": "optimize_grid_position",
            "value": "1",
            "description": "Fine grid alignment for non-serialized 2D"
        }
    ];


export class PackageProfileAssetItem extends AssetItem {
    uuid: string = null;
    //print: Print = new Print('Back Ground', 'Light', 'Continuous');
    //pack: Pack = new Pack(new Symbology('QR Code', false, 0, 0), new Technique('Laser Ablation', false), 'Paper', new Finish('Matte', false), 'Rigid', 'Smooth', 'Flat');
    profileParameters: Array<any> = [];
    engineParameters: Array<any> = [];
    symbology: NameValue;
    continuity: NameValue;
    print: NameValue;
    density: NameValue;
    flexibility: NameValue;
    coarseness: NameValue;
    perspective: NameValue;
    substrate: NameValue;
    wrapped: NameValue;
    finish: NameValue;
    technique: NameValue;
    halftone: NameValue;
    serialized: NameValue;
    height: NameValue;
    width: NameValue;


    constructor(type: AssetType, name: string, description: string, imageUrl: string, descritonJson: string) {
        super(type, name, description, imageUrl, descritonJson);
    }
    static parse(object: Object): PackageProfileAssetItem {
        var n_value: string = object.hasOwnProperty("objectName") ? object["objectName"] : '';
        var uniObjectTypeId: number = object.hasOwnProperty("uniObjectTypeId") ? object["uniObjectTypeId"] : 0;
        var type: AssetType = AssetItem.getAssetType(uniObjectTypeId);
        var d_value: string = object.hasOwnProperty("description") ? object["description"] : '';
        var d_vale_ex: string = object.hasOwnProperty("descriptionEx") ? object["descriptionEx"] : '';
        var imageUrl: string = object.hasOwnProperty("imageUrl") ? object["imageUrl"] : AssetItem.getDefaultImageUrl(type);
        imageUrl = DefaultConstants.DEFAULT_IMAGE_FOLDER_PATH + imageUrl;
        var newItem: PackageProfileAssetItem = new PackageProfileAssetItem(type, n_value, d_value, imageUrl, d_vale_ex);
        var profle_id: number = object.hasOwnProperty("profileId") ? object["profileId"] : 0;
        newItem.profileId = profle_id;
        var pk_id: number = object.hasOwnProperty("pkid") ? object["pkid"] : 0;
        newItem.pkid = pk_id;
        var uu_id: string = object.hasOwnProperty("uuid") ? object["uuid"] : '0';
        newItem.uuid = uu_id;
        var profileParameters_item = object.hasOwnProperty('profileParameters') ? object['profileParameters'] : [];
        newItem.profileParameters = profileParameters_item;
        newItem.parseProfileProperties();
        var engineParameters_item = object.hasOwnProperty('engineParameters') ? object['engineParameters'] : [];
        newItem.engineParameters = engineParameters_item;
        return newItem;
    }

    init() {
        this.symbology = new NameValue('symbology', 'QR Code');
        this.continuity = new NameValue('continuity', 'Continuous');
        this.print = new NameValue('print', 'Back Ground');
        this.density = new NameValue('density', 'Light');
        this.flexibility = new NameValue('flexibility', 'Rigid');
        this.coarseness = new NameValue('coarseness', 'Smooth');
        this.perspective = new NameValue('perspective', 'Flat');
        this.substrate = new NameValue('substrate', 'Paper');
        this.wrapped = new NameValue('wrapped', false);
        this.finish = new NameValue('finish', 'Matte');
        this.technique = new NameValue('technique', 'Laser Ablation');
        this.halftone = new NameValue('halftone', false);
        this.serialized = new NameValue('serialized', false);
        this.height = new NameValue('height', 0);
        this.width = new NameValue('width', 0);
        this.engineParameters = default_runTimeParameters;
    }

    parseProfileProperties() {
        if (this.profileParameters != null) {
            if (this.profileParameters.length > 0) {
                for (var obj of this.profileParameters) {
                    if (obj["name"] == 'symbology') {
                        this.symbology = new NameValue(obj["name"], obj["value"]);
                    } else if (obj["name"] == 'continuity') {
                        this.continuity = new NameValue(obj["name"], obj["value"]);
                    } else if (obj["name"] == 'print') {
                        this.print = new NameValue(obj["name"], obj["value"]);
                    } else if (obj["name"] == 'density') {
                        this.density = new NameValue(obj["name"], obj["value"]);
                    } else if (obj["name"] == 'flexibility') {
                        this.flexibility = new NameValue(obj["name"], obj["value"]);
                    } else if (obj["name"] == 'coarseness') {
                        this.coarseness = new NameValue(obj["name"], obj["value"]);
                    } else if (obj["name"] == 'perspective') {
                        this.perspective = new NameValue(obj["name"], obj["value"]);
                    } else if (obj["name"] == 'substrate') {
                        this.substrate = new NameValue(obj["name"], obj["value"]);
                    } else if (obj["name"] == 'wrapped') {
                        this.wrapped = new NameValue(obj["name"], obj["value"]);
                    } else if (obj["name"] == 'finish') {
                        this.finish = new NameValue(obj["name"], obj["value"]);
                    } else if (obj["name"] == 'technique') {
                        this.technique = new NameValue(obj["name"], obj["value"]);
                    } else if (obj["name"] == 'halftone') {
                        this.halftone = new NameValue(obj["name"], obj["value"]);
                    } else if (obj["name"] == 'serialized') {
                        this.serialized = new NameValue(obj["name"], obj["value"]);
                    } else if (obj["name"] == 'height') {
                        this.height = new NameValue(obj["name"], obj["value"]);
                    } else if (obj["name"] == 'width') {
                        this.width = new NameValue(obj["name"], obj["value"]);
                    }
                }
            }
        }
    }

    updateProfileParameters() {
        if (this.profileParameters != null && this.profileParameters.length > 0) {
            this.profileParameters.splice(0, this.profileParameters.length);
        }
        this.profileParameters.push(this.symbology);
        this.profileParameters.push(this.continuity);
        this.profileParameters.push(this.print);
        this.profileParameters.push(this.density);
        this.profileParameters.push(this.flexibility);
        this.profileParameters.push(this.coarseness);
        this.profileParameters.push(this.perspective);
        this.profileParameters.push(this.substrate);
        this.profileParameters.push(this.wrapped);
        this.profileParameters.push(this.finish);
        this.profileParameters.push(this.technique);
        this.profileParameters.push(this.halftone);
        this.profileParameters.push(this.serialized);
        this.profileParameters.push(this.height);
        this.profileParameters.push(this.width);
    }
}

export class NameValue {
    name: string;
    value: Object;
    constructor(name, value) {
        this.name = name;
        this.value = value;
    }

}
export class Print {
    printObject: string;
    density: string;
    style: string;
    constructor(printObject, density, style) {
        this.printObject = printObject;
        this.density = density;
        this.style = style;
    }
    static parse(object: Object): Print {
        var printObject_item = object.hasOwnProperty("printObject") ? object["printObject"] : null;
        var density_item = object.hasOwnProperty("density") ? object["density"] : null;
        var style_item = object.hasOwnProperty("style") ? object["style"] : null;
        var item: Print = new Print(printObject_item, density_item, style_item);
        return item;
    }
}

export class Pack {
    symbology: Symbology;
    technique: Technique;
    substrate: string;
    finish: Finish;
    flexibility: string;
    coarseness: string;
    perspective: string;
    constructor(symbology, technique, substrate, finish, flexibility, coarseness, perspective) {
        this.symbology = symbology;
        this.technique = technique;
        this.substrate = substrate;
        this.finish = finish;
        this.flexibility = flexibility;
        this.coarseness = coarseness;
        this.perspective = perspective;
    }
    static parse(object: Pack): Pack {
        var symbology_item: Symbology = object.hasOwnProperty("symbology") ? object["symbology"] : null;
        var technique_item: Technique = object.hasOwnProperty("technique") ? object["technique"] : null;
        var substrate_item = object.hasOwnProperty("substrate") ? object["substrate"] : null;
        var finish_item: Finish = object.hasOwnProperty("finish") ? object["finish"] : null;
        var flexibility_item = object.hasOwnProperty("flexibility") ? object["flexibility"] : null;
        var coarseness_item = object.hasOwnProperty("coarseness") ? object["coarseness"] : null;
        var perspective_item = object.hasOwnProperty("perspective") ? object["perspective"] : null;
        var item: Pack = new Pack(symbology_item, technique_item, substrate_item, finish_item, flexibility_item, coarseness_item, perspective_item);
        return item;
    }
}

export class Symbology {
    type: string;
    serialized: boolean;
    height: string;
    width: string;
    constructor(type, serialized, height, width) {
        this.type = type;
        this.serialized = serialized;
        this.height = height;
        this.width = width;
    }
    static parse(object: Object): Symbology {
        var type_item = object.hasOwnProperty("type") ? object["type"] : null;
        var serialized_item = object.hasOwnProperty("serialized") ? object["serialized"] : false;
        var height_item = object.hasOwnProperty("height") ? object["height"] : null;
        var width_item = object.hasOwnProperty("width") ? object["width"] : null;
        var item: Symbology = new Symbology(type_item, serialized_item, height_item, width_item);
        return item;
    }
}
export class Technique {
    type: string = null;
    halftone: boolean = false;
    constructor(type, halftone) {
        this.type = type;
        this.halftone = halftone;
    }
    static parse(object: Object): Technique {
        var type_item = object.hasOwnProperty("type") ? object["type"] : null;
        var halftone_item = object.hasOwnProperty("halftone") ? object["halftone"] : false;
        var item: Technique = new Technique(type_item, halftone_item);
        return item;
    }
}

export class Finish {
    type: string = null;
    wrapped: boolean = false;
    constructor(type, wrapped) {
        this.type = type;
        this.wrapped = wrapped;
    }
    static parse(object: Object): Finish {
        var type_item = object.hasOwnProperty("type") ? object["type"] : null;
        var wrapped_item = object.hasOwnProperty("wrapped") ? object["wrapped"] : false;
        var item: Finish = new Finish(type_item, wrapped_item);
        return item;
    }
}