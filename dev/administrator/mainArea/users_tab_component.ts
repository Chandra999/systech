import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';
import { PreferenceItem } from '../../common/preferenceItem';
import { DefaultConstants } from '../../common/default_values';
import { userPreferenceDescription, roles, filterUsersBy } from '../../common/messages';
import { DataService } from '../../services/Assets.service';
import { UserGroup } from '../../common/usergroup';
import { UserItem } from '../../common/userItem';
import { UserList } from '../../common/userList';
import { DEFAULT_ADMIN_RESOURCE, DEFAULT_URL, DEFAULT_IMAGE_URL, DEFAULT_IMAGES_URL, DEFAULT_GRAVATAR_URL, DEFAULT_CIMAGE_URL } from '../../common/defaultHost';
import 'rxjs/add/operator/map';
import { MessageService } from '../../services/message.service';
import { UsersService } from '../../services/User.service';
import { Message } from '../../message-center/message';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';

@Component({
    selector: 'unisecure-users-tab',
    template: `
    <div class="topnav uni-card2" style="position:fixed; top:68px; padding:0px; color :white; z-index:1">
        <div style="overflow:auto">
            <div style="overflow:hidden;height:44px;text-align:center;z-index:1">
                <a title="User/Groups Preferences">
                    <i style="text-align:center;display:block;"></i>{{display}} Preferences
                </a>
            </div>
        </div>
    </div>
    <ul style="margin-left:20px;" id="breadcrumb">
        <li><a (click)="homeSelected()">System Preferences</a> </li>
        <li><a>{{display}} Preferences</a> </li>
    </ul>
    <div style="display: flex;">
        <i style="margin-left:30px;color:#3b73b9;cursor:pointer;" class="{{ visible ? 'glyphicon glyphicon-triangle-top gly-flip-vertical' : 'glyphicon glyphicon-triangle-top' }}" (click)="headerCollapse()"> </i>
        <div [hidden]="visible" style="display:flex; margin-left:10px;align-items:center;">
            <img class="user_image" src={{image}} style="width:80px; height:80px; margin:0 25px 0 0; ">
            <span style="color:#3b73b9">{{defaultintro}} </span>
            <div style="clear:both"> </div>
        </div>
    </div>
    <message-center></message-center> 
    <div class="panel-group" oncontextmenu="return false" style=" margin:10px;">
        <div class="panel panel-default" style=" margin:10px;">
            <div class="panel-heading" style="background:#3b73b9;min-height:35px;">
                <a data-toggle="collapse" class="topItemIconLink" (click)="isExpandedUser = !isExpandedUser" href="#existingusers" style="color:white;float:left; text-decoration:none;">
                    <i [ngClass]="{'glyphicon' : true, 'glyphicon-triangle-right' : true,
                    'pull-left':true, 'triangle-glyphicon':true, 'rotate':true, 'down':!isExpandedUser }" style="margin: 2px 5px 0 0;"></i>
                    <h4 class="panel-title" style="color:#fff;margin-left:25px;">Existing Users</h4>
                </a>
                <help-video> </help-video>
            </div>
            <div id="existingusers" class="panel-collapse collapse in">
                <div class="panel panel-default" style="margin: 0px;">
                    <div class="panel-body" style="padding-bottom: 0px;">
                        <div class="row" style="clear:both; padding-left:50px;">
                            <a class="btn btn-md" role="button" id="newUser" (click)=clickAdd() style="margin:0 0 10px 0;">
                                <i class="glyphicon glyphicon-plus" style="color:#3b73b9"></i>Add User
                            </a>
                            <div style="float:right; margin-right:30px;">
                                <span [class.attach]="sortParam=='+userName'" (click)="sortParam='+userName'" title="Ascending" class="glyphicon glyphicon-sort-by-attributes" style="cursor:pointer; top:3px;"></span>
                                <span [class.attach]="sortParam=='-userName'" (click)="sortParam='-userName'" title="Descending" class="glyphicon glyphicon-sort-by-attributes-alt" style="cursor:pointer; transform:scaleY(-1); -moz-transform:scaleY(-1); -webkit-transform:scaleY(-1); -ms-transform:scaleY(-1);"></span>
                            </div>
                            <div class="inner-addon left-addon" style="display:inline-block; float:right; margin-right:10px;">
                                <i class="glyphicon glyphicon-filter" style="padding:5px; font-size:small;"></i>
                                <input class="form-control" type="text" id="filterTextBox" [(ngModel)]="filterText" style="width:100%; padding:2px 4px 2px 20px; height: auto;" placeholder="Filter">
                            </div>
                            <select class="form-control" [(ngModel)]="filterCriteria" style="float:right;; display:inline; height:auto; width:auto; padding:3px 5px; margin:0px 10px;">
                                <option *ngFor="let filterParam of filterUsersBy">{{filterParam}}</option>
                            </select>
                            <label style="float:right; margin-top: 3px;">Filter By</label>
                            <br>
                            <div [hidden]="!loading" style="min-height:80px; max-height:180px; overflow-y:scroll;">
                                <a style="font-size:x-large;">
                                    <span class="glyphicon glyphicon-refresh glyphicon-refresh-animate" style="color:#8dc63f;"></span>
                                    Loading...
                                </a>
                            </div>                         
                            <div [hidden]="loading" style="min-height:100px; max-height:220px; overflow-y:scroll;">
                                <div class="showDeleteUser" *ngFor="let user of allUsers | filterBy:filterText:filterCriteria | orderBy : [sortParam] | slice: (currentPage - 1) * itemsPerPage : itemsPerPage*currentPage" dnd-draggable [dragEnabled]="true" [dragData]="user" style="float:left; cursor:pointer;">
                                    <span class="glyphicon glyphicon-remove hideDeleteUser" (click)="deleteUser(user)" title="Delete User" style="margin-bottom:-10px;float:right; color:#3B73B9; cursor:pointer;"></span>
                                    <div style="margin:15px 0 0 10px;">
                                        <img [src]="user.imageURL" class="img-circle" (click)="onEdit(user.userName)" style="width :64px; height :64px; float:left; margin: 0px;">                                    <br> <br> <br>
                                        <h5 style="text-align:center; margin:0px; width:70px; overflow:hidden; text-overflow:ellipsis;" title="{{user.userName}}">{{user.userName}}</h5>
                                    </div>
                                </div>
                            </div>
                            <div class="row" style="margin:0px;">
                               <ngb-pagination [collectionSize]=collectionSize [(page)]=currentPage [maxSize]=pagesAtOnce [rotate]="true" [boundaryLinks]="true" [pageSize]=itemsPerPage style="float:left; margin-left:12px;" ></ngb-pagination>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="panel panel-default" style=" margin:10px;">
            <div class="panel-heading" style="background:#3b73b9">
                <a data-toggle="collapse" class="topItemIconLink" href="#existinggroups" (click)="isExpandedUserGroup = !isExpandedUserGroup" style="color:white; text-decoration:none;">
                    <i [ngClass]="{'glyphicon' : true, 'glyphicon-triangle-right' : true,
                    'pull-left':true, 'triangle-glyphicon':true, 'rotate':true, 'down':!isExpandedUserGroup }" style="margin: 2px 5px 0 0;"></i>
                    <h4 class="panel-title" style="color:#fff">Existing Groups</h4>
                </a>
            </div>
            <div id="existinggroups" class="panel-collapse collapse in">
                <div class="panel-body">
                    <div class="row" style="clear:both; padding-left:50px; padding-bottom:15px">
                        <div style= "width: 95%;">
                            <a class="btn btn-md" role="button" id="newGroup" (click)=clickAddGroup()>
                                 <i class="glyphicon glyphicon-plus" style="color:#3b73b9"></i>Add New Group
                            </a>
                            <div *ngFor="let role of roles" dnd-draggable [dragEnabled]="true" [dragData]="role.id" style="float:right; cursor:pointer;">
                                <div style="margin:6px 0px 0px 10px; color:#3b73b9;" title="{{role.roleType}}">
                                    <img [src]="role.icon" class="img-circle" style="width:25px; margin-right:-8px;">
                                    {{role.roleType.charAt(0)}}
                                </div>
                            </div>
                            <a class="btn btn-md" (click)="onExapandAll()" role="button" style="float: right;">
                                <i class="glyphicon glyphicon-triangle-top gly-flip-vertical" style="color:#3b73b9"></i> Expand All
                            </a>
                            <a class="btn btn-md" (click)="onCollapseAll()" role="button" style="float: right;">
                                <i class="glyphicon glyphicon-triangle-top" style="color:#3b73b9"></i> Collapse All
                            </a>
                        </div>

                        <table class = 'uni-table' [hidden]="!loading" id="existing-groups">
                        <tr>
                            <th width=15.05%  class ='uni-th'>Name</th>
                            <th width=40%  class ='uni-th'>Description</th>
                            <th width=40%  class ='uni-th'>Roles</th>
                            <th width=4.95%  class ='uni-th'></th>
                        </tr>
                        <tr>
                            <td class ='uni-td' style="text-align:center" COLSPAN="4">
                                 <a style="font-size:x-large;">
                                       <span class="glyphicon glyphicon-refresh glyphicon-refresh-animate" style="color:#8dc63f;"></span>
                                         Loading...
                                    </a> 
                             </td>
                        <tr>
                        </table>
                        <table class = 'uni-table' [hidden]="loading" id="existing-groups">
                            <tr>
                                <th width=15.05% class ='uni-th'>Name</th>
                                <th width=40% class ='uni-th'>Description</th>
                                <th width=40% class ='uni-th'>Roles</th>
                                <th width=4.95% class ='uni-th'></th>
                            </tr>
                            <tr *ngFor="let usergroup of existingGroups; let i=index">
                               <td COLSPAN=4 width=100% style="margin:0px;padding:0px; padding:0 0 0 0px !important;" *ngIf="usergroup.editFlag==false">
                                    <div style= "display: table; width:100%; height:30px">
                                        <div style="display:table-cell; width:15%; border-right: 1px solid white; padding:5px;  text-overflow: ellipsis;">
                                            <a (click)="usergroup.openFlag=!usergroup.openFlag; retrieveUsers(usergroup.groupid, i); currentUserGroup=usergroup.groupid;">
                                                <i [ngClass]="{'glyphicon' : true, 'glyphicon-triangle-right' : true, 'pull-left':true, 'triangle-glyphicon':true, 'rotate':true, 'down':usergroup.openFlag }"
                                                    style="margin: 2px 5px 0 0; color:#343332; cursor:pointer;">
                                                </i>
                                                <label style="color:#343332; text-overflow: ellipsis; cursor:pointer;">{{usergroup.name}}</label>
                                            </a>
                                        </div>
                                        <div style="display:table-cell; width:40%; border-right: 1px solid white;padding:5px">{{usergroup.description}}</div>
                                        <div style="display:table-cell; width:40%; border-right: 1px solid white;padding:5px">
                                            <div dnd-droppable (onDropSuccess)="tempGroupName=usergroup.name; tempGroupDescription=usergroup.description; tempGroupRoles=usergroup.roles; onChangeRoles($event, usergroup); usergroup.editFlag=true;" style="min-height:20px;">
                                                <label *ngFor="let role of usergroup.roles" style="margin-right:5px;">
                                                  <img src="{{imageShow(role)}} " class="img-circle" style="width:25px; margin-right:-8px;">
                                                    {{mapRoles(role)}}
                                                </label>
                                            </div>
                                        </div>
                                        <div style="display:table-cell; width:5%;padding:5px" >
                                            <span (click)="usergroup.editFlag=true; enableRoles=true; tempGroupName=usergroup.name; tempGroupDescription=usergroup.description; tempGroupRoles=usergroup.roles;" class="glyphicon glyphicon-edit" title="Edit" style="margin:5px 0 5px 5px; color:#4ec600 ; cursor:pointer;" *ngIf="usergroup.openFlag==false"></span>
                                            <span (click)="ondeleteUserGroup(usergroup, i)" title="Delete" class="glyphicon glyphicon-remove-circle" style="margin:5px 0 5px 5px; color:#343332; cursor:pointer;" *ngIf="usergroup.openFlag==false"></span>
                                            <span (click)="updateUserGroup(usergroup);" class="glyphicon glyphicon-saved" title="Update Group" style="margin:5px 0 5px 5px; color:#4ec600; cursor:pointer;" *ngIf="usergroup.openFlag==true"></span>
                                            <a (click)="usergroup.openFlag=false;" *ngIf="usergroup.openFlag==true">
                                                <span title="Cancel" class="glyphicon glyphicon-remove" style="margin:5px 0 5px 5px; color:#343332; cursor:pointer;"></span>
                                            </a>
                                        </div>
                                    </div>
                                    <div *ngIf="usergroup.openFlag==true" style="width:100%; padding:0px; margin:0px">
                                        <div>
                                            <div dnd-droppable (onDropSuccess)="transferDataSuccess($event, i)"  style="min-height:100px;">
                                                <div style="min-height:100px; max-height:220px; overflow-y:scroll; border:1px solid white">
                                                    <div class="showDeleteUser" *ngFor="let user of usergroup.groupUsers" style="float:left; cursor:pointer; padding-top:5px;">
                                                        <span class="glyphicon glyphicon-remove hideDeleteUser" (click)="removeUser(user, i)" title="Remove User" style="margin-bottom:-10px;float:right; color:#3B73B9; cursor:pointer;"></span>
                                                        <div style="margin:10px 0 0 10px; width:75px;">
                                                            <img [src]="user.imageURL" class="img-circle" (click)="onEdit(user.userName)" style="width:64px; height:64px; float:left; margin:0px;"><br> <br> <br>
                                                            <h5 style="text-align:center; margin:0px; width:70px; overflow:hidden; text-overflow:ellipsis;" title="{{user.userName}}">{{user.userName}}</h5>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td class ='uni-td' *ngIf="usergroup.editFlag==true"><input class="form-control" type="text" [(ngModel)]="usergroup.name" placeholder="Group Name" /></td>
                                <td class ='uni-td' *ngIf="usergroup.editFlag==true"><input class="form-control" type="text" [(ngModel)]="usergroup.description" placeholder="Description" /></td>
                                <td class ='uni-td' *ngIf="usergroup.editFlag==true">
                                    <div class="form-control" dnd-droppable (onDropSuccess)="onChangeRoles($event, usergroup);" style="min-height:20px;">
                                        <label *ngFor="let role of usergroup.roles" style="margin-right:5px;">
                                         <img src="{{imageShow(role)}} " class="img-circle" style="width:25px; margin-right:-8px;">
                                            {{mapRoles(role)}}
                                            <span class="glyphicon glyphicon-remove" (click)="removeRole(role, usergroup.roles)" style="top:-10px; font-size:xx-small; cursor:pointer; left:-3px;"></span>
                                        </label>
                                    </div>
                                </td>
                                <td class ='uni-td' *ngIf="usergroup.editFlag==true">
                                    <span (click)="updateUserGroup(usergroup); usergroup.editFlag=false; enableRoles=false;" class="glyphicon glyphicon-saved" title="Update UserGroup" style="margin:5px 0 5px 5px; color:#4ec600 ; cursor:pointer;"></span>
                                    <span (click)="usergroup.editFlag=false; enableRoles=false; usergroup.name=tempGroupName; usergroup.description=tempGroupDescription; usergroup.roles=tempGroupRoles" title="Cancel" class="glyphicon glyphicon-remove" style="margin:5px 0 5px 5px; color:#343332; cursor:pointer;"></span>
                                </td>
                            </tr>
                            <tr [hidden]=showNewGroupAddRow>
                                <td class="uni-td"><input class="form-control" type="text" [(ngModel)]="uGrpName" placeholder="Group Name" required pattern="[a-zA-Z0-9_ ]*" /></td>
                                <td class="uni-td"><input class="form-control" type="text" [(ngModel)]="uGrpDescription" placeholder="Description" required /></td>
                                <td class="uni-td">
                                    <div class="form-control" dnd-droppable (onDropSuccess)="onAddRoles($event)" style="min-height:20px;">
                                        <label *ngFor="let role of newRoles" style="margin-right:5px;">
                                         <img src="{{imageShow(role)}} " class="img-circle" style="width:25px; margin-right:-8px;">
                                            {{mapRoles(role)}}
                                            <span class="glyphicon glyphicon-remove" (click)="removeRole(role, newRoles)" style="top:-10px; font-size:xx-small; cursor:pointer; left:-3px;"></span>
                                        </label>
                                    </div>
                                </td>
                                <td class="uni-td">
                                    <span (click)="createGroup(uGrpName, uGrpDescription); uGrpName=null; uGrpDescription=null;" class="glyphicon glyphicon-saved" title="Create Group" style="margin:5px 0 5px 5px; color:#4ec600; cursor:pointer;"></span>
                                    <span (click)="showNewGroupAddRow=true; newRoles=null; uGrpName=null; uGrpDescription=null;" title="Cancel" class="glyphicon glyphicon-remove" style="margin:5px 0 5px 5px; color:#343332; cursor:pointer;"></span>
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
        </div>
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
                 <button type="button"  class='uni-button' (click)="cancelClicked()" style="float: right">{{cancelButtonLabel}}</button>		
                 <button type="button"  class='uni-button' (click)="okClicked()" style="float: right;margin-right:5px">{{okButtonLabel}}</button>		
            </modal-footer>		
        </modal>
    `,
    styleUrls: ['public/css/mainArea/breadcrumb.css', 'public/css/common/table.css', 'public/css/navigator/sence_assets.css', 'public/css/common/modal.css', 'public/css/common/searchNfilter.css']
})

export class UsersComponent implements OnInit {

    test = true;

    isExpandedUGroup = false;
    groupNumber: number;
    tempJsonUsers: any[];
    display: string = PreferenceItem.getDisplayName('User');
    image: string = DefaultConstants.DEFAULT_IMAGE_FOLDER_PATH + PreferenceItem.getDefaultImageUrl('User');
    defaultintro = userPreferenceDescription;
    existingGroups: any = [];
    allUsers: any = [];
    userList: any = [];
    newRoles: any = [];
    roles = roles;
    customPlugs: string[] = ['a'];
    selected: String = '';
    currentUserGroup: number;
    showNewGroupAddRow: boolean = true;
    visible: boolean = false;
    loading: boolean;
    sortParam: string = '+userName';
    filterUsersBy = filterUsersBy;
    filterCriteria = filterUsersBy[0];
    task: string;
    //----------------------------------------------------Pagination-------------------------------------
    collectionSize: number;
    currentPage: number = 1;
    itemsPerPage: number = 20;
    totalPages: number;
    //----------------------------------------------------Pagination-------------------------------------
    //-------------------------------Alert Modal -------------------------------------------		
    @ViewChild('confirmModal')
    confirmModal: ModalComponent;
    confirmTitle: string = '';
    message: string = '';
    showCancel: boolean = false;
    okButtonLabel: string = 'Delete';
    cancelButtonLabel: string = 'No';
    tempUserGroup: any;
    tempIndex: number;
    tempDelete: string;
    tempUser: any;
    //-------------------------------Alert Modal -------------------------------------------		

    constructor(public http: Http, private route: ActivatedRoute, private router: Router, private adminSvc: DataService, private ms: MessageService, private userSvc: UsersService) {
        // empty
        this.currentPage = 1;
    }

    ngOnInit() {
        this.loading = true;
        this.adminSvc.getUsers().subscribe(
            data => this.onGetUsers(data),
            error => this.onShowMessage(error)
        );
        this.loadUserGroups();
        this.onItemsParPageChange();
    }

    onItemsParPageChange() {
        this.collectionSize = this.allUsers.length;
        this.currentPage = 1;
    }

    loadUserGroups() {
        this.adminSvc.getUsergroups().subscribe(
            data => this.onGetUserGroups(data),
            error => this.onShowMessage(error)
        );
    }

    onExapandAll() {
        for (var i = 0; i < this.existingGroups.length; i++) {
            this.existingGroups[i].openFlag = true;
            this.retrieveUsers(this.existingGroups[i].groupid, i);
        }
    }

    onCollapseAll() {
        for (var i = 0; i < this.existingGroups.length; i++) {
            this.existingGroups[i].openFlag = false;
        }
    }

    onAddRoles($event) {
        if (!$event.dragData.userName) {
            this.newRoles.push($event.dragData);
        }
    }

    onChangeRoles($event, usergroup) {
        if (!$event.dragData.userName) {
            if (usergroup.roles != null && usergroup.roles != undefined && usergroup.roles != '') {
                var check: boolean = false;
                for (var i = 0; i < usergroup.roles.length; i++) {
                    if ($event.dragData == usergroup.roles[i]) {
                        check = true;
                    }
                }
                if (check) {
                    alert("Role already exists in this Group.");
                }
                else {
                    usergroup.roles.push($event.dragData);
                }
            }
            else {
                usergroup.roles = [];
                usergroup.roles.push($event.dragData);
            }
        }
    }

    removeRole(role, roles) {
        var index = roles.indexOf(role, 0);
        if (index != undefined && index != null && roles.length > 1) {
            roles.splice(index, 1);
        }
        else if (index == 0) {
            alert("Can not delete this role. Atleast one role is required.");
        }
    }

    createGroup(name, description) {
        this.task = "createGroup";
        if (description == null) {
            // this.ms.displayRawMessage(new Message('error', 'Description cannot be null or empty.', 'This group will not be saved.', 'There should be some description for a group.', ''), this.customPlugs)
            //     .subscribe((value) => console.log(value));
            this.adminSvc.handleError(null, new Message('error', 'Description cannot be null or empty.', 'This group will not be saved.', 'There should be some description for a group.', ''), false, false, this.customPlugs);
        }
        else if (this.newRoles.length == 0) {
            // this.ms.displayRawMessage(new Message('error', 'Roles cannot be null or empty.', 'This group will not be saved.', 'Atleast one role is required.', ''), this.customPlugs)
            //     .subscribe((value) => console.log(value));
            this.adminSvc.handleError(null, new Message('error', 'Roles cannot be null or empty.', 'This group will not be saved.', 'Atleast one role is required.', ''), false, false, this.customPlugs);
        }
        else {
            var body = { "name": name, "description": description, "active": true, "roleIdList": this.newRoles };
            this.adminSvc.putUserGroup(body).subscribe(
                data => this.onShowMessage(data),
                error => this.onShowMessage(error),
                () => { this.loadUserGroups(); }
            );
            this.showNewGroupAddRow = true;
            this.newRoles = [];
        }
    }

    ondeleteUserGroup(usergroup, index) {
        this.tempIndex = index;
        this.tempUserGroup = usergroup;
        this.tempDelete = "usergroup";
        this.openModal("Are you sure you want to delete " + usergroup.name + " ?", "", true);
    }

    openModal(title: string, message: string, showCancel: boolean) {
        this.confirmTitle = title;
        this.message = message == null ? '' : message;
        this.showCancel = showCancel;
        this.okButtonLabel = this.showCancel ? "Delete" : "No";
        this.confirmModal.open();
    }

    okClicked() {
        this.confirmModal.close();
        if (this.tempDelete == 'usergroup') {
            if (this.showCancel) {
                if (this.okButtonLabel == "Delete") {
                    this.adminSvc.deleteUserGroup(this.tempUserGroup.groupid).subscribe(
                        data => this.onShowMessage(data),
                        error => this.onShowMessage(error)
                    );
                    this.existingGroups.splice(this.tempIndex, 1);
                }
            }
            this.tempUserGroup = null;
        }
        else if (this.tempDelete == 'user') {
            if (this.showCancel) {
                if (this.okButtonLabel == "Delete") {
                    this.adminSvc.deleteuser(this.tempUser.userName).subscribe(
                        data => this.onShowMessage(data),
                        error => this.onShowMessage(error)
                    );
                    this.allUsers.splice(this.tempIndex, 1);
                }
            }
            this.tempUser = null;
        }
        this.tempIndex = null;
    }

    cancelClicked() {
        this.confirmModal.close();
    }

    deleteUser(user) {
        this.tempDelete = 'user';
        this.tempUser = user;
        var index = this.allUsers.indexOf(user, 0);
        console.log(index);
        if (user.userName != this.userSvc.getCurrentUserName()) {
            if (index != undefined && index != null && this.allUsers.length > 1) {
                this.tempIndex = index;
                this.openModal("Are you sure you want to delete " + user.userName + " ?", "", true);

            }
            else {
                this.ms.displayRawMessage(new Message(status, "Can not delete this role. Atleast one user is required.", '', '', ''), this.customPlugs)
                    .subscribe((value) => console.log(value));
            }
        }

        else {
            this.ms.displayRawMessage(new Message(status, "You are logged in. Cannot delete same user.", '', '', ''), this.customPlugs)
                .subscribe((value) => console.log(value));

        }
    }

    retrieveUsers(groupid: number, index: number) {
        this.adminSvc.getUserGroupUsers(groupid).subscribe(
            data => this.onGetUserGroupUsers(data, index),
            error => this.onShowMessage(error)
        );
    }

    updateUserGroup(group) {
        this.task = "updateGroup";
        var users = [];
        for (var i = 0; i < group.groupUsers.length; i++) {
            users.push({ "userName": group.groupUsers[i].userName });
        }
        var body = { "id": group.groupid, "name": group.name, "roleIdList": group.roles, "description": group.description, "userList": users };
        this.adminSvc.updateUserGroups(body).subscribe(
            data => this.onShowMessage(data),
            error => this.onShowMessage(error)
        );
    }

    transferDataSuccess($event, index) {
        if ($event.dragData.userName) {
            var check: boolean = false;
            for (var i = 0; i < this.existingGroups[index].groupUsers.length; i++) {
                if ($event.dragData.userName == this.existingGroups[index].groupUsers[i].userName) {
                    check = true;
                    break;
                }
            }
            if (check == false) {
                this.existingGroups[index].groupUsers.push({ id: $event.dragData.uid, userName: $event.dragData.userName, imageURL: $event.dragData.imageURL });
            } else {
                //alert("User already exists in this Group.");
                 this.adminSvc.handleError(null, new Message('error', 'User already exists in this Group.', '', '', ''), false, false, null);
            }
        }
    }

    removeUser(user, id) {
        var index = this.existingGroups[id].groupUsers.indexOf(user, 0);
        if (index != undefined && index != null) {
            this.existingGroups[id].groupUsers.splice(index, 1);
        }
    }

    onGetUserGroupUsers(jsonData: JSON, id: number) {
        const status = jsonData.hasOwnProperty("status") ? jsonData["status"] : '';
        if (status !== "SUCCESS") {
            this.onShowMessage(jsonData);
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
            this.existingGroups[id].groupUsers = [];
            if (entityList != null && entityList.userList != null && entityList.userList.length > 0) {
                for (var index = 0; index < entityList.userList.length; index++) {
                    let entry: UserList = UserList.parse(entityList.userList[index]);
                    if (entry != null) {
                        this.getImagePath(entry);
                        this.existingGroups[id].groupUsers.push(entry);
                    }
                }
            }
        }
    }

    getImagePath(entry: UserList) {
        if (entry != null && this.allUsers != null) {
            for (var i = 0; i < this.allUsers.length; i++) {
                var user = this.allUsers[i];
                if (user.userName == entry.userName) {
                    entry.imageURL = user.imageURL;
                    return;
                }
            }
        }
    }

    onGetUsers(jsonData: JSON) {
        const status = jsonData.hasOwnProperty("status") ? jsonData["status"] : '';
        if (status !== "SUCCESS") {
            this.onShowMessage(jsonData);
        } else {
            var users = jsonData["data"];
            if (users != null && users.length > 0) {
                for (var index = 0; index < users.length; index++) {
                    let entry: UserItem = UserItem.parse(users[index]);
                    if (!entry.useGravatar) {
                        var date = new Date().getTime();
                        if (entry.imageURL != null) {
                            entry.imageURL = entry.imageURL + "?" + date;
                        }
                        else {
                            entry.imageURL = DefaultConstants.DEFAULT_IMAGE_FOLDER_PATH + "default_profile.png";
                        }

                    }
                    if (entry != null) {
                        this.allUsers.push(entry);
                    }
                }
                this.onItemsParPageChange();
            }
            this.loading = false;
        }
    }

    onGetUserGroups(jsonData: JSON) {
        const status = jsonData.hasOwnProperty("status") ? jsonData["status"] : '';
        if (status !== "SUCCESS") {
            this.onShowMessage(jsonData);
        } else {
            this.existingGroups = [];
            var usergroups = jsonData["data"];
            if (usergroups != null && usergroups.length > 0) {
                for (var index = 0; index < usergroups.length; index++) {
                    let entry: UserGroup = UserGroup.parse(usergroups[index]);
                    entry["editFlag"] = false; // Created an edit flag for user groups. If true we can edit the Name, Role, Designation of the User Group.
                    entry["openFlag"] = false; // Created an open flag for user groups. If true, will display users of the user groups.
                    entry["groupUsers"] = []  // Declaring the array of users.
                    if (entry != null) {
                        this.existingGroups.push(entry);

                    }
                }
                console.log(this.existingGroups);
            }
            this.loading = false;
        }
    }

    onShowMessage(jsonData: JSON) {
        const status = jsonData.hasOwnProperty("status") ? jsonData["status"] : '';
        const message = jsonData.hasOwnProperty("message") ? jsonData["message"] : '';

        if (status == 'SUCCESS') {
            if (message != null) {
                this.ms.displayRawMessage(new Message(status, message, '', '', ''), this.customPlugs)
                    .subscribe((value) => console.log(value));
            }
            else {
                if (this.task == 'createGroup') {
                    this.ms.displayRawMessage(new Message(status, 'Group Created Successfully.', '', '', ''), this.customPlugs)
                        .subscribe((value) => console.log(value));
                }
                if (this.task == 'updateGroup') {
                    this.ms.displayRawMessage(new Message(status, 'Group Updated Successfully.', '', '', ''), this.customPlugs)
                        .subscribe((value) => console.log(value));
                }

            }
        }
        else if (status == 'ERROR') {
            // if (message != null) {
            //     let jsonMsgs = JSON.parse(message);
            //     if (jsonMsgs.msgs != null && jsonMsgs.msgs.length > 0) {
            //         let msg = jsonMsgs.msgs[0];
            //         let msgId = "" + msg.id;
            //         while (msgId.length < 6) {
            //             msgId = "0" + msgId;
            //         }
            //         let prefix = jsonMsgs.prefix + msgId + jsonMsgs.langId.charAt(0).toUpperCase();
            //         this.ms.displayRawMessage(new Message(status, msg.message, msg.action, msg.suggestion, prefix), this.customPlugs)
            //             .subscribe((value) => console.log(value));
            //     }
            // }

            this.adminSvc.handleError(jsonData, null, true, false, this.customPlugs);
        }
    }

    homeSelected() {
        this.router.navigate(['Administrator']);
    }

    onEdit(name: string) {
        this.router.navigate(["Administrator/edituser", name]);
    }

    clickAdd() {
        this.router.navigate(['Administrator/adduser']);
    }

    clickAddGroup() {
        this.showNewGroupAddRow = false;
    }

    headerCollapse() {
        this.visible = !this.visible;
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
}