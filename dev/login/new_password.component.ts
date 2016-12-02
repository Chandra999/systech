import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { newPasswordDescription, newPasswordHeading } from "../common/messages";
import { Router, ActivatedRoute } from '@angular/router';
import { UsersService } from '../services/User.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { matchingPasswords, passwordLengthValidator, passwordSpecialValidator, passwordCharSValidator, passwordCharCValidator, passwordValidator } from '../administrator/validators/addUser.validators';
import { DataService } from '../services/Assets.service';
import { UserItem } from '../common/userItem';
import { Subscription } from 'rxjs/Rx';

@Component({
    selector: 'unisecure-new-password',
    template: `
   <div class="login-page">
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
                        <input type="password" class="form-control" [(ngModel)]="pwd" placeholder="Password" #password='ngForm' [formControl]="usernameForm.controls['password']">
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

    styleUrls: ['public/css/mainArea/view.css', 'public/css/login/login.css'],
})
export class NewPasswordComponent implements OnInit {

    message: string = newPasswordDescription;
    heading: string = newPasswordHeading;
    //  newPasswordForm: ControlGroup;
    usernameForm: FormGroup;
    formCtrl: any;
    pwd: string = '';
    token: string = '';
    pwdInvalid: boolean = false;
    userItem: UserItem = null;
    subscription: Subscription;
    constructor(private route: ActivatedRoute, private dataService: DataService, private router: Router, private fb: FormBuilder, private userSvc: UsersService) {
        this.usernameForm = fb.group({
            password: ['', Validators.compose([Validators.required, passwordValidator, passwordCharSValidator, passwordCharCValidator, passwordSpecialValidator, passwordLengthValidator])],
            verifyPassword: ['', Validators.required],
        }, {
                validator: matchingPasswords('password', 'verifyPassword')
            })
    }
    ngOnInit() {
        this.subscription = this.route.params.subscribe(
            (params: any) => {
                if (params.hasOwnProperty('itemIndex')) {
                    this.token = 'token';
                }
            }
        );
    }

    onSubmit() {
        this.dataService.resetPassword(this.pwd, this.token).subscribe(
            value => this.handleError(value),
            error => console.log("Failed" + error),
            () => console.log("Authentication completed")
        )

    }

    handleError(jsonData: JSON) {
        const status = jsonData.hasOwnProperty("status") ? jsonData["status"] : '';
        const msg = JSON.stringify(jsonData);
        if (status !== "SUCCESS") {
            alert(jsonData["message"]);
            console.log(jsonData["message"]);
        }
        else if (status == "SUCCESS") {
            alert(jsonData["message"]);
            console.log(jsonData["message"]);
            this.router.navigate(['login']);
        }
    }


}
