import {OperatorAssetItem} from './operator_assetItem';
export class RunNow {
    UUID: string = null;
    requestGroup: string = null;
    requestType: string = null;
    requestSubType: string = null;
    keys: Array<any>;
    constructor(operatorAssetItem: OperatorAssetItem) {
        this.requestGroup = operatorAssetItem.requestGroup;
        this.requestType = operatorAssetItem.requestType;
        this.requestSubType = operatorAssetItem.requestSubType;
        var value = null;
        if (operatorAssetItem.requestSubType == 'User Name' || operatorAssetItem.requestSubType == 'Email') {
            value = operatorAssetItem.singleValue;
        }
        else if (operatorAssetItem.requestSubType == 'Serial' || operatorAssetItem.requestSubType == 'UPC') {
            value = operatorAssetItem.value;
        }
        this.keys = [{ "value": value }, { "fromDate": operatorAssetItem.fromDate }, { "endDate": operatorAssetItem.endDate }, { "action": operatorAssetItem.action }];
        this.UUID = operatorAssetItem.uuid;
    }
}
export class ReportItem {
    UUID: string;
    state: string;
    respondDate: Date;
    respondType: string;
    report: any;
    constructor(uuid: string, state: string, respondDate: Date, respondType: string, report: any) {
        this.UUID = uuid;
        this.state = state;
        this.respondDate = respondDate;
        this.respondType = respondType;
        this.report = report;
    }
    static parse(object: Object): ReportItem {
        var id: string = object.hasOwnProperty("UUID") ? object["UUID"] : '0';
        var state_value: string = object.hasOwnProperty("state") ? object["state"] : '';
        var respondDate_value: Date = object.hasOwnProperty("respondDate") ? object["respondDate"] : '';
        var respondType_value: string = object.hasOwnProperty("respondType") ? object["respondType"] : '';
        var report_value: any = object.hasOwnProperty("report") ? object["report"] : '';
        report_value = this.parseReportProperties(report_value);
        var newItem: ReportItem = new ReportItem(id, state_value, respondDate_value, respondType_value, report_value);
        return newItem;
    }
    static parseReportProperties(report) {
        var jsonData = report;
        var overview = jsonData.hasOwnProperty("Overview") ? jsonData["Overview"] : '';
        overview = this.parseOverviewProperties(overview);
        jsonData.Overview = overview;
        var criteria = jsonData.hasOwnProperty("Criteria") ? jsonData["Criteria"] : '';
        criteria = this.parseCriteriaProperties(criteria);
        jsonData.Criteria = criteria;
        var summary = jsonData.hasOwnProperty("Summary") ? jsonData["Summary"] : '';
        summary = this.parseSummaryProperties(summary);
        jsonData.Summary = summary;
        var action = jsonData.hasOwnProperty("Action") ? jsonData["Action"] : '';
        jsonData.Action = action;
        return jsonData;
    }
    static parseOverviewProperties(overview) {
        var jsonData = overview;
        var name: string = jsonData.hasOwnProperty("name") ? jsonData["name"] : '';
        jsonData.name = name;
        var cloud: string = jsonData.hasOwnProperty("Cloud") ? jsonData["Cloud"] : '';
        jsonData.cloud = cloud;
        var TimeStarted: string = jsonData.hasOwnProperty("TimeStarted") ? jsonData["TimeStarted"] : '';
        jsonData.TimeStarted = new Date(TimeStarted).toLocaleString();
        var ElapsedTime: string = jsonData.hasOwnProperty("ElapsedTime") ? jsonData["ElapsedTime"] : '00:00:00';
        jsonData.ElapsedTime = ElapsedTime;
        return jsonData;
    }
    static parseCriteriaProperties(criteria) {
        var jsonData = criteria;
        var requestType: string = jsonData.hasOwnProperty("requestType") ? jsonData["requestType"] : '';
        jsonData.requestType = requestType;
        var requestSubType: string = jsonData.hasOwnProperty("requestSubType") ? jsonData["requestSubType"] : '';
        jsonData.name = requestSubType;
        var value: any = jsonData.hasOwnProperty("value") ? jsonData["value"] : '';
        jsonData.value = value;
        var fromDate: string = jsonData.hasOwnProperty("fromDate") ? jsonData["fromDate"] : '';
        jsonData.fromDate = new Date(fromDate).toLocaleDateString();
        var endDate: string = jsonData.hasOwnProperty("endDate") ? jsonData["endDate"] : '';
        jsonData.endDate = new Date(endDate).toLocaleDateString();
        return jsonData;
    }
    static parseSummaryProperties(summary) {
        var jsonData = summary;
        var scanProcessed: number = jsonData.hasOwnProperty("Scan(s)Processed") ? jsonData["Scan(s)Processed"] : 0;
        jsonData.scanProcessed = scanProcessed;
        return jsonData;
    }
}
export class DataList {
    state: string;
    TimeStarted: string;
    ElapsedTime: string;
    constructor(state: string, TimeStarted: string, ElapsedTime: string) {
        this.state = state;
        this.TimeStarted = TimeStarted;
        this.ElapsedTime = ElapsedTime;
    }
    static parse(array: Array<Object>): DataList {
        for (var index = 0; index < array.length; index++) {
            var obj: Object = array[index];
            var name: string = obj.hasOwnProperty("name") ? obj["name"] : '';
            switch (name) {
                case 'state': var state: string = obj.hasOwnProperty("value") ? obj["value"] : '';
                    break;
                case 'TimeStarted': var TimeStarted: string = obj.hasOwnProperty("value") ? obj["value"] : '';
                    break;
                case 'ElapsedTime': var ElapsedTime: string = obj.hasOwnProperty("value") ? obj["value"] : '';
                    break;
            }
        }
        var arrayData: DataList = new DataList(state, TimeStarted, ElapsedTime);
        return arrayData;
    }
}