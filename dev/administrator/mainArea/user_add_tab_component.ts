import { Component, Input, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Router, RouterLink, ActivatedRoute, Data } from '@angular/router';
import { PreferenceItem } from '../../common/preferenceItem';
import { DefaultConstants, ALLOWED_MIME_TYPES, DEFAULT_PASSWORD } from '../../common/default_values';
import { userAddDescription } from '../../common/messages';
import 'rxjs/add/operator/map';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { usernameLengthValidator, matchingPasswords, passwordSpaceValidator, emailValidator, passwordLengthValidator, passwordSpecialValidator, passwordCharSValidator, passwordCharCValidator, passwordValidator } from '../validators/addUser.validators';
import { UserItem } from '../../common/userItem';
import { DataService } from '../../services/Assets.service';
import { UserGroup } from '../../common/usergroup';
import { UserImage } from '../../common/image';
import { DEFAULT_ADMIN_RESOURCE, DEFAULT_IMAGES_URL, DEFAULT_URL, DEFAULT_IMAGE_URL, DEFAULT_GRAVATAR_URL, DEFAULT_CIMAGE_URL } from '../../common/defaultHost';
import { Md5 } from '../../md5/md5';
import { UsersService } from '../../services/User.service';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { MessageService } from '../../services/message.service';
import { MessageCenterComponent } from '../../message-center/message-center.component';
import { Message } from '../../message-center/message';
import { Subscription } from 'rxjs';

@Component({
    selector: 'unisecure-adduser-tab',
    templateUrl: 'public/html/mainArea/userForm.template.html',
    styleUrls: ['public/css/mainArea/breadcrumb.css', 'public/css/topBanner/topBanner.css', 'public/css/mainArea/view.css', 'public/css/common/table.css', 'public/css/common/modal.css', 'public/css/common/anchorButton.css'],
    inputs: ['preferenceItem']
})

export class UserAddComponent implements OnInit {
    password: string = '';
    validPassword: boolean = true;
    visible: boolean = false;
    user_images: string;
    editFlag: boolean = false;
    //  tempJson = [];
    filesUpload: File;
    userItem: UserItem = null;
    preferenceItem: PreferenceItem = null;
    display: string = PreferenceItem.getDisplayName('User');
    image: string = DefaultConstants.DEFAULT_IMAGE_FOLDER_PATH + PreferenceItem.getDefaultImageUrl('User');
    existingGroups: Array<any> = [];
    defaultintro = userAddDescription;
    nameControl = 'preferenceItem.nameField';
    editMode: string = 'create';
    data: string;
    imageUploaded: boolean = false;
    userForm: FormGroup;
    selectedGroups: any = [];
    userSaved: boolean = false;
    selectAll: boolean;
    name: string;
    isCreate: boolean = true;
    tempPassword: string = '$1#2Aeiou@21';
    vPassword: string = '';
    sync: boolean;
    picDisable: boolean = false;
    loading: boolean;
    messages: string;
    plugs: string[] = [''];
    load: boolean = false;
    updatePwd: boolean = false;
    isInvite: boolean = false;
    newUser: boolean = false;
    temp: boolean = false;
    //-----------------------------------------------ConfirmModal-------------------
    @ViewChild('confirmModal')
    confirmModal: ModalComponent;
    confirmTitle: string = '';
    message: string = '';
    showCancel: boolean = false;
    okButtonLabel: string = 'Ok';
    cancelButtonLabel: string = 'No';
    //-----------------
    subscription: Subscription;
    customPlugs: string[] = ['a'];

    constructor(public http: Http, private route: ActivatedRoute, private router: Router, private fb: FormBuilder, private dataService: DataService, private ms: MessageService, private userSvc: UsersService) {
        this.userForm = fb.group({
            userName: ['', Validators.compose([Validators.required, usernameLengthValidator])],
            password: ['', Validators.compose([Validators.required, passwordValidator, passwordSpaceValidator, passwordCharSValidator, passwordCharCValidator, passwordSpecialValidator, passwordLengthValidator])],
            verifyPassword: ['', Validators.required],
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            email: ['', Validators.compose([Validators.required, emailValidator])]
        }, {
                validator: matchingPasswords('password', 'verifyPassword')
            })
    }

    ngOnInit() {
        this.loading = true;
        this.subscription = this.route.params.subscribe(
            (params: any) => {
                if (params.hasOwnProperty('userName')) {
                    this.editMode = 'edit';
                    this.name = params['userName'];
                }
            }
        );
        if (this.editMode == 'create') {
            this.filesUpload = null;
            this.user_images = DefaultConstants.DEFAULT_IMAGE_FOLDER_PATH + "default_profile.png";
            this.userItem = new UserItem(0, '', '', '', '', '', 0, '', false, false);
            this.dataService.getUsergroups().subscribe(
                data => this.onGetUserGroups(data),
                error => this.onGetUserGroupsError(error),
                () => { this.editFlag = false, this.userSaved = true; this.temp = true; }
            );
        }
        else {
            this.userSaved = true;
            this.isCreate = false;
            this.vPassword = this.tempPassword;
            this.userItem = new UserItem(0, '', '', '', '', '', 0, '', false, false);
            this.dataService.getUser(this.name, true).subscribe(
                data => this.onGetUserDetails(data),
                error => this.onGetUserDetails(error),
                () => {
                    this.dataService.getUsergroups().subscribe(
                        data => this.onGetUserGroups(data),
                        error => this.onGetUserGroupsError(error),
                        () => { this.updateGroupsSelection(); this.temp = true; }
                    );
                }
            );
        }
        this.editFlag = false;

    }

    onGetUsers(jsonData: JSON) {
        const status = jsonData.hasOwnProperty("status") ? jsonData["status"] : '';
        if (status !== "SUCCESS") {
            this.onGetUsersError(jsonData);
        } else {
            var users = jsonData["data"];
            if (users != null && users.length > 0) {
                for (var index = 0; index < users.length; index++) {
                    let entry: UserItem = UserItem.parse(users[index]);
                    if (entry != null && entry.userName == this.name) {
                        if (entry.useGravatar) {
                            if (entry.imageURL == null) {
                                this.calculateGravtar();
                            } else {
                                this.user_images = entry.imageURL;
                            }
                        }
                        else {
                            var date = new Date().getTime();
                            this.user_images = entry.imageURL + "?" + date;
                        }
                    } else {
                        this.user_images = DefaultConstants.DEFAULT_IMAGE_FOLDER_PATH + "default_profile.png";
                    }
                }
            }
        }

    }


    onContentChange() {
        if (this.temp || this.isCreate) {
            this.editFlag = true;
            this.userSaved = false;
        }
    }

    sendInvitation() {
        this.userItem.updateInvitationJSONObject();
        this.load = true;

        const invitationData = this.userItem.jsonInvitationObject;
        this.dataService.sendInvitation(invitationData).subscribe(
            invitationData => this.sendInvitationError(invitationData),
            error => console.log("Failed " + error),
            () => console.log('Authentication Complete')
        )
    }

    sendInvitationError(error: any) {
        this.load = false;
        this.isInvite = false;
        if (error.status == 'ERROR') {
            if (error.message != null) {
                let jsonMsgs = JSON.parse(error.message);
                if (jsonMsgs.msgs != null && jsonMsgs.msgs.length > 0) {
                    let msg = jsonMsgs.msgs[0];
                    let msgId = "" + msg.id;
                    while (msgId.length < 6) {
                        msgId = "0" + msgId;
                    }
                    let prefix = jsonMsgs.prefix + msgId + jsonMsgs.langId.charAt(0).toUpperCase();
                    this.ms.displayRawMessage(new Message(error.status, msg.message, msg.action, msg.suggestion, prefix), this.customPlugs)
                        .subscribe((value) => console.log(value));
                }
            }
        }
        if (error.status == 'SUCCESS') {
            console.log("Sent Invitation Success");
            this.ms.displayRawMessage(new Message(error.status, error.message, '', '', ''), this.customPlugs)
                .subscribe((value) => console.log(value));
            if (this.newUser) {
                localStorage.setItem('errorstatus', error.status);
                localStorage.setItem('errormessage', error.message);
                if (this.editMode == 'create') {
                    this.onCancel();
                    this.router.navigate(['adduser']);
                } else {
                    this.router.navigate(['adduser']);
                }
            }
        }
    }

    syncGravatar() {
        this.onContentChange();
        if (this.userItem.useGravatar == true) {
            this.calculateGravtar();
            this.imageUploaded = true;
        }
        else if (this.userItem.useGravatar == false && !this.filesUpload) {
            this.user_images = this.user_images = DefaultConstants.DEFAULT_IMAGE_FOLDER_PATH + "default_profile.png";
        }
    }

    calculateGravtar() {
        if (this.userItem != null && this.userItem.email != null) {
            let emailHash = Md5.hashStr((this.userItem.email).toLowerCase());
            console.log("email" + this.userItem.email + "hash:" + emailHash);
            var default_img = DEFAULT_CIMAGE_URL + "default_profile.png";
            var enc_img = encodeURI(default_img);
            this.user_images = DEFAULT_GRAVATAR_URL + emailHash + "?s=100" + "?d=" + enc_img;
            this.userItem.imageURL = this.user_images;
        }
    }

    onGetUsersError(jsonData: JSON) {
        console.log(jsonData);
    }

    onGetUserDetails(jsonData: JSON) {
        const status = jsonData.hasOwnProperty("status") ? jsonData["status"] : '';
        if (status !== "SUCCESS") {
            this.onGetUserDetailsError(jsonData);
        } else {
            var data = jsonData["data"];
            var entityList = null;
            if (data != null) {
                if (data instanceof Array) {
                    if (data.length > 0) {
                        entityList = data[0];
                    }
                } else {
                    entityList = data;
                }
            }
            if (entityList != null) {
                let entry: UserItem = UserItem.parse(entityList);
                if (entry != null) {
                    this.userItem = entry;
                    if (entry.imageURL != null) {
                        var date = new Date().getTime();
                        this.user_images = entry.imageURL + "?" + date;
                    }
                    else {
                        this.user_images = DefaultConstants.DEFAULT_IMAGE_FOLDER_PATH + "default_profile.png";
                    }

                } else {
                    this.user_images = DefaultConstants.DEFAULT_IMAGE_FOLDER_PATH + "default_profile.png";
                }

            }
        }
    }

    updateGroupsSelection() {
        if (this.userItem != null && this.userItem.userGroupList != null) {
            for (var i = 0; i < this.userItem.userGroupList.length; i++) {
                let group = this.userItem.userGroupList[i];
                if (group != null) {
                    let id = group.id;
                    for (var g = 0; g < this.existingGroups.length; g++) {
                        let existGroup = this.existingGroups[g];
                        if (existGroup.groupid == id) {
                            this.existingGroups[g].isChecked = true;
                            break;
                        }
                    }
                }
            }
        }
    }

    onGetUserDetailsError(jsonData: JSON) {
        console.log(jsonData);
    }

    selectAllGroups() {
        this.onContentChange();
        if (this.selectAll == true) {
            this.userItem.userGroupList = [];
            for (var i = 0; i < this.existingGroups.length; i++) {
                this.userItem.userGroupList.push({ "id": this.existingGroups[i].groupid });
                this.existingGroups[i].isChecked = true;
            }
        }
        else {
            for (var i = 0; i < this.existingGroups.length; i++) {
                this.existingGroups[i].isChecked = false;
            }
        }
    }

    selectGroups(index: number) {
        this.existingGroups[index].isChecked = !this.existingGroups[index].isChecked;
        this.onContentChange();
    }


    onGetUserGroups(jsonData: JSON) {
        if (localStorage.getItem("errorstatus") != null && localStorage.getItem("errorstatus") == "SUCCESS") {
            this.ms.displayRawMessage(new Message(localStorage.getItem("errorstatus"), localStorage.getItem("errormessage"), '', '', ''), this.customPlugs)
                .subscribe((value) => console.log(value));
            localStorage.setItem("errormessage", null);
            localStorage.setItem("errorstatus", null);
        }
        const status = jsonData.hasOwnProperty("status") ? jsonData["status"] : '';
        if (this.existingGroups != null) {
            this.existingGroups.splice(0, this.existingGroups.length);
        }
        if (status !== "SUCCESS") {
            this.onGetUserGroupsError(jsonData);
        } else {
            var usergroups = jsonData["data"];
            if (usergroups != null) {
                if (usergroups != null && usergroups.length > 0) {
                    for (var index = 0; index < usergroups.length; index++) {
                        let entry: UserGroup = UserGroup.parse(usergroups[index]);
                        if (entry != null) {
                            this.existingGroups.push(entry);
                        }
                    }
                }
            }
            this.loading = false;
        }
    }

    onGetUserGroupsError(jsonData: JSON) {
        console.log(jsonData);
    }

    homeSelected() {
        if (this.editFlag) {
            this.openModal("Do you want to save the changes you made to \'" + this.userItem.userName + "'?", "", true);
        }
        else {
            this.navigateBack();
        }
    }

    usersTabSelected() {
        this.router.navigate(['usergroups']);
    }

    fileChange(input) {
        if (!this.userItem.useGravatar) {
            var reader = [];
            var imgInput = <HTMLInputElement>input.target,
                files = <FileList>imgInput.files;
            if (!this.hasValidFileTypeValid(files[0].type)) {
                alert('Only image files are allowed');
                return false;
            }
            this.filesUpload = <File>files[0];
            reader.push(new FileReader());
            reader[0].addEventListener("load", (input) => {
                this.user_images = input.target.result;
            }, false);
            if (this.filesUpload) {
                reader[0].readAsDataURL(this.filesUpload);
                this.imageUploaded = true;
            }
            this.editFlag = true;
        }
    }

    hasValidFileTypeValid(type: string): boolean {
        return (ALLOWED_MIME_TYPES.indexOf(type.toLowerCase()) !== -1);
    }

    clickAdd() {
        this.router.navigate(['Adduser']);
    }

    getImageId(jsonData): number {
        const status = jsonData.hasOwnProperty("status") ? jsonData["status"] : '';
        if (status !== "SUCCESS") {
            this.onGetUserGroupsError(jsonData);
        } else {
            var data = jsonData["data"];
            if (data != null) {
                if (data instanceof Array) {
                    if (data.length > 0) {
                        data[0].pkid;
                    }
                } else {
                    return data.pkid;
                }
            }
        }
    }

    makeFileRequest(url: string, params: Array<string>, files: File) {
        return new Promise((resolve, reject) => {
            var formData: any = new FormData();
            //var filename :string;
            var xhr = new XMLHttpRequest();
            var filename = this.userItem.userName + "." + this.filesUpload.name.slice((this.filesUpload.name.lastIndexOf(".") - 1 >>> 0) + 2);
            this.userItem.imageURL = filename;
            formData.append("file", files, filename);
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        resolve(JSON.parse(xhr.response));
                    } else {
                        reject(xhr.response);
                    }
                }
            }
            xhr.open("POST", url, true);
            if (this.userSvc != null && this.userSvc.currentUser != null) {
                xhr.setRequestHeader("Authorization", "Basic " + btoa(this.userSvc.getCurrentUserName() + ":" + this.userSvc.currentUser.password));
            }
            xhr.send(formData);
        });
    }

    invite() {
        this.isInvite = true;
        this.onSubmit();
    }

    onSubmit() {
        if (this.editMode == "create") {
            this.userItem.userGroupList.splice(0, this.userItem.userGroupList.length);
            for (var i = 0; i < this.existingGroups.length; i++) {
                if (this.existingGroups[i].isChecked == true) {
                    this.userItem.userGroupList.push({ "id": this.existingGroups[i].groupid });
                }
            }
            this.userItem.updateJSONObject();
            const data = this.userItem.jsonObject;
            this.dataService.putUser(data).subscribe(
                data => this.uploadImage(data),
                error => console.log(error),
                () => console.log('Authentication Complete')
            )
        }
        else if (this.editMode == "edit") {
            this.userItem.userGroupList = [];
            if (this.imageUploaded && !this.userItem.useGravatar) {
                this.makeFileRequest(DEFAULT_ADMIN_RESOURCE + "/image/" + this.userItem.userName, [], this.filesUpload).then((result) => {
                    this.userItem.imageId = this.getImageId(result);
                    if (result != null) {
                        for (var i = 0; i < this.existingGroups.length; i++) {
                            if (this.existingGroups[i].isChecked == true) {
                                this.userItem.userGroupList.push({ "id": this.existingGroups[i].groupid });
                            }
                        }
                        this.userItem.userName = this.name;
                        if (this.updatePwd) {
                            this.userItem.password = this.tempPassword;
                            this.userItem.updateJSONObject();
                        }
                        else {
                            this.userItem.updatJSONObject();
                        }
                        const data = this.userItem.jsonObject;
                        this.dataService.updateUser(data).subscribe(
                            data => this.handleError(data),
                            error => console.log("Failed " + error),
                            () => console.log('Authentication Complete')
                        )
                    }
                },
                    (error) => {
                        console.error(error);
                    }
                );
            }
            else {
                this.userItem.userName = this.name;
                this.userItem.userGroupList.splice(0, this.userItem.userGroupList.length);
                for (var i = 0; i < this.existingGroups.length; i++) {
                    if (this.existingGroups[i].isChecked == true) {
                        this.userItem.userGroupList.push({ "id": this.existingGroups[i].groupid });
                    }
                }
                if (this.updatePwd) {
                    this.userItem.password = this.tempPassword;
                    this.userItem.updateJSONObject();
                }
                else {
                    this.userItem.updatJSONObject();
                }
                const data = this.userItem.jsonObject;
                this.dataService.updateUser(data).subscribe(
                    data => this.handleError(data),
                    error => console.log("Failed " + error),
                    () => console.log('Authentication Complete')
                )
            }
            this.editFlag = false;
        }


    }

    uploadImage(data: any) {
        if (data.status == 'SUCCESS' && this.imageUploaded && (this.userItem.useGravatar == false)) {
            this.saveImage();
            this.handleError(data);
        }
        else {
            this.handleError(data);
        }
    }

    saveImage() {
        this.makeFileRequest(DEFAULT_ADMIN_RESOURCE + "/image/" + this.userItem.userName, [], this.filesUpload).then((result) => {
            this.userItem.imageId = this.getImageId(result);
            if (result != null) {
                this.userItem.updateJSONObject();
                const data = this.userItem.jsonObject;
                this.dataService.updateUser(data).subscribe(
                    data => this.handleCreateUser(data),
                    error => console.log("Failed " + error),
                    () => console.log('Authentication Complete')
                )
            }
        },
            (error) => {
                console.error(error);
            }
        );

    }

    handleCreateUser(error: any) {
        if (error.status == 'ERROR') {
            if (error.message != null) {
                this.ms.displayRawMessage(new Message(error.status, "User created Successfully. But Image is not uploaded", '', '', ''), this.customPlugs)
                    .subscribe((value) => console.log(value));
            }
        }
        else if (error.status == 'SUCCESS') {
            console.log("Image uploaded");

        }

    }

    handleError(error: any) {
        if (error.status == 'ERROR') {
            if (error.message != null) {
                let jsonMsgs = JSON.parse(error.message);
                if (jsonMsgs.msgs != null && jsonMsgs.msgs.length > 0) {
                    let msg = jsonMsgs.msgs[0];
                    let msgId = "" + msg.id;
                    while (msgId.length < 6) {
                        msgId = "0" + msgId;
                    }
                    let prefix = jsonMsgs.prefix + msgId + jsonMsgs.langId.charAt(0).toUpperCase();
                    this.ms.displayRawMessage(new Message(error.status, msg.message, msg.action, msg.suggestion, prefix), this.customPlugs)
                        .subscribe((value) => console.log(value));
                }
            }
        }
        else if (error.status == 'SUCCESS') {
            if (this.editMode == 'edit' && this.updatePwd) {
                this.userSvc.currentUser.password = this.userItem.password;
            }
            this.ms.displayRawMessage(new Message(error.status, error.message, '', '', ''), this.customPlugs)
                .subscribe((value) => console.log(value));
            this.userSaved = true;
            this.editFlag = false;
            if (this.isInvite) {
                this.sendInvitation();
            }

        }

    }

    onCreateNewUser() {
        if (this.userForm.valid) {
            if (!this.userSaved) {
                this.isInvite = true;
                this.newUser = true;
                this.onSubmit();
            }
            else {
                this.onCancel();
                this.router.navigate(['adduser']);
            }

            this.onContentChange();
        }
        else {
            console.log("form not valid");
        }
    }

    onCancel() {
        console.log(this.editFlag);
        if (this.editFlag) {
            this.openModal("Do you want to save the changes you made to \'" + this.userItem.userName + "'?", "", true);
        }
        else {
            this.router.navigate(['Administrator/usergroups']);
        }
    }

    headerCollapse() {
        this.visible = !this.visible;
    }

    getUsername() {
        let name = this.userItem.userName;
        if (name != null && name.length > 30) {
            return name.slice(0, 29) + "...";
        }
        return name;
    }

    updatePassword() {
        this.editFlag = true;
        this.userSaved = false;
        this.updatePwd = true;
        if (this.tempPassword == DEFAULT_PASSWORD) {
            this.tempPassword = '';
            this.vPassword = '';
        }

    }

    updateVPassword() {
        this.editFlag = true;
        this.userSaved = false;
        this.updatePwd = true;
        if (this.tempPassword == DEFAULT_PASSWORD) {
            this.vPassword = '';
        }

    }

    openModal(title: string, message: string, showCancel: boolean) {
        this.confirmTitle = title;
        this.message = message == null ? '' : message;
        this.showCancel = showCancel;
        this.okButtonLabel = this.showCancel ? "Save" : "Ok";
        this.confirmModal.open();
    }

    okClicked() {
        this.confirmModal.close();
        if (this.showCancel) {
            if (this.okButtonLabel == "Save") {
                this.onSubmit();
                this.confirmModal.close();
                this.router.navigate(['Administrator/usergroups']);
            }
        }
    }

    cancelClicked() {
        this.confirmModal.close();
        this.router.navigate(['Administrator/usergroups']);
    }

    navigateBack() {
        // if (url == "Admin") {
        this.router.navigate(['Administrator']);
        // }
        // else if (url == "UserGroup") {
        //     if (this.editMode == 'create') {
        //         this.router.navigate(['../usergroups'], { relativeTo: this.route });
        //     }
        //     else {
        //         this.router.navigate(['../../usergroups'], { relativeTo: this.route });
        //     }
        // }
    }

    mapRoles(role) {
        switch (role) {
            case 'administratorRole':
                return 'A';
            case 'designerRole':
                return 'D';
            case 'operatorRole':
                return 'O';
            case 'inspectorRole':
                return 'I';
            case 'prodOperatorRole':
                return 'P';
            default:
                return '';
        }
    }

    imageShow(role) {
        switch (role) {
            case 'administratorRole':
                return 'public/img/unisecure_icon_administrator.png';
            case 'designerRole':
                return 'public/img/unisecure_icon_designer.png';
            case 'operatorRole':
                return 'public/img/unisecure_icon_inspector.png';
            case 'inspectorRole':
                return 'public/img/unisecure_icon_operator.png';
            case 'prodOperatorRole':
                return 'public/img/unisecure_icon_productionoperator.png';
            default:
                return '';
        }
    }

    getGroupDescription(usergroup) {
        if (usergroup == null || usergroup.description == null) {
            return '';
        }
        if (usergroup.description.length > 20) {
            return usergroup.description.slice(0, 19) + "...";
        }
        return usergroup.description;
    }

}
