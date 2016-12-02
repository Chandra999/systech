import { Component, Input, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Router, RouterLink, ActivatedRoute, Data } from '@angular/router';
import { PreferenceItem } from '../../common/preferenceItem';
import { PreferenceList } from '../../common/preferenceList';
import { DefaultConstants, ALLOWED_MIME_TYPES, DEFAULT_PASSWORD } from '../../common/default_values';
import { usernameLengthValidator, matchingPasswords, emailValidator, passwordLengthValidator, passwordSpecialValidator, passwordCharSValidator, passwordCharCValidator, passwordValidator } from '../../administrator/validators/addUser.validators';
import { DisplayPreference } from '../../common/displayPreference';
import { UsersService } from '../../services/User.service';
import { UserItem } from '../../common/userItem';
import { DataService } from '../../services/Assets.service';
import { DEFAULT_ADMIN_RESOURCE, DEFAULT_IMAGE_URL, DEFAULT_IMAGES_URL, DEFAULT_GRAVATAR_URL, DEFAULT_CIMAGE_URL } from '../../common/defaultHost';
import { Md5 } from '../../md5/md5';
import { MessageService } from '../../services/message.service';
import { MessageCenterComponent } from '../../message-center/message-center.component';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { Message } from '../../message-center/message';

@Component({
    selector: 'Account',
    template: `
        <div class="topnav uni-card2" style="position:fixed; top:68px; padding:0px; color :white; z-index:1">
            <div style="overflow:auto">
                <div style="overflow:hidden;height:44px;text-align:center;z-index:1">
                    <a title="Account Preferences">
                        <i style="text-align:center;display:block;"></i>Display Preferences
                    </a>
                </div>
            </div>
        </div>
        <div>
            <ul style="margin-left:20px;" id="breadcrumb">
                <li><a (click)="homeSelected()"> Preferences</a> </li>
                <li><a>Account Information</a> </li>
                <li>
                    <a>
                        <span class="glyphicon glyphicon-asterisk" style="margin-left:2px;" [hidden]=!editFlag></span> {{current_username}}
                    </a>
                </li>
            </ul>
        </div>
        <div>
            <form id="updateAccount" (ngSubmit)="accountForm.valid && onSubmit()">
                <div class="unisecure-account-box">
                    <span class="glyphicon glyphicon-remove formClose" (click)="onCancel()" title="Close"></span>
                    <div *ngIf="!load" style="background: #e9e9e9; position: absolute; top: 0; right: 0; bottom: 0; left: 0; opacity: 0.5;">
                        <a style="font-size:x-large;  height: 100%; z-index: 200;float:left;margin-left:40%;fon-weight:strong;">
                            <span class="glyphicon glyphicon-refresh glyphicon-refresh-animate" style="color:#8dc63f;"></span> Loading...
                        </a>
                    </div>
                    <div style="float:left;width:50%;margin-top:17px;" ng-control-group="user" class="left-form">
                        <div>
                            <div style="margin-left:30px;" class="form-group form-group-sm">
                                <label for="name">First Name</label>
                                <div style="width:90%">
                                    <input type="text" class="form-control" placeholder="First Name" #firstName='ngForm' value="firstName" [(ngModel)]="userItem.firstName"
                                        name="firstName" [formControl]="accountForm.controls['firstName']" pattern="[a-zA-Z]*">
                                    <div class='error' *ngIf='firstName.control.touched'>
                                        <div *ngIf="firstName.control.hasError('required')">First name is required.</div>
                                        <div *ngIf="firstName.control.hasError('pattern')">Certain special characters are not allowed.</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div style="margin-left:30px;" class="form-group form-group-sm">
                                <label for="name">Last Name</label>
                                <div style="width:90%">
                                    <input type="text" class="form-control" placeholder="Last Name" #lastName='ngForm' value="lastName" [(ngModel)]="userItem.lastName" name="lastName" [formControl]="accountForm.controls['lastName']" pattern="[a-zA-Z]*">
                                    <div class='error' *ngIf='lastName.control.touched'>
                                        <div *ngIf="lastName.control.hasError('required')">Last name is required.</div>
                                        <div *ngIf="lastName.control.hasError('pattern')">Certain special characters are not allowed.</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div style="margin-left:30px;" class="form-group form-group-sm">
                                <label for="name">Email</label>
                                <div style="width:90%">
                                    <input type="email" class="form-control" placeholder="E-mail" value="email" #email='ngForm' [(ngModel)]="userItem.email"
                                        name="email" [formControl]="accountForm.controls['email']">
                                    <div class='error' *ngIf="email.control.touched">
                                        <div *ngIf="email.control.hasError('required')">Email is required.</div>
                                        <div *ngIf="email.control.hasError('invalidEmail')">Email is invalid.</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style="margin-left:30px;" class="form-group form-group-sm">
                            <div style="width:90%" class="uni-card-2">
                                <br>
                                <fieldset class="picture">
                                    <div>
                                        <label *ngIf="userItem.useGravatar" class="uni-button-disable"> Change Picture </label>
                                        <label *ngIf="!userItem.useGravatar" class="uni-button">  Change Picture <input type="file" accept=".png,.jpeg,.gif" style="display: none;" (change)="fileChange($event)" />          </label>
                                        <div style="float:right; margin-right:30px;font-size:12px">
                                            <input class="unicheckbox" type="checkbox" [(ngModel)]="userItem.useGravatar" name="useGravatar" (ngModelChange)="syncGravatar()"
                                                [formControl]="accountForm.controls['useGravatar']"> <strong>Synchronize with Gravatar</strong>
                                        </div>
                                    </div>
                                    <br>
                                    <div style="width:70px; height:70px;">
                                        <div>
                                            <img style="margin-left:20px; width:70px; height:70px;" src='{{ user_images }}' alt="" />
                                        </div>
                                    </div>
                                    <br>
                                </fieldset>
                            </div>
                        </div>
                    </div>
                    <div style="float:right;width:50%;margin-top:17px;" class="right-form">
                        <div>
                            <div>
                                <div style="margin-left:30px;" class="form-group form-group-sm">
                                    <label for="name">Password</label>
                                    <div style="width:90%">
                                        <input type="password" class="form-control" placeholder="Password" #password='ngForm' [(ngModel)]="tempPassword" nmae="tempPswd"
                                            (focus)="updatePassword(); " [formControl]="accountForm.controls['password']">
                                        <div *ngIf="password.control.touched || !password.control.hasError('required')">
                                            <div id="passwor" *ngIf=" password.control.hasError('minCapChar') || password.control.hasError('minLen')  || password.control.hasError('minNumber') || password.control.hasError('specialChar')  || password.control.hasError('minSmallChar')">
                                                <span>
                                                    <ul>
                                                        <li  [ngClass]="{invalid:password.control.hasError('required'), valid:!password.control.hasError('required')}">Password is required.</li>
                                                        <li  [ngClass]="{invalid:password.control.hasError('minLen'), valid:!password.control.hasError('minLen')}">Password must be at least 6 characters long </li>
                                                        <li  [ngClass]="{invalid:password.control.hasError('specialChar'), valid:!password.control.hasError('specialChar')}">Password must contain at least one special character</li>
                                                        <li  [ngClass]="{invalid:password.control.hasError('minNumber'), valid:!password.control.hasError('minNumber')}">Password must contain at least one number</li>
                                                        <li  [ngClass]="{invalid:password.control.hasError('minCapChar'), valid:!password.control.hasError('minCapChar')}">Password must contain at least one upper case character</li>
                                                        <li  [ngClass]="{invalid:password.control.hasError('minSmallChar'), valid:!password.control.hasError('minSmallChar')}">Password must contain at least one lower case character</li>
                                                    </ul>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div style="margin-left:30px;" class="form-group form-group-sm">
                                    <label for="name">Verify Password</label>
                                    <div style="width:90%">
                                        <input type="password" class="form-control" placeholder="Verify Password" [(ngModel)]="vPassword" name="vPswd" (focus)="updatePassword();"
                                            #verifyPassword='ngForm' [formControl]="accountForm.controls['verifyPassword']">
                                        <div class='error' *ngIf="verifyPassword.control.touched">
                                            <div *ngIf="accountForm.hasError('mismatchedPasswords')">Passwords do not match.</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="fixed-action-btn" style=" left:1000px;top:175px; padding:0;z-index:0">
                                <message-center></message-center>
                                <a class="btn-floating btn-large" title="Options">
                                    <span class="glyphicon glyphicon-pencil" style="margin:11px 0 0 11px; font-size:18px;"></span>
                                </a>
                                <ul style="padding-left:0px; margin-bottom:-8px;">
                                    <li>
                                        <button type="submit" class="btn-floating" style="border:0;margin-left:-5px;" [disabled]="accountForm.invalid||!editFlag"
                                            title="Save">
                                            <span class="glyphicon glyphicon-floppy-save" style="margin-top:10px;"></span>
                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn-floating" type="button" (click)="onCancel()" title="Cancel">
                                            <span class="glyphicon glyphicon-remove" style="margin-top:10px;"></span>
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
        <modal #confirmModal style="color:#0458A2;">
            <modal-header [show-close]="false" style="height:30px !important"></modal-header>
            <modal-body>
                <div class='container2'>
                    <div>
                        <img src='public/img/alert_transparent_green_bright_2.png' class='iconDetails'>
                    </div>
                    <div style='margin-left:80px;word-wrap: break-word; '>
                        <div class="message">{{confirmTitle}}</div>
                        <div class="message">{{message}}</div>
                    </div>
                </div>
            </modal-body>
            <modal-footer>
                <button type="button" class='uni-button' (click)="cancelClicked()" style="float: right">{{cancelButtonLabel}}</button>
                <button type="button" [disabled]="accountForm.invalid" class='uni-button' (click)="okClicked()" style="float: right;margin-right:5px">{{okButtonLabel}}</button>
            </modal-footer>
        </modal>
    `,
    styleUrls: ['public/css/mainArea/breadcrumb.css', 'public/css/topBanner/topBanner.css', 'public/css/mainArea/view.css', 'public/css/app.css', 'public/css/common/anchorButton.css', 'public/css/common/modal.css'],
})

export class AccountInfoComponent implements OnInit {
    accountForm: FormGroup;
    user_images: string;
    current_username: string;
    userItem: UserItem = null;
    vPassword: string = '';
    imageUploaded: boolean = false;
    filesUpload: File;
    editFlag: boolean = false;
    tempPassword: string = '$1#2Aeiou@21';
    updatePwd: boolean = false;

    //-----------------------------------------------ConfirmModal-------------------

    @ViewChild('confirmModal')
    confirmModal: ModalComponent;
    confirmTitle: string = '';
    message: string = '';
    showCancel: boolean = false;
    okButtonLabel: string = 'Ok';
    cancelButtonLabel: string = 'No';

    //-----------------

    customPlugs: string[] = ['a'];
    load: boolean = false;


    constructor(public http: Http, private router: Router, private route: ActivatedRoute, private fb: FormBuilder, private userSvc: UsersService, private dataService: DataService, private ms: MessageService) {
        this.accountForm = fb.group({
            password: ['', Validators.compose([Validators.required, passwordValidator, passwordCharSValidator, passwordCharCValidator, passwordSpecialValidator, passwordLengthValidator])],
            verifyPassword: ['', Validators.required],
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            email: ['', Validators.compose([Validators.required, emailValidator])],
            useGravatar: []
        }, {
                validator: matchingPasswords('password', 'verifyPassword')
            })
    }

    ngOnInit() {
        this.current_username = this.userSvc.getCurrentUserName();
        this.vPassword = this.tempPassword;
        this.userItem = new UserItem(0, '', '', '', '', '', 0, '', false, false);
        this.dataService.getUser(this.current_username, true).subscribe(
            data => this.onGetUserDetails(data),
            error => this.onGetUserDetails(error),
            () => { this.load = true; }
        );
        this.accountForm.valueChanges.subscribe(value => {
            if (this.accountForm.dirty) {
                this.onContentChange();
            }
        })
    }

    onGetUserDetails(jsonData: JSON) {
        const status = jsonData.hasOwnProperty("status") ? jsonData["status"] : '';

        if (status !== "SUCCESS") {
            this.onGetUserDetailsError(jsonData);
        } else {
            var entityList = null;
            var data = jsonData["data"];
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
                    if (entry.imageURL != null && entry.imageURL.length > 2) {
                        this.user_images = entry.imageURL;
                    } else {
                        this.user_images = DEFAULT_CIMAGE_URL + "default_profile.png";
                    }
                }

            }
        }
    }

    hasValidFileTypeValid(type: string): boolean {
        return (ALLOWED_MIME_TYPES.indexOf(type.toLowerCase()) !== -1);
    }

    syncGravatar() {
        if (this.userItem.useGravatar) {
            let emailHash = Md5.hashStr((this.userItem.email).toLowerCase());
            var default_img = DEFAULT_CIMAGE_URL + "default_profile.png";
            var enc_img = encodeURI(default_img);
            this.user_images = DEFAULT_GRAVATAR_URL + emailHash + "?s=100" + "?d=" + enc_img;
            this.userItem.imageURL = this.user_images;
        }
        else if (this.userItem.useGravatar == false && !this.filesUpload) {
            this.user_images = this.user_images = DefaultConstants.DEFAULT_IMAGE_FOLDER_PATH + "default_profile.png";
        }
    }

    getImageId(jsonData): number {
        const status = jsonData.hasOwnProperty("status") ? jsonData["status"] : '';
        if (status !== "SUCCESS") {
            this.updatehandleError(jsonData);
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

    onContentChange() {
        this.editFlag = true;
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

    //Vinod: Don't know how to handle the error here, does not seems right. 
    saveImageAndUser() {
        this.makeFileRequest(DEFAULT_ADMIN_RESOURCE + "/image/" + this.userItem.userName, [], this.filesUpload).then((result) => {
            this.userItem.imageId = this.getImageId(result);
            if (result != null) {
                this.userItem.updateJSONObject();
                const data = this.userItem.jsonObject;
                this.dataService.updateUser(data).subscribe(
                    data => this.updatehandleError(data),
                    error => console.log("Failed " + error)
                )
            }
        }, (error) => {
            console.error(error);
        }
        );

    }

    onSubmit() {
        if (this.updatePwd) {
            this.userItem.password = this.tempPassword;
            this.userItem.updateJSONObject();
        }
        else {
            this.userItem.updatJSONObject();
        }
        const data = this.userItem.jsonObject;

        if (this.imageUploaded && !this.userItem.useGravatar) {
            //Vinod:We can call the save user parallel but error handling won't make sense. 
            this.saveImageAndUser();
        } else {
            this.dataService.updateUser(data).subscribe(
                data => this.updatehandleError(data),
                error => console.log("Failed " + error)
            )
        }
    }

    onGetUserDetailsError(jsonData: JSON) {
        console.log(jsonData);
    }

    homeSelected() {
        this.onCancel()
    }

    updatehandleError(jsonData: JSON) {
        const status = jsonData.hasOwnProperty("status") ? jsonData["status"] : '';
        const message = jsonData.hasOwnProperty("message") ? jsonData["message"] : '';

        if (status !== "SUCCESS") {
            this.ms.displayRawMessage(new Message(status, JSON.parse(message).msgs[0].message, JSON.parse(message).msgs[0].action, JSON.parse(message).msgs[0].suggestion, JSON.parse(message).prefix), this.customPlugs)
                .subscribe((value) => console.log(value));
        }
        else if (status == "SUCCESS") {
            if (this.updatePwd) {
                this.userSvc.currentUser.password = this.userItem.password;
            }
            this.ms.displayRawMessage(new Message(status, message, '', '', ''), this.customPlugs)
                .subscribe((value) => console.log(value));
            this.editFlag = false;
        }
    }

    onCancel() {
        if (this.editFlag == true) {
            this.openModal("Do you want to save the changes you made to \'" + this.userItem.userName + "'?", "", true);
        }
        else {
            this.router.navigate(['../'], { relativeTo: this.route });
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
                this.router.navigate(['../'], { relativeTo: this.route });
            }
        }
    }

    cancelClicked() {
        this.confirmModal.close();
        this.router.navigate(['../'], { relativeTo: this.route });

    }

    updatePassword() {
        this.updatePwd = true;
        if (this.tempPassword == DEFAULT_PASSWORD) {
            this.tempPassword = '';
            this.vPassword = '';
        }
    }
}
