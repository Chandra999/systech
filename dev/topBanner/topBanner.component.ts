import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UsersService } from '../services/User.service';
import { DEFAULT_UNITRACE_URL } from '../common/defaultHost';


@Component({
    selector: 'unisecure-top',
    templateUrl: 'public/html/topBanner/topBanner.html',
    styleUrls: ['public/css/topBanner/topBanner.css']
})

export class TopBannerComponent {
    uniTraceURL = DEFAULT_UNITRACE_URL;

    constructor(private router: Router, private route: ActivatedRoute, private userSvc: UsersService) {
    }

    homeClicked(value) {
        if (this.router.isActive("Administrator", false)) {
            this.router.navigate(["Administrator"]);
        }
        else if (this.router.isActive('Designer', false)) {
            this.router.navigate(["Designer"]);
        }
        else if (this.router.isActive('Operator', false)) {
            this.router.navigate(["Operator"]);
        }
        else if (this.router.isActive('PreferencesHome', false)) {
            this.router.navigate(["PreferencesHome"]);
        }
    }

    getLoginUser() {
        if (this.userSvc.getCurrentUserName() == null || this.userSvc.getCurrentUserName() == '') {
            return "User " + sessionStorage.getItem('username') + " Logged in as " + this.userSvc.getCurrentRole();
        } else {
            if (sessionStorage.getItem('username') != null)
                return "User " + this.userSvc.getCurrentUserName() + " Logged in as " + this.userSvc.getCurrentRole();
        }
    }

    getSwitchRoles() {
        var roles = [].concat(this.userSvc.getCurrentAvaiableRoles());
        if (this.router.isActive('PreferencesHome', false)) {
            return roles;
        }
        var index = roles.indexOf(this.userSvc.getCurrentRole());
        if (index > -1) {
            roles.splice(index, 1);
        }
        return roles;
    }


    currentRole() {
        if (this.userSvc.currentUser == null) {
            return '';
        } else {
            return this.userSvc.getCurrentRole();
        }
    }

    getImagePath() {
        if (this.userSvc.currentUser == null && !this.userSvc.isLoggedIn()) {
            return 'public/img/default_profile.png';
        } else if (this.userSvc.currentUser == null && this.userSvc.isLoggedIn()) {
            return sessionStorage.getItem('imagePath');
        }
        return this.userSvc.currentUser.imagePath;
    }

    isVisible() {
        return this.getSwitchRoles().length > 0;
    }

    roleSelected(role: string) {
        if (role === 'Administrator') {
            this.userSvc.setCurrentRole(role);
            this.router.navigate(["Administrator"]);
        } else if (role === 'Designer') {
            this.userSvc.setCurrentRole(role);
            this.router.navigate(["Designer"]);
        } else if (role === 'Operator') {
            this.userSvc.setCurrentRole(role);
            this.router.navigate(["Operator"]);
        }
    }

    getPreferences() {
        if (!this.router.isActive('PreferencesHome', false)) {
            this.router.navigate(["PreferencesHome"]);
        }
    }

    hide(value: string) {
        if (this.router.url == '/login' || this.router.url == "/" || this.router.url == "/ResetPassword" || this.router.url == "/Forgetpassword" || this.router.url == "/Forgetusername" || this.userSvc.resetPassword) {
            if (value == 'UniTrace') {
                return false;
            }
            return true;
        }
        return false
    }

    logout() {
        sessionStorage.clear();
        localStorage.clear();
        this.router.navigate(['../']);
    }
}
