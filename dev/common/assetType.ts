export enum AssetType {
    Family = <any>'Family',
    Product = <any>'Product',
    Calender = <any>'Calender',
    LifeCycle = <any>'LifeCycle',
    PackageProfile = <any>'PackageProfile',
    ItemRun = <any>'ItemRun',
    Favorite = <any>'Favorite',
    View = <any>'View',
    ItemAcquisition = <any>'itemAcquisition',
    ItemAuthentication = <any>'itemAuthentication',
    UserAccess = <any>'UserAccess',
    UserChange = <any>'UserChange',
    AssetManagement = <any>'AssetManagement',
    LifecycleChanges = <any>'lifecycleChanges',
    Action = <any>'Action',
    Trash = <any>'Trash',
    Dna = <any>'Dna',
    PublishedFamily = <any>'PublishedFamily'
}


export var Designer_Types: AssetType[] = [AssetType.Family, AssetType.Product, AssetType.PackageProfile];

export var Operator_Types: AssetType[] = [AssetType.Action, AssetType.PublishedFamily];


