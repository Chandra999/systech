import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { forgetUserNameDescription, forgetUserNameHeading } from "../common/messages";
import { Router } from '@angular/router';
import { UsersService } from '../services/User.service';
import { DataService } from '../services/Assets.service';
import { User } from "../common/user";
import { UserItem } from '../common/userItem';
import { emailValidator } from '../administrator/validators/addUser.validators';
import { FormBuilder, FormGroup } from '@angular/forms';


@Component({
    selector: 'unisecure-forget-username',
    template: `
         <div class="login-page">
          <div  class= "forget-username-card">
            <div align='center'>
             <span class="welcomeHeaderFont login-welcome-header">{{heading}}</span>
             </div>
            <br>
            <form style="margin:20px 20px; font-size : 16px" [formGroup]="usernameForm" (ngSubmit)="usernameForm.valid && onSubmit()" #f="ngForm">
              <div class="form-group form-group-sm has-feedback">
                 <h5>{{ message}}</h5>
                <label for="emailId">Email Address: </label>
                <div>
                    <input type="email" class="form-control" [(ngModel)]="emailId" placeholder="Enter Email address" id="email"  #email='ngForm'  [formControl]="usernameForm.controls['email']">
                    <div class='error' *ngIf="email.control.touched">
                            <div *ngIf="email.control.hasError('required')">Email is required.</div>
                            <div *ngIf="email.control.hasError('invalidEmail')">Email is invalid.</div>
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

    // directives: [FORM_DIRECTIVES],
    styleUrls: ['public/css/login/login.css'],
})
export class ForgetUsernameComponent implements OnInit {

    message: string = forgetUserNameDescription;
    heading: string = forgetUserNameHeading;
    allUsers: any = [];
    usernameForm: FormGroup;
    // email : any = {};
    emailId: string = '';
    constructor(private dataService: DataService, private router: Router, private fb: FormBuilder) {
        this.usernameForm = fb.group({
            email: ['', Validators.compose([Validators.required, emailValidator])]
        })
    }
    ngOnInit() {

    }

    onSubmit() {
        this.dataService.forgetUserName(this.emailId).subscribe(
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