import {AssetItem} from '../common/assetItem';
import {AssetType} from "../common/assetType";
import {ActionRecord} from "../common/action_record";

export let descriptinJson: string = "[{\"user\": \"Cindy\",\"date\": \" May 4 2016\", \"description\": \"Morbi in sem quis dui placerat ornare. Pellentesque odio nisi, euismod in, pharetra a, ultricies in, diam. Sed arcu. Cras consequat.\"},{\"user\": \"Dave\",\"date\": \" May 6 2016\",\"description\": \"Phasellus ultrices nulla quis nibh. Quisque a lectus. Donec consectetuer ligula vulputate sem tristique cursus. Nam nulla quam, gravida non, commodo a, sodales sit amet, nisi.\"}]";

export let DATETYPES: string[] = [
    'LINE1',
    'LINE2',
    'LINE3',
];

export let EVENTS: string[] = [
    'EVENT1',
    'EVENT2',
    'EVENT3',
    'EVENT4',
    'EVENT5',
    'EVENT6',
    'EVENT7',
    'EVENT8',
    'EVENT9',
    'EVENT10',
];
export let FAMILY_LIST: AssetItem[] = [
    new AssetItem(AssetType.Family, 'Headache', "Headache Products", '', descriptinJson),
    new AssetItem(AssetType.Family, 'Fever', "Fever and pain relief", '', descriptinJson),
    new AssetItem(AssetType.Family, 'Hair Products', "Hair care products", '', descriptinJson),
    new AssetItem(AssetType.Family, 'EMEA Drugs', "Prescription drugs", '', descriptinJson),
];

export let PRODUCT_LIST: AssetItem[] = [
    new AssetItem(AssetType.Product, 'Tylenol', "Pain relief for slight headache", '', descriptinJson),
    new AssetItem(AssetType.Product, 'Fenoprofen', "Prevention of tension headaches", '', descriptinJson),
    new AssetItem(AssetType.Product, 'Naproxen', "Cure for hormone headaches", '', descriptinJson)
];

export let CALENDER_LIST: AssetItem[] = [
    new AssetItem(AssetType.Calender, 'Dispatch date', "Product Dispatch Dates", '', descriptinJson),
    new AssetItem(AssetType.Calender, 'Start Date', "Start Plan", '', descriptinJson),
    new AssetItem(AssetType.Calender, 'expiry range', "Renage of expiry dates", '', descriptinJson),

];

//export let REFDNA_LIST: AssetItem[] = [
//    new AssetItem(AssetType.RefDNA, "DNA1", "DNA of Person1 ", ''),
//    new AssetItem(AssetType.RefDNA, 'DNA2', "DNA of Person2", ''),
//    new AssetItem(AssetType.RefDNA, "DNA3", "DNA of Person3 ", ''),
//    new AssetItem(AssetType.RefDNA, 'DNA4', "DNA of Person4", ''),
//    new AssetItem(AssetType.RefDNA, "DNA5", "DNA of Person5 ", ''),
//    new AssetItem(AssetType.RefDNA, 'DNA6', "DNA of Person6", ''),
//    new AssetItem(AssetType.RefDNA, "DNA7", "DNA of Person7 ", ''),
//    new AssetItem(AssetType.RefDNA, 'DNA8', "DNA of Person8", ''),
//    new AssetItem(AssetType.RefDNA, "DNA9", "DNA of Person9 ", ''),
//    new AssetItem(AssetType.RefDNA, 'DNA10', "DNA of Person10", ''),
//    new AssetItem(AssetType.RefDNA, "DNA11", "DNA of Person11 ", ''),
//    new AssetItem(AssetType.RefDNA, 'DNA12', "DNA of Person12", ''),
//    new AssetItem(AssetType.RefDNA, "DNA13", "DNA of Person13 ", ''),
//    new AssetItem(AssetType.RefDNA, 'DNA14', "DNA of Person14", ''),
//    new AssetItem(AssetType.RefDNA, "DNA15", "DNA of Person15", ''),
//    new AssetItem(AssetType.RefDNA, 'DNA16', "DNA of Person16", ''),
//    new AssetItem(AssetType.RefDNA, 'DNA17', "DNA of Person17", ''),
//    new AssetItem(AssetType.RefDNA, "DNA18", "DNA of Person18 ", ''),
//    new AssetItem(AssetType.RefDNA, 'DNA19', "DNA of Person19", ''),
//    new AssetItem(AssetType.RefDNA, "DNA20", "DNA of Person20", ''),
//    new AssetItem(AssetType.RefDNA, 'DNA21', "DNA of Person21", ''),
//];

export let LIFECYCLE_LIST: AssetItem[] = [
    new AssetItem(AssetType.LifeCycle, 'Req_Phase', "Requirements Phase", '', descriptinJson),
    new AssetItem(AssetType.LifeCycle, 'Dev_Phase', "Development Phase", '', descriptinJson),
    new AssetItem(AssetType.LifeCycle, 'Sell_Phase', "Selling Phase", '', descriptinJson),
];

export let CAMERA_LIST: AssetItem[] = [
    new AssetItem(AssetType.PackageProfile, 'Camera01', "Camera for barcode reader", '', descriptinJson),
    new AssetItem(AssetType.PackageProfile, 'Camera02', "Camera for product's label", '', descriptinJson),
    new AssetItem(AssetType.PackageProfile, 'Camera03', "Camera for product's interior", '', descriptinJson),
    new AssetItem(AssetType.PackageProfile, 'Camera04', "Camera for barcode reader", '', descriptinJson),
    new AssetItem(AssetType.PackageProfile, 'Camera05', "Camera for product's label", '', descriptinJson),
    new AssetItem(AssetType.PackageProfile, 'Camera06', "Camera for product's interior", '', descriptinJson),
    new AssetItem(AssetType.PackageProfile, 'Camera07', "Camera for barcode reader", '', descriptinJson),
    new AssetItem(AssetType.PackageProfile, 'Camera08', "Camera for product's label", '', descriptinJson),
    new AssetItem(AssetType.PackageProfile, 'Camera09', "Camera for product's interior", '', descriptinJson),
    new AssetItem(AssetType.PackageProfile, 'Camera10', "Camera for barcode reader", '', descriptinJson),
    new AssetItem(AssetType.PackageProfile, 'Camera11', "Camera for product's label", '', descriptinJson),
    new AssetItem(AssetType.PackageProfile, 'Camera12', "Camera for product's interior", '', descriptinJson),
];

export let ITEMRUN_LIST: AssetItem[] = [
    new AssetItem(AssetType.ItemRun, 'QAD', "Recipe for Asthma", '', descriptinJson),
    new AssetItem(AssetType.ItemRun, 'SAP', "Serial number provisioning", '', descriptinJson),
];

export let VIEW_LIST: AssetItem[] = [
    new AssetItem(AssetType.View, 'Operator John', "This is John's Doe personal view of his area of responsibility.", 'public/img/operator.png', descriptinJson),
    new AssetItem(AssetType.View, 'Operator Daniel', "Night Shift manager Daniel's View", 'public/img/operator.png', descriptinJson)
];

export let FAVORITE_LIST: AssetItem[] = [
    new AssetItem(AssetType.Favorite, 'Operator John', "This is John's Doe personal view of his area of responsibility.", 'public/img/operator.png', descriptinJson),
];

export let ACTION_LIST: AssetItem[] = [
];


// export let ACTION_PREVIEW_LIST:ActionRecord[]=[new ActionRecord('','','','',''),new ActionRecord('','','','',''),new ActionRecord('','','','','')];