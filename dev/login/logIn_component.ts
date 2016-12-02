import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UsersService } from '../services/User.service';
import { User } from "../common/user";
import { DataService } from '../services/Assets.service';
import { Preference } from "../common/preference";
import { DisplayPreference } from '../common/displayPreference';
import { logInDescription, newPasswordDescription, newPasswordHeading } from "../common/messages";
import { matchingPasswords, passwordLengthValidator, passwordSpecialValidator, passwordCharSValidator, passwordCharCValidator, passwordValidator } from '../administrator/validators/addUser.validators';
import { UserItem } from '../common/userItem';
import { Md5 } from '../md5/md5';
import { DEFAULT_GRAVATAR_URL, DEFAULT_CIMAGE_URL } from '../common/defaultHost';
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { Subscription } from "rxjs/Rx";

@Component({
    selector: 'unisecure-login',
    template: `
         <div *ngIf="isLogin" class="login-page">
          <div  class= "login-card">
            <div align='center'>
               <span class="welcomeHeaderFont login-welcome-header"> Welcome to</span>
               <img src='public/img/SYS_UniSecure.png' alt='UniSecure' class="login-welcome-image"/>
               </div>
            <br>
            <form style="margin:20px 20px; font-size : 16px" (ngSubmit)="onSubmit()" #f="ngForm">
              <div class="form-group form-group-sm">
               <span *ngIf="!isUserIdValid()" class="error">
                    The login informaiton you provided does not match our records. Please enter your Username and password.
                 </span>
             </div>    
              <div class="form-group form-group-sm">
                <label for="userId">Username </label>
                <div  class ="has-feedback">
                    <input  class="form-control" type="text" id="userId" [(ngModel)]='userId' name="id" placeholder="Enter Username" (keyup)="updateUserId()">
                </div>
                 <span *ngIf="isUserIdEmpty()" class="error">
                   Please enter Username.
                 </span>
              </div>
              <div class="form-group form-group-sm">
                <label for="password">Password </label>
                <div  class ="has-feedback">
                    <input  type="password" class="form-control" id="password" [(ngModel)]='password' name="pswd" placeholder="Enter password" oncopy="return false" onpaste="return false" (keyup)="updatePassword()">
                </div>
                 <span *ngIf="isPasswordEmpty()" class="error">
                   Please enter password.
                 </span>
              </div>
              <label>Login as</label>
                    <div class="clearBoth"></div>
                   <div>
                       <select [(ngModel)]="selectedRole"  class="form-control" name="roleList">
                              <option *ngFor="let role of roles" value="{{role}}">{{role}}</option>
                       </select>
                    </div>
              <div class="clearBoth"></div>
              <div>
                    <span><button type ="submit" class="uni-button" style=" margin:auto; display:block;  min-width:180px; margin-top:20px" >Login</button></span>
              </div>

              <div style = "position: absolute; margin-top:20px; ">
                 <a style="text-decoration:underline; cursor:pointer" (click)="forgetUsername()">Forgot username?</a>
                   <a style= "text-decoration:underline; margin-left: 100px;cursor:pointer" (click)="forgetPassword()">Forgot password?</a>
              </div>

            </form>
          </div>
         </div>

         <div *ngIf="!isLogin" class="login-page">
          <div  class= "reset-password-card">
            <div align='center'>
             <span class="welcomeHeaderFont login-welcome-header">{{heading}}</span>
             </div>
            <br>
             <form style="margin:20px 20px; font-size : 16px" [formGroup]="usernameForm" (ngSubmit)="usernameForm.valid && onSubmit()" #f="ngForm">
              <div class="form-group form-group-sm has-feedback">
                 <h5>{{ message}}</h5>
                 <div>
                <div  class="form-group form-group-sm">
                    <label for="name">Password</label>
                    <div>
                        <input type="password" class="form-control" [(ngModel)]="pwd" placeholder="Password" #password='ngForm' [formControl]="usernameForm.controls['password']" >
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
                    <label for="name">Verify Password</label>
                    <div>
                        <input type="password" class="form-control" placeholder="Verify Password" #verifyPassword='ngForm' [formControl]="usernameForm.controls['verifyPassword']">
                        <div class='error' *ngIf="verifyPassword.control.touched">
                            <div *ngIf="usernameForm.hasError('mismatchedPasswords')">Passwords do not match.</div>
                        </div>
                    </div>
                </div>

                  <div class="clearBoth"></div>
              <div>
                    <span><button type ="submit" class="uni-button" [disabled]='!usernameForm.valid' style=" margin:auto; display:block;  min-width:180px; margin-top:20px" >Next</button></span>
              </div>
              </div>

            </form>
          </div>
         </div>
     `,
    inputs: ['assetType', 'imageUrl', 'assetItem', 'formCtrl', 'intro'],
    outputs: ['inputModelChange'],
    // directives: [FORM_DIRECTIVES],
    styleUrls: ['public/css/login/login.css', 'public/css/mainArea/view.css'],
})
export class LoginComponent implements OnInit {
    intro: string = logInDescription;
    userId: string = '';
    password: string = '';
    validUser: boolean = true;
    validPassword: boolean = true;
    roles: Array<string> = ['Administrator', 'Designer', 'Operator'];
    dummyUsers: Array<string> = ['admin', 'tester'];
    selectedRole: string = "Administrator";
    inputModelChange: EventEmitter<Object> = new EventEmitter();
    formCtrl: any;
    tempDescriptionData: any[];
    newDescriptinEntry: string;
    user: User = null;
    isPwdInvalidate: boolean;
    userAccess: boolean = false;
    isLogin: boolean = false;
    message: string = newPasswordDescription;
    heading: string = newPasswordHeading;
    //  newPasswordForm: ControlGroup;
    usernameForm: FormGroup;
    pwd: string = '';
    token: string = '';
    pwdInvalid: boolean = false;
    userItem: UserItem = null;
    changeUser = false;
    changePassword = false;
    subscription: Subscription;

    // @ViewChild('modal')
    // modal: ModalComponent;
    constructor(private router: Router, private dataService: DataService, private fb: FormBuilder, private route: ActivatedRoute, private userSvc: UsersService, private assetsSvc: DataService) {
        if (this.token != null) {
            this.usernameForm = fb.group({
                password: ['', Validators.compose([Validators.required, passwordValidator, passwordCharSValidator, passwordCharCValidator, passwordSpecialValidator, passwordLengthValidator])],
                verifyPassword: ['', Validators.required],
            }, {
                    validator: matchingPasswords('password', 'verifyPassword')
                })
        }
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe(
            (params: any) => {
                this.token = params['token'];
                if (this.token == null || this.token == '') {
                    this.isLogin = true;
                }
            }
        );
    }

    selectRoleChanged(value: string) {
        this.selectedRole = value;
    }

    isUserIdValid() {
        return this.validUser;
    }

    updateUserId() {
        this.changeUser = true;
    }

    updatePassword() {
        this.changePassword = true;
    }

    isUserIdEmpty() {
        if (!this.changeUser) {
            return false;
        }
        if (this.userId == null || this.userId == '') {
            return true;
        }
        else {
            return false;
        }
    }

    isPasswordEmpty() {
        if (!this.changePassword) {
            return false;
        }
        if (this.password == null || this.password == '') {
            return true;
        }
        else {
            return false;
        }
    }

    isPasswordValid() {
        return this.validPassword;
    }

    onSubmit() {
        // this.modal.open();
        if (this.isLogin) {
            this.changeUser = true;
            this.changePassword = true;
            if (!this.isUserIdEmpty() && !this.isPasswordEmpty()) {
                this.assetsSvc.login(this.userId, this.password).subscribe(
                    data => this.onGetUserPreference(data),
                    error => this.onGetUserError(error)
                );
            }

        }
        else {
            this.dataService.resetPassword(this.pwd, this.token).subscribe(
                value => this.handleError(value),
                error => console.log("Failed" + error),
                () => console.log("Authentication completed")
            )
        }
    }

    handleError(jsonData: JSON) {
        const status = jsonData.hasOwnProperty("status") ? jsonData["status"] : '';
        const msg = JSON.stringify(jsonData);
        if (status !== "SUCCESS") {
            alert(jsonData["message"]);
        }
        else if (status == "SUCCESS") {
            alert(jsonData["message"]);
            this.router.navigate(['login']);
        }
    }
    forgetUsername() {
        this.router.navigate(['Forgetusername']);
    }

    forgetPassword() {
        this.router.navigate(['Forgetpassword']);
    }

    onGetUserPreference(jsonData: JSON) {
        this.validUser = true;
        const status = jsonData.hasOwnProperty("status") ? jsonData["status"] : '';
        if (status !== "SUCCESS") {
            this.onGetUserError(jsonData);
            return;
        } else {
            var user = jsonData["user"];
            if (user != null) {
                var image_url = user['imagePath'];
                if (user['useGravatar']) {
                    let email_value = user['email'];
                    if (email_value != null) {
                        let emailHash = Md5.hashStr(email_value.toLowerCase());
                        var default_img = DEFAULT_CIMAGE_URL + "default_profile.png";
                        var enc_img = encodeURI(default_img);
                        image_url = DEFAULT_GRAVATAR_URL + emailHash + "?s=100" + "?d=" + enc_img;
                    }
                }
                this.user = new User(this.userId, this.password, user["roleList"], image_url, this.selectedRole);
                this.user.uniuid = user['uniuid'];
                this.isPwdInvalidate = user['invalidatePassword'];
            }
            for (var i = 0; i < this.user.roles.length; i++) {
                if (this.selectedRole == this.user.roles[i]) {
                    this.userAccess = true;
                    break;
                }
            }

            var entities = jsonData["data"];
            if (entities != null) {
                for (var i = 0; i < entities.length; i++) {
                    let preference: Preference = Preference.parse(entities[i]);
                    this.user.preferenceList.push(preference);
                }
                this.user.displayPreference = new DisplayPreference(this.user);
            }
        }
        if (this.userAccess) {
            this.validPassword = true;
            this.userSvc.currentUser = this.user;
            if (this.isPwdInvalidate == false) {
                this.userSvc.resetPassword = false;
                if (this.assetsSvc.getToken() != null || this.assetsSvc.getToken() != undefined) {
                    sessionStorage.setItem('user_token', this.assetsSvc.getToken());
                    if (this.user != null || this.user != undefined) {
                        // sessionStorage.setItem('user',JSON.stringify(this.user));
                        sessionStorage.setItem('username', this.user.username);
                        sessionStorage.setItem('currentrole', this.user.currentRole);
                        sessionStorage.setItem('roles', JSON.stringify(this.user.roles));
                        sessionStorage.setItem('imagePath', this.user.imagePath);
                        sessionStorage.setItem('preferences', JSON.stringify(this.user.preferenceList));
                    }
                }
                this.router.navigate(['/' + this.selectedRole]);
            }
            else if (this.isPwdInvalidate == true) {
                this.userSvc.resetPassword = true;
                if (this.assetsSvc.getToken() != null || this.assetsSvc.getToken() != undefined) {
                    sessionStorage.setItem('user_token', this.assetsSvc.getToken());
                }
                this.router.navigate(['ResetPassword', { Role: this.selectedRole }]);
            }
        }
        else {
            alert(this.userId + " cannot login as " + this.selectedRole);
        }


    }

    onGetUserError(data: JSON) {
        console.log(JSON.stringify(data));
        this.validUser = false;
    }

    getSelectedRole() {
        return this.selectedRole;
    }

}
