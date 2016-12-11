import { Injectable } from "@angular/core";
import { Http, Headers, Response, RequestOptionsArgs } from "@angular/http";
import { DEFAULT_URL, DEFAULT_DEVELOPER_RESOURCE, DEFAULT_OPERATOR_RESOURCE, DEFAULT_ADMIN_RESOURCE, DEFAULT_PRODUCTION } from '../common/defaultHost';
import { AssetType } from '../common/assetType'
import { AssetItem } from '../common/assetItem'
import { UsersService } from './User.service';
import 'rxjs/Rx';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import {HttpService} from './http.service';

@Injectable()
export class DataService {
    entitiesResource: string;
    entityResource: string;
    saveEditAction: string;
    newAction: string;
    getEditAction: string;
    getActions: string;
    deleteOperatorItem: string;
    deleteDesignerItem: string;
    restoreOperatorItem: string;
    restoreDesignerItem: string;
    getItemsInOperatorTrash: string
    getItemsInDesignerTrash: string
    userResource: string;
    userGroupsResorce: string;
    usersResource: string;
    userGroupUsersResource: string;
    addDnaResource: string;
    dnaResource: string;
    updateDnaResource: string;
    deleteDnaResource: string;
    userGroupUpdade: string
    deletedOperatorItemsCount: string
    deletedDesignerItemsCount: string
    permanentlyDeleteOperatorItem: string;
    permanentlyDeleteDesignerItem: string;
    deleteUser: string;
    deleteuserGroup: string;
    copy: string;
    createUserGroup: string;
    invitationResource: string;
    forgetUserNameResource: string;
    forgetPasswordResource: string;
    userPreferencesResource: string;
    loginResource: string;
    resetPasswordResource: string;
    runNow: string;
    saveReport: string;
    getReports: string;
    newPackageProfile: string;
    editPackageProfile: string
    readPackageProfile: string;
    newProduct: string;
    editProduct: string
    readProduct: string;
    newFamily: string;
    editFamily: string
    readFamily: string;
    publishFamily: string;
    pendingPublishedFamilies: string;
    approvedPublishedFamilies: string;
    updatePublishedFamilies: string;
    getPublishedFamily: string;
    getPublishedProduct: string;
    getPublishedPackageProfile: string;
    token: string;

    private cardsChangedSource = new BehaviorSubject<boolean>(false);
    navItem$ = this.cardsChangedSource.asObservable();

    constructor(private _http: HttpService, private userSvc: UsersService) {
        this.entitiesResource = DEFAULT_DEVELOPER_RESOURCE + "/entities/true?entityType=";
        this.entityResource = DEFAULT_DEVELOPER_RESOURCE + "/entity";
        this.newAction = DEFAULT_OPERATOR_RESOURCE + "/action";
        this.getActions = DEFAULT_OPERATOR_RESOURCE + "/actions/true";
        this.getEditAction = DEFAULT_OPERATOR_RESOURCE + "/entity";
        this.saveEditAction = DEFAULT_OPERATOR_RESOURCE + "/action/true";
        this.deleteOperatorItem = DEFAULT_OPERATOR_RESOURCE + "/remove/";
        this.deleteDesignerItem = DEFAULT_DEVELOPER_RESOURCE + "/remove/";
        this.getItemsInOperatorTrash = DEFAULT_OPERATOR_RESOURCE + "/operators/false";
        this.getItemsInDesignerTrash = DEFAULT_DEVELOPER_RESOURCE + "/trash";
        this.deletedOperatorItemsCount = DEFAULT_OPERATOR_RESOURCE + "/count/false";
        this.deletedDesignerItemsCount = DEFAULT_DEVELOPER_RESOURCE + "/count/false";
        this.permanentlyDeleteOperatorItem = DEFAULT_OPERATOR_RESOURCE + "/purge";
        this.permanentlyDeleteDesignerItem = DEFAULT_DEVELOPER_RESOURCE + "/purge";
        this.restoreOperatorItem = DEFAULT_OPERATOR_RESOURCE + "/restore";
        this.restoreDesignerItem = DEFAULT_DEVELOPER_RESOURCE + "/restore";
        this.userResource = DEFAULT_ADMIN_RESOURCE + "/user";
        this.deleteUser = DEFAULT_ADMIN_RESOURCE + "/user/";
        this.userGroupsResorce = DEFAULT_ADMIN_RESOURCE + "/usergroups";
        this.usersResource = DEFAULT_ADMIN_RESOURCE + "/users";
        this.userGroupUsersResource = DEFAULT_ADMIN_RESOURCE + "/usergroups/";
        this.userGroupUpdade = DEFAULT_ADMIN_RESOURCE + "/usergroups";
        this.createUserGroup = DEFAULT_ADMIN_RESOURCE + "/usergroups";
        this.deleteuserGroup = DEFAULT_ADMIN_RESOURCE + "/usergroups/";
        this.copy = DEFAULT_OPERATOR_RESOURCE + "/copy/";
        this.invitationResource = DEFAULT_ADMIN_RESOURCE + "/sendInvitation";
        this.forgetUserNameResource = DEFAULT_ADMIN_RESOURCE + '/forgetUserName/';
        this.forgetPasswordResource = DEFAULT_ADMIN_RESOURCE + '/forgetPassword/';
        this.userPreferencesResource = DEFAULT_ADMIN_RESOURCE + '/systemPreferences/';
        this.resetPasswordResource = DEFAULT_ADMIN_RESOURCE + '/resetPassword/';
        this.loginResource = DEFAULT_ADMIN_RESOURCE + '/login/';
        this.runNow = 'http://eng-demo.systechcloud.net:8080/com.systechone.operatoradmin.ws/run';//Should come from Default hosts
        this.saveReport = DEFAULT_OPERATOR_RESOURCE + '/report/';
        this.getReports = DEFAULT_OPERATOR_RESOURCE + '/report/';
        this.newPackageProfile = DEFAULT_DEVELOPER_RESOURCE + '/packageProfile';
        this.newProduct = DEFAULT_DEVELOPER_RESOURCE + '/product';
        this.newFamily = DEFAULT_DEVELOPER_RESOURCE + '/family';
        this.editPackageProfile = DEFAULT_DEVELOPER_RESOURCE + '/packageProfile/true';
        this.editProduct = DEFAULT_DEVELOPER_RESOURCE + '/product/true';
        this.editFamily = DEFAULT_DEVELOPER_RESOURCE + '/family/true';
        this.readPackageProfile = DEFAULT_DEVELOPER_RESOURCE + '/content';
        this.readProduct = DEFAULT_DEVELOPER_RESOURCE + '/content'
        this.readFamily = DEFAULT_DEVELOPER_RESOURCE + '/content'
        this.publishFamily = DEFAULT_DEVELOPER_RESOURCE + '/publish/';
        this.pendingPublishedFamilies = DEFAULT_OPERATOR_RESOURCE + '/publishedFamilyByState/?state=1';
        this.approvedPublishedFamilies = DEFAULT_OPERATOR_RESOURCE + '/publishedFamilyByState/?state=2';
        this.updatePublishedFamilies = DEFAULT_OPERATOR_RESOURCE + '/updateFamilyState/';
        this.getPublishedFamily = DEFAULT_PRODUCTION + '/publishedFamilyByPk/';
        this.getPublishedProduct = DEFAULT_PRODUCTION + '/publishedProductByPk/';
        this.getPublishedPackageProfile = DEFAULT_PRODUCTION + '/packageProfileByPk/';
        this.dnaResource = DEFAULT_ADMIN_RESOURCE + '/dna?loadContent=true';
        this.addDnaResource = DEFAULT_ADMIN_RESOURCE + '/dna';
        this.updateDnaResource = DEFAULT_ADMIN_RESOURCE + '/dna/true';
        this.deleteDnaResource = DEFAULT_ADMIN_RESOURCE + '/dna/'

    }

    putPackageProfile(data: any) {
        const body = JSON.stringify(data);
        const headers = this.createAuthorizationHeader();
        headers.append("Content-Type", 'application/json');
        return this._http.put(this.newPackageProfile, body, { headers: headers })
            .map(response => response.json());
    }

    postPackageProfile(data: any) {
        const body = JSON.stringify(data);
        const headers = this.createAuthorizationHeader();
        headers.append("Content-Type", 'application/json');
        return this._http.post(this.editPackageProfile, body, { headers: headers })
            .map(response => response.json());
    }

    getPackageProfile(type: AssetType, id: number) {
        const requestUrl = this.readPackageProfile + "?entityType=" + AssetItem.getUniTypeValue(type) + "&id=" + id;
        const headers = this.createAuthorizationHeader();
        return this._http.get(requestUrl, { headers: headers })
            .map(response => response.json());
    }

    putProduct(data: any) {
        const body = JSON.stringify(data);
        const headers = this.createAuthorizationHeader();
        headers.append("Content-Type", 'application/json');
        return this._http.put(this.newProduct, body, { headers: headers })
            .map(response => response.json());
    }

    postProduct(data: any) {
        const body = JSON.stringify(data);
        const headers = this.createAuthorizationHeader();
        headers.append("Content-Type", 'application/json');
        return this._http.post(this.editProduct, body, { headers: headers })
            .map(response => response.json());
    }

    getProduct(type: AssetType, id: number) {
        const requestUrl = this.readProduct + "?entityType=" + AssetItem.getUniTypeValue(type) + "&id=" + id;
        console.log(requestUrl);
        const headers = this.createAuthorizationHeader();
        return this._http.get(requestUrl, { headers: headers })
            .map(response => response.json());
    }

    putFamily(data: any) {
        const body = JSON.stringify(data);
        console.log(body);
        const headers = this.createAuthorizationHeader();
        headers.append("Content-Type", 'application/json');
        return this._http.put(this.newFamily, body, { headers: headers })
            .map(response => response.json());
    }

    postFamily(data: any) {
        const body = JSON.stringify(data);
        console.log(body);
        const headers = this.createAuthorizationHeader();
        headers.append("Content-Type", 'application/json');
        return this._http.post(this.editFamily, body, { headers: headers })
            .map(response => response.json());
    }

    getFamily(type: AssetType, id: number) {
        const requestUrl = this.readFamily + "?entityType=" + AssetItem.getUniTypeValue(type) + "&id=" + id;
        const headers = this.createAuthorizationHeader();
        return this._http.get(requestUrl, { headers: headers })
            .map(response => response.json());
    }

    onPublishFamily(id) {
        const requestUrl = this.publishFamily + id;
        console.log(requestUrl);
        const headers = this.createAuthorizationHeader();
        headers.append("Content-Type", 'text/plain');
        return this._http.get(requestUrl, { headers: headers })
            .map(response => response.json());
    }

    getPendingPublishedFamilies() {
        const requestUrl = this.pendingPublishedFamilies;
        const headers = this.createAuthorizationHeader();
        return this._http.get(requestUrl, { headers: headers })
            .map(response => response.json());
    }

    getApprovedPublishedFamilies() {
        const requestUrl = this.approvedPublishedFamilies;
        const headers = this.createAuthorizationHeader();
        return this._http.get(requestUrl, { headers: headers })
            .map(response => response.json());
    }

    onUpdatePublishedFamilies(id, state) {
        const requestUrl = this.updatePublishedFamilies + '?pkid=' + id + '&state=' + state;
        const headers = this.createAuthorizationHeader();
        return this._http.get(requestUrl, { headers: headers })
            .map(response => response.json());
    }

    onGetPublishedFamily(id) {
        const requestUrl = this.getPublishedFamily + id;
        const headers = this.createAuthorizationHeader();
        return this._http.get(requestUrl, { headers: headers })
            .map(response => response.json());
    }

    onGetPublishedProduct(id) {
        const requestUrl = this.getPublishedProduct + id;
        const headers = this.createAuthorizationHeader();
        return this._http.get(requestUrl, { headers: headers })
            .map(response => response.json());
    }

    onGetPublishedPackageProfile(id) {
        const requestUrl = this.getPublishedPackageProfile + id;
        const headers = this.createAuthorizationHeader();
        return this._http.get(requestUrl, { headers: headers })
            .map(response => response.json());
    }

    // Get all actions from database
    getEntities(type: AssetType) {
        console.log(AssetItem.isOperatorType(type));
        const headers = this.createAuthorizationHeader();
        const requestUrl = AssetItem.isOperatorType(type) ? this.getActions : this.entitiesResource + AssetItem.getUniTypeValue(type);
        return this._http.get(requestUrl, { headers: headers })
            .map(response => response.json());
    }

    // Get single action from data base
    getEntity(type: AssetType, id: number) {
        const resourceUrl = AssetItem.isOperatorType(type) ? this.getEditAction : this.entityResource;
        const requestUrl = resourceUrl + "?entityType=" + AssetItem.getUniTypeValue(type) + "&id=" + id + "&loadContent=true";
        const headers = this.createAuthorizationHeader();
        return this._http.get(requestUrl, { headers: headers })
            .map(response => response.json());
    }

    // Create and save new action
    putAction(data: any) {
        const body = JSON.stringify(data);
        const headers = this.createAuthorizationHeader();
        headers.append("Content-Type", 'application/json');
        return this._http.put(this.newAction, body, { headers: headers })
            .map(response => response.json());
    }

    // Edit action
    postAction(data: any) {
        const body = JSON.stringify(data);
        const headers = this.createAuthorizationHeader();
        headers.append("Content-Type", 'application/json');
        return this._http.post(this.saveEditAction, body, { headers: headers })
            .map(response => response.json());
    }

    copyItem(id: number) {
        const requestUrl = this.copy + id;
        const headers = this.createAuthorizationHeader();
        const body = '';
        return this._http.put(requestUrl, body, { headers: headers })
            .map(response => response.json());
    }

    // Move item to trashcan
    removeItem(id: number) {
        const requestUrl = this.getDeleteUrl() + id;
        const headers = this.createAuthorizationHeader();
        return this._http.delete(requestUrl, { headers: headers })
            .map(response => response.json());
    }


    removeSelected(data: any) {
        const body = JSON.stringify(data);
        const requestUrl = this.getDeleteUrl();
        const headers = this.createAuthorizationHeader();
        headers.append("Content-Type", 'application/json');
        return this._http.post(requestUrl, body, { headers: headers })
            .map(response => response.json());
    }

    getDeleteUrl() {
        if ('Designer' == this.userSvc.getCurrentRole()) {
            return this.deleteDesignerItem;
        }
        else {
            return this.deleteOperatorItem;
        }
    }

    // Permanently delete all items from trashcan
    purge(data: any) {
        const body = JSON.stringify(data);
        const requestUrl = this.getPurgeUrl();
        const headers = this.createAuthorizationHeader();
        headers.append("Content-Type", 'application/json');
        return this._http.post(requestUrl, body, { headers: headers })
            .map(response => response.json());
    }

    getPurgeUrl() {
        if ('Designer' == this.userSvc.getCurrentRole()) {
            return this.permanentlyDeleteDesignerItem;
        }
        return this.permanentlyDeleteOperatorItem;
    }

    // Remove item from trashcan and restore it to its original place
    restoreItem(data: any) {
        const body = JSON.stringify(data);
        const requestUrl = this.getRestoreUrl();
        const headers = this.createAuthorizationHeader();
        headers.append("Content-Type", 'application/json');
        return this._http.post(requestUrl, body, { headers: headers })
            .map(response => response.json());
    }

    getRestoreUrl() {
        if ('Designer' == this.userSvc.getCurrentRole()) {
            return this.restoreDesignerItem;
        }
        return this.restoreOperatorItem;
    }

    // Get the total number of items in trachcan
    getTrashItemCount() {
        const headers = this.createAuthorizationHeader();
        const requestUrl = this.getTrashItemCountUrl();
        return this._http.get(requestUrl, { headers: headers })
            .map(response => response.json());
    }

    getTrashItemCountUrl() {
        if ('Designer' == this.userSvc.getCurrentRole()) {
            return this.deletedDesignerItemsCount;
        }
        return this.deletedOperatorItemsCount;
    }

    // Get the items that are in trashcan
    getItemsFromTrash() {
        const requestUrl = this.getTrashCanUrl();
        const headers = this.createAuthorizationHeader();
        return this._http.get(requestUrl, { headers: headers })
            .map(response => response.json());
    }

    getTrashCanUrl() {
        if ('Designer' == this.userSvc.getCurrentRole()) {
            return this.getItemsInDesignerTrash;
        }
        return this.getItemsInOperatorTrash;
    }

    getUsergroups() {
        const headers = this.createAuthorizationHeader();
        const requestUrl = this.userGroupsResorce;
        return this._http.get(requestUrl, { headers: headers })
            .map(response => response.json());

    }

    getUser(userName: string, loadGroups: boolean) {
        const headers = this.createAuthorizationHeader();
        const requestUrl = this.usersResource + '/' + userName + "/?" + "loadGroups=" + loadGroups;
        return this._http.get(requestUrl, { headers: headers })
            .map(response => response.json());
    }


    createAuthorizationHeader() {
        const headers = new Headers();
        /* let userCurrentUser = this.userSvc.currentUser;
         if (userCurrentUser != null) {
             headers.append("Authorization", 'Basic ' + btoa(userCurrentUser.username + ":" + userCurrentUser.password));
         } else {
             // headers.append("Authorization", 'Basic ' + btoa("admin" + ":" + "password"));
 
         }
         */
        if (sessionStorage.getItem('user_token') != null || sessionStorage.getItem('user_token') != '') {
            headers.append("Token", sessionStorage.getItem('user_token'));
        }
        return headers;
    }

    sendInvitation(invitationData: any) {
        const body = JSON.stringify(invitationData);
        const headers = this.createAuthorizationHeader();
        headers.append("Content-Type", 'application/json');
        return this._http.post(this.invitationResource, body, { headers: headers })
            .map(response => response.json());
    }

    getUsers() {
        const headers = this.createAuthorizationHeader();
        const requestUrl = this.usersResource;
        console.log(requestUrl);
        return this._http.get(requestUrl, { headers: headers })
            .map(response => response.json());
    }

    getUserGroupUsers(groupid) {
        const headers = this.createAuthorizationHeader();
        headers.append("Content-Type", 'text/plain');
        const requestUrl = this.userGroupUsersResource + groupid + "?loadUsers=true";
        return this._http.get(requestUrl, { headers: headers })
            .map(response => response.json());
    }

    deleteUserGroup(userGroupName) {
        const requestUrl = this.deleteuserGroup + userGroupName;
        const headers = this.createAuthorizationHeader();
        return this._http.delete(requestUrl, { headers: headers })
            .map(response => response.json());
    }

    putUser(data: any) {
        const body = JSON.stringify(data);
        const headers = this.createAuthorizationHeader();
        headers.append("Content-Type", 'application/json');
        return this._http.put(this.userResource, body, { headers: headers })
            .map(response => response.json());
    }

    updateUser(data: any) {
        const body = JSON.stringify(data);
        const headers = this.createAuthorizationHeader();
        headers.append("Content-Type", 'application/json');
        return this._http.post(this.userResource, body, { headers: headers })
            .map(response => response.json());
    }

    deleteuser(userName) {
        const requestUrl = this.deleteUser + userName;
        const headers = this.createAuthorizationHeader();
        return this._http.delete(requestUrl, { headers: headers })
            .map(response => response.json());
    }

    updateUserGroups(data: any) {
        const body = JSON.stringify(data);
        const headers = this.createAuthorizationHeader();
        headers.append("Content-Type", 'application/json');
        return this._http.post(this.userGroupUpdade, body, { headers: headers })
            .map(response => response.json());
    }

    putUserGroup(data: any) {
        const body = JSON.stringify(data);
        const headers = this.createAuthorizationHeader();
        headers.append("Content-Type", 'application/json');
        return this._http.put(this.createUserGroup, body, { headers: headers })
            .map(response => response.json());
    }

    forgetUserName(name: string) {
        const headers = this.createAuthorizationHeader();
        headers.append("Content-Type", 'text/plain');
        const requestUrl = this.forgetUserNameResource + name;
        return this._http.get(requestUrl, { headers: headers })
            .map(response => response.json());
    }

    forgetPassWord(name: string) {
        const headers = this.createAuthorizationHeader();
        headers.append("Content-Type", 'text/plain');
        const requestUrl = this.forgetPasswordResource + name;
        return this._http.get(requestUrl, { headers: headers })
            .map(response => response.json());
    }

    resetPassword(pwd: string, token: string) {
        const headers = this.createAuthorizationHeader();
        const body = pwd;
        headers.append("Content-Type", "text/plain");
        const requestUrl = this.resetPasswordResource + token;
        return this._http.post(requestUrl, pwd, { headers: headers })
            .map(response => response.json());
    }

    getUserPreferences(userId: string) {
        const headers = this.createAuthorizationHeader();
        headers.append("Content-Type", 'text/plain');
        const requestUrl = this.userPreferencesResource + userId;
        return this._http.get(requestUrl, { headers: headers })
            .map(response => response.json());
    }

    emitItemChanged(change: boolean) {
        this.cardsChangedSource.next(change);
    }

    updatePreference(data: any) {
        const body = JSON.stringify(data);
        const headers = this.createAuthorizationHeader();
        headers.append("Content-Type", 'application/json');
        return this._http.post(this.userPreferencesResource, body, { headers: headers })
            .map(response => response.json());
    }

    login(userName: string, password: string) {
        const headers = new Headers();
        headers.append("Authorization", 'Basic ' + btoa(userName + ":" + password));
        headers.append("Content-Type", 'text/plain');
        const requestUrl = this.loginResource + userName;
        return this._http.get(requestUrl, { headers: headers })
            .map((response: Response) => {
                let res = response.json();
                this.token = response.headers.get('token')
                return res;
            });
    }

    getToken() {
        return this.token;
    }

    saveFileAs(fileData, fileName) {
        var mediaType = "text/plain;charset=utf-8";
        var blob = new Blob([JSON.stringify(fileData)], { type: mediaType });
        var filename = fileName + ".json";
        var saveAs: any;
        saveAs(blob, filename);
    }

    showReports(id, type) {
        const headers = this.createAuthorizationHeader();
        const requestUrl = this.getReports + id + '?entityType=' + this.getUniObjectTypeId(type);
        return this._http.get(requestUrl, { headers: headers })
            .map(response => response.json());
    }

    getReport(data) {
        const body = JSON.stringify(data);
        const headers = new Headers();
        headers.append("Content-Type", 'application/json');
        return this._http.post(this.runNow, body, { headers: headers })
            .map(response => response.json());
    }

    addReport(id, data) {
        var body = JSON.stringify(data);
        const headers = this.createAuthorizationHeader();
        headers.append("Content-Type", 'application/json');
        const requestUrl = this.saveReport + id;
        return this._http.put(requestUrl, body, { headers: headers })
            .map(response => response.json());
    }

    getDnaAttributes() {
        const headers = this.createAuthorizationHeader();
        const requestUrl = this.dnaResource;
        return this._http.get(requestUrl, { headers: headers })
            .map(response => response.json());
    }

    addDnaAttribute(data: any) {
        const body = JSON.stringify(data);
        const headers = this.createAuthorizationHeader();
        headers.append("Content-Type", 'application/json');
        return this._http.put(this.addDnaResource, body, { headers: headers })
            .map(response => response.json());
    }

    updateDnaAttributes(data: any) {
        const body = JSON.stringify(data);
        const headers = this.createAuthorizationHeader();
        headers.append("Content-Type", 'application/json');
        return this._http.post(this.updateDnaResource, body, { headers: headers })
            .map(response => response.json());
    }

    deleteDnaAttribute(id: number) {
        const requestUrl = this.deleteDnaResource + id;
        const headers = this.createAuthorizationHeader();
        return this._http.delete(requestUrl, { headers: headers })
            .map(response => response.json());
    }

    public getUniObjectTypeId(item) {
        switch (item) {
            case 'Item Acquisition':
                return 15;
            case 'Item Authentication':
                return 16;
            case 'User Access':
                return 17;
            case 'User Change':
                return 18;
            case 'Asset Management':
                return 19;
            case 'Lifecycle Change':
                return 20;
            case 'Action':
                return 23;
            case 'Package Profile':
                return 25;
        }
        return 15;
    }

}
