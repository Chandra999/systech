import { Preference } from './preference';

export class ActionRecord {
    status: string = '';
    userName: string = '';
    addedOn: string = '';
    state: string = '';
    email: string = '';
    serial: string = '';
    upc: string = '';
    type: string = '';

    constructor(status: string, addOn: string, state: string, requestSubType: string) {
        this.status = status;
        this.addedOn = addOn;
        this.state = state;
        this.type = requestSubType;
    }

    static parse(object: Object, requestSubType: string): ActionRecord {
        var status: string = object.hasOwnProperty("status") ? object["status"] : '';
        var addedDateString: string = object.hasOwnProperty("addedDate") ? object["addedDate"] : '';
        var state: string = object.hasOwnProperty("state") ? object["state"] : '';
        var addedDate: string = null;
        if (addedDateString != null && addedDateString != undefined && addedDateString != '') {
            addedDate = new Date(addedDateString).toLocaleString();
        }
        var newItem: ActionRecord = new ActionRecord(status, addedDate, state, requestSubType);
        if (requestSubType == 'User Name' || requestSubType == 'Email') {
            var userName: string = object.hasOwnProperty("username") ? object["username"] : '';
            var email: string = object.hasOwnProperty("email") ? object["email"] : '';
            newItem.userName = userName;
            newItem.email = email;
        } else if (requestSubType == 'Serial') {
            var serial: string = object.hasOwnProperty("Serial") ? object["Serial"] : '';
            newItem.serial = serial;
        } else if (requestSubType == 'UPC') {
            var upc: string = object.hasOwnProperty("UPC") ? object["UPC"] : '';
            newItem.upc = upc;
        }
        return newItem;
    }

    static displayColumns(requestSubType: string): string[] {
        if (requestSubType == 'User Name' || requestSubType == 'Email') {
            return ["Status", "User Name", "Email", "Added On", "State"];
        } else if (requestSubType == 'Serial') {
            return ["Status", "Serial", "Added On", "State"];
        } else if (requestSubType == 'UPC') {
            return ["Status", "UPC", "Added On", "State"];
        }
        return ["Status", "User Name", "Email", "Added On", "State"];
    }
}