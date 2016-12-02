import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';//Needed for http request
import { AssetItem } from '../../common/assetItem';
import { AssetType } from '../../common/assetType';
import { Operator_AssetsServices_Mock } from '../../services/Operator_Assets_Mock.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UI_Tabs } from '../../common/ui_tabs.component';
import { Tab } from '../../common/tab.component';
import { EnumUtil } from '../../common/EnumUtil';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import 'rxjs/add/operator/map';//Needed for map in http request
import { NameDescriptionComponent } from '../../common_ui/name_description_component';
import { HighlightPipe } from '../../common_ui/highlight_pipe';
import { DND_DIRECTIVES } from 'ng2-dnd';

@Component({
    selector: 'view-update-tab',
    template: `
        <ul  id='breadcrumb' >
            <li><a (click)='assetTypeSelected()'>{{altertType}}</a> </li>
            <li><a>Updates</a> </li>
        </ul>
        <form class="assetForm uni-card-2" id="updateOperator" (ngSubmit)='onSubmit(f.value)' #f='ngForm'>
            
            <h5 style='margin-bottom: 25px;'>One or more changes have been published to the family on which this view is based on. Select those update you want to accept, and press apply.</h5>
            
            <uni-name-description [assetType]=altertType [assetItem]= alertItem [formCtrl]="f"></uni-name-description>
            <div style="clear:both"></div>
            <div class="form-group form-group-sm">
                <label for="family">Family</label>
                <div  style="width:66%" class ="has-feedback">
                <select [(ngModel)]="product" (ngModelChange)="onChange($event)" class="form-control">
                    <option selected disabled>-- Select Product --</option>
                </select>
                </div>
            </div>
            <p id="para_view_update">To accept the published changes, press the Status link, review the changes and press the Save button.</p>
            <table>
                <tr>
                    <th>Selected</th>
                    <th>Status</th>
                    <th>Modified By</th>
                    <th>Applied</th>
                    <th>Published</th>
                    <th>Description</th>
                </tr>
                <tr *ngFor="let data of tempData">
                    <td>
                        <input class="unicheckBox" id="#{{data.value}}" type="checkbox" [(ngModel)]="data.selected" (ngModelChange)="chkBoxChange(data.value, data.selected)">
                    </td>
                    <td>{{data.status}}</td>
                    <td>{{data.modifiedBy}}</td>
                    <td>{{data.applied}}</td>
                    <td>{{data.published}}</td>
                    <td>{{data.description}}</td>
                <tr>
            </table> 
            
            <div class="row" style="margin-top:20px;">
                <button type="button" class='uni-button' (click)='onCancel()'  style='float:right; margin:20px 20px 5px 5px'>Cancel</button>
                <button type='submit' class='uni-button' style='float:right; margin:20px 0px 5px 5px'>Apply</button>
            </div>
       </form>
    `,
    styleUrls: ['../../public/css/mainArea/breadcrumb.css', '../../public/css/mainArea/view.css'],
    // pipes: [HighlightPipe]
})

export class ViewUpdateTabComponent implements OnInit {
    product: string = '-- Select Product --';
    tempData: any[];
    tempDescriptionData: any[];
    altertType: AssetType = AssetType.View;//Needed
    alertItem: AssetItem = null;//Needed
    // assetItems = [];
    defaultImageUrl: string = 'public/img/organization_bright_green2.png';
    index: number;
    private editMode = 'update';
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
            data => { this.tempData = data.UpdatePage },
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

    chkBoxChange(id: number, status: boolean) {
        console.log(id);
        console.log(status);
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

    onCancel() {
        this.router.navigate(['Assets', { assetType: this.altertType }]);
    }
}
