import { Component, OnInit, ViewChild } from '@angular/core';
import { Http } from '@angular/http';//Needed for http request
import { AssetItem } from '../../common/assetItem';
import { AssetType } from '../../common/assetType';
import { Operator_AssetsServices_Mock } from '../../services/Operator_Assets_Mock.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UI_Tabs } from '../../common/ui_tabs.component';
import { Tab } from '../../common/tab.component';
import { EnumUtil } from '../../common/EnumUtil';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import 'rxjs/add/operator/map';//Needed for map in http request
import { HighlightPipe } from '../../common_ui/highlight_pipe';
import { NameDescriptionComponent } from '../../common_ui/name_description_component';

@Component({
    selector: 'view-edit-tab',
    template: `
        <ul  id='breadcrumb' >
            <li><a (click)='assetTypeSelected()'>{{altertType}}</a> </li>
            <li><a>{{alertItem.name}}</a> </li>
        </ul>
        <form class="assetForm uni-card-2" id="editOperator" (ngSubmit)='onSubmit(f.value)' #f='ngForm'>
           
           <uni-name-description [assetType]=altertType [assetItem]=alertItem [formCtrl]="f"></uni-name-description>
           <div style="clear:both"></div>
           <div class="form-group form-group-sm">
               <label for="family">Family</label>
               <div  style="width:66%" class ="has-feedback">
               <select [(ngModel)]="product" (ngModelChange)="onChange($event)" class="form-control">
                    <option selected disabled>-- Select Product --</option>
               </select>
               </div>
           </div>
           
           <div class="panel-group" style="margin-top: 5%;">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        <a data-toggle="collapse" class="topItemIconLink"  href="#todo" style="color: white;">
                            <i (click)="isExpandedToDo = !isExpandedToDo" [ngClass]="{'glyphicon' : true, 'glyphicon-triangle-right' : true,
                            'pull-left':true, 'triangle-glyphicon':true, 'rotate':true, 'down':isExpandedToDo }" style="margin: 2px 5px 0 0;"></i>
                        </a>
                        <h4 class="panel-title">To Do</h4>
                    </div>
      
                    <div id="todo" class="panel-collapse collapse">
                        <div class="panel-body">
                            <p id="para_view_edit">This section of the view allows the operator to look at the future activities that UniSecure will run at a predetermined date/time.</p>
                            <table>
                                <tr>
                                    <th>Status</th>
                                    <th>Action</th>
                                    <th>Date/Time</th>
                                    <th>Description</th>
                                </tr>
                                <tr *ngFor="let data of tempToDoData">
                                    <td>{{data.status}}</td>
                                    <td>{{data.action}}</td>
                                    <td>{{data.date_time}}</td>
                                    <td>{{data.description}}</td>
                                </tr>
                            </table>    
                        </div>
                    </div>
                </div>
                <div class="panel panel-default">
                    <div class="panel-heading">
                        <a data-toggle="collapse" class="topItemIconLink" href="#logs" style="color: white;">
                            <i (click)="isExpandedLogs= !isExpandedLogs" [ngClass]="{'glyphicon' : true, 'glyphicon-triangle-right' : true,
                            'pull-left':true, 'triangle-glyphicon':true, 'rotate':true, 'down':isExpandedLogs }" style="margin: 2px 5px 0 0;"></i>
                        </a>
                        <h4 class="panel-title">Logs</h4>
                    </div>
                    <div id="logs" class="panel-collapse collapse">
                        <div class="panel-body">
                            <p id="para_view_edit">This section of the view allows the operator to look at anything that was automatically performed by UniSecure.
                            The operator can purge results from this section.</p>
                            <table>
                                <tr>
                                    <th>ID</th>
                                    <th>Status</th>
                                    <th>Start Time</th>
                                    <th>End Time</th>
                                    <th>Description</th>
                                </tr>
                                <tr *ngFor="let data of tempLogsData">
                                    <td>{{data.id}}</td>
                                    <td>{{data.status}}</td>
                                    <td>{{data.starTime}}</td>
                                    <td>{{data.endTime}}</td>
                                    <td>{{data.description}}</td>
                                </tr>
                            </table>  
                        </div>
                    </div>
                </div>
                
                <div class="panel panel-default">
                    <div class="panel-heading">
                         <a data-toggle="collapse" class="topItemIconLink" href="#reports" style="color: white;">
                            <i (click)="isExpandedReports=!isExpandedReports" [ngClass]="{'glyphicon' : true, 'glyphicon-triangle-right' : true,
                            'pull-left':true, 'triangle-glyphicon':true, 'rotate':true, 'down':isExpandedReports }" style="margin: 2px 5px 0 0;"></i>
                        </a>
                        <h4 class="panel-title">Reports</h4>
                    </div>
                    <div id="reports" class="panel-collapse collapse">
                        <div class="panel-body">
                            <p id="para_view_edit">This section of the view allows the operator to gain insight into varies aspects of the UniSecure environment.</p>
                        </div>
                    </div>
                </div>
           </div>
       </form>
    `,
    styleUrls: ['public/css/mainArea/breadcrumb.css', 'public/css/mainArea/view.css', 'public/css/navigator/sence_assets.css'],
    // pipes: [HighlightPipe]
})

export class ViewEditTabComponent implements OnInit {
    product: string = '-- Select Product --';
    tempToDoData: any[];
    tempLogsData: any[];
    isExpandedToDo = false;
    isExpandedLogs = false;
    isExpandedReports = false;
    tempDescriptionData: any[];

    altertType: AssetType = AssetType.View;//Needed
    alertItem: AssetItem = null;//Needed
    // assetItems = [];
    defaultImageUrl: string = 'public/img/organization_bright_green2.png';
    index: number;
    private editMode = 'edit';
    //  private editMode = 'editOperator';
    constructor(public http: Http, private route: ActivatedRoute, private assetsSvc: Operator_AssetsServices_Mock, private router: Router) {
    }

    ngOnInit() {
        // this.editMode = this.routeParams.get('editMode');
        // this.index = +this.routeParams.get('itemIndex');
        this.alertItem = this.assetsSvc.getItem(this.altertType, this.index);
        if (this.alertItem.imageUrl === '') {
            this.alertItem.imageUrl = this.defaultImageUrl;
        }
        this.http.get("public/json/operatorPage.json")
            .map(res => res.json())
            .subscribe(
            data => { this.tempToDoData = data.ToDo, this.tempLogsData = data.Logs },
            err => console.log('Error while trying to Read Json File' + err)
            );
        this.http.get("public/json/operatorPage.json")
            .map(res => res.json())
            .subscribe(
            data => { this.tempDescriptionData = data.Description },
            err => console.log('Error while trying to Read Json File' + err)
            );
    }

    assetTypeSelected() {
        this.router.navigate(['Assets', { assetType: this.altertType }]);
    }

    addDescription(name, description) {
        this.tempDescriptionData.reverse();
        if (name == null || name == undefined) {
            name = 'Name';
        }
        this.tempDescriptionData.push({ "value": this.tempDescriptionData.length, "name": name, "date": new Date().toDateString(), "description": description });
        this.tempDescriptionData.reverse();
    }

    okDescription() {
        //TO DO
    }
}