export var welcomeDescription: string[] = ["Systech UniSecure™ takes advantage of microscopic variations by detecting specific measurable patterns, and harnesses them to generate an inherent, covert security feature from an existing, standard and overt print mark.",
    "The UniSecure UI supports a number of user roles.   The UniSecure Designer role is primarily responsible for creating and publishing definitions that define Products, packaging labels,  and the life cycle of product signatures.",
    "Once definitions are published,  the UniSecure Operator can monitor product access,  review reports for product authentication,  as well as maintain the UniSecure environment.",
    "The following trail map will help guide the user through the process of creating both required and optional definitions.   Simply Click on the icon of the definition to progress through the UniSecure journey."];

export var familyDescription: string = "A Family definition permits the logical grouping of one or more related products. For example as Baby Food and Baby Shampoo may all belong to the Baby family of products. Once a Family definition is created, it is then published and made available to both the UniSecure Operator and Business Owner.";

export var lifeCycleDescription: string = "A lifecycle definition enables sites to assign calendar definition to certain automated UniSecure activities such as: Deleting signatures or activating signatures. A lifecycle definition helps with the proper lifecycle management of signatures.";

export var packageProfileDescription: string = "A package profile describes packaging attributes such as substrate, finish, and label information (e.g QR Code, Data Matric, or Barcard), this information is used during authentication requests as well as the initial capturing of item images.";

export var itemRunDescription: string = "An item run definition represents various attributes that are used on the active line in which a product is being packaged. The Item Run definition references a corresponding Product definition. Consider the Item Run definition an instance of the Product Definition.";

export var productDescription: string = "A product definition represents a particular product and all of the associated information, including the packaging details of that particular product, and any DNA attributes to be captured during lot runs.";

export var logInDescription: string = "Enter User ID, password, and press LOGIN.";

export var userPreferenceDescription: string = "Create or maintain UniSecure users and groups or resend Uniscan invitations. To assign a user to a group,drag and drop the user to the desired group definition.";

export var userAddDescription: string = "Create a new user,and optionally send them invitation, and optionally cause a one time use only password.";

export var userUpdateDescription: string = "Update a new user, optionally send them invitation and optionally cause a one time use only password."

export var welcomeLDAP: string = "Set the location and credentials of LDAP server if you do not want to use the default";

export var welcomeUser: string = "Create or Maintain User and Groups";

export var welcomeDNA: string = "Create and Maintain a DNA group";

export var emptyTrashCan: string = "Trashcan is Empty";

export var assetItemColumns: string[] = ["Name", "Type", "Description", "Updated By", "Updated On"];

export var assetListItemColumns: string[] = ["Name", "Description", "Updated By", "Updated On"];

export var emptyTrashCanTitle = "Are you sure you want to permanently erase all items in the Trash?";

export var deleteMultipleItemTitle = "Are you sure you want to permanently erase all items in the Trash?";

export var deleteMultipleItemMessage = "You cannot undo this action.";

export var deleteItemTitle = "Are you sure you want to permanently erase \"{1}\"?";

export var deleteItemMessage = "This item will be deleted immediatly. You cannot undo this action.";

export var actionDescription = 'A UniSecure Action can be used to browse or change specific content, based on user supplied filtering criteria.';

export var viewDescription = 'A UniSecure View allows an operator to create a unique perspective that matches the responsibilities of that user.';

export var dnaDescription = 'Create new DNA attribute or apply changes to existing product DNA entries.';

export var unlockDescription = 'System Preferences is trying to unlock LDAP prefrences. Type your password to allow this.';


export var roles = [
    { id: 'prodOperatorRole', roleType: 'Production Operator', icon: 'public/img/unisecure_icon_productionoperator.png' },
    { id: 'operatorRole', roleType: 'Operator', icon: 'public/img/unisecure_icon_inspector.png' },
    { id: 'inspectorRole', roleType: 'Inspector', icon: 'public/img/unisecure_icon_operator.png' },
    { id: 'designerRole', roleType: 'Designer', icon: 'public/img/unisecure_icon_designer.png' },
    { id: 'administratorRole', roleType: 'Administrator', icon: 'public/img/unisecure_icon_administrator.png' },
];

export var forgetUserNameDescription = 'Please enter following information to identify your username in our database';

export var forgetUserNameHeading = 'Forgot Username';

export var forgetPasswordHeading = 'Forgot Password';

export var action_filterCriteria_Description = 'Specify filters below, and press Preview to show the matching results.';

export var cardSort = [
    { sortType: "Name", value: "name" },
    { sortType: "Updated By", value: "updatorName" },
    { sortType: "Updated On", value: "updateDateForSorting" }
];

export var listSort = [
    { sortType: "Name", value: "assetItem.name" },
    { sortType: "Updated By", value: "assetItem.updatorName" },
    { sortType: "Updated On", value: "assetItem.updateDateForSorting" }
];

export var TrashCanSort = [
    { sortType: "Name", value: "name" },
    { sortType: "Updated By", value: "updatorName" },
    { sortType: "Updated On", value: "updateDateForSorting" }
];

export var filterUsersBy: string[] = ['Username', 'First Name', 'Last Name'];

export var ascending = '+';

export var cardItemsNumber: number[] = [4, 8, 12, 16, 20];

export var listItemsNumber: number[] = [10, 20, 30, 40, 50];

export var welcomeDisplay: string = "Various UI Settings that manage features such as animation, message processing and items per page.";

export var welcomeUserAccount: string = "User can change own account information";

export var userAccountDescription: string = "Update user account Information";

export var newPasswordDescription: string = "Please enter new password.";

export var newPasswordHeading = 'New Password';

export var productDefaultImage = "product_default_image.png";

export var defaultTypeOfSymbology = { text: "Type of Symbology", value: ['QR Code', 'Data Matrix', 'UPC-A', 'EAN13', 'Code 39'], chkBoxLabel: 'Serialized Product ID' };

export var defaultPrintingTechnique = { text: "Printing Technique", value: ['Laser Ablation', 'Laser Photo', 'Inkjet', 'Thermal', 'Lithographic', 'Flexographic', 'Digital Photolithographic'], chkBoxLabel: 'Halftone Print' };

export var defaultSubstrate = { text: "Substrate", value: ['Paper', 'Plastic', 'Metal'] };

export var defaultFinish = { text: "Finish", value: ['Matte', 'Glossy'], chkBoxLabel: 'Package has an overwrap' };

export var defaultFlexibility = { text: "Flexibility", value: ['Rigid', 'Deformable'] };

export var defaultCoarseness = { text: "Coarseness", value: ['Smooth', 'Rough'] };

export var defaultPerspective = { text: "Perspective", value: ['Flat', 'Curve'] };

export var defaultWhatIsBeingPrinted = { text: "What is being Printed", value: ['Back Ground', 'Barcode'] };

export var defaultDarkOrLightPrinting = { text: "Dark or Light Printing", value: ['Light', 'Dark'] };

export var defaultPrintContinuityStyle = { text: "Print Continuity Style", value: ['Continuous', 'Discontinuous'] };