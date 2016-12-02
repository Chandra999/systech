import { Injectable } from "@angular/core";
import { User } from "../common/user";

@Injectable()
export class UsersService {
    currentUser: User = null;
    resetPassword: boolean = false;

    setCurrentUser(user: User) {
        this.currentUser = user;
    }

    getCurrentUserName() {
        if (this.currentUser == null && !this.isLoggedIn()) {
            return '';
        }
        else if (this.currentUser == null && this.isLoggedIn()) {
            return sessionStorage.getItem('username');
        }
        return this.currentUser.username;
    }

    getCurrentRole() {
        if (this.currentUser == null && !this.isLoggedIn()) {
            return '';
        }
        else if (this.currentUser == null && this.isLoggedIn()) {
            return sessionStorage.getItem('currentrole');
        }
        return this.currentUser.currentRole;
    }

    setCurrentRole(currentRole: string) {
        if (this.currentUser != null) {
            this.currentUser.currentRole = currentRole;
        }
        else {
            sessionStorage.setItem('currentrole', currentRole);
        }
    }

    getCurrentAvaiableRoles() {
        if (this.currentUser == null && !this.isLoggedIn()) {
            return [];
        }
        else if (this.currentUser == null && this.isLoggedIn()) {
            let roles = JSON.parse(sessionStorage.getItem('roles'));
            return roles;
        }
        return this.currentUser.roles;
    }

    ResetPassword() {
        this.resetPassword = !this.resetPassword;
    }

    isLoggedIn() {
        if (sessionStorage.getItem('user_token') != null || sessionStorage.getItem('user_token') != undefined || sessionStorage.getItem('user_token') != '' || !this.resetPassword) {
            return true;
        } else {
            return false;
        }
    }

}
