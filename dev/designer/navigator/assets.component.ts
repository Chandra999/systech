import { Component, OnInit } from '@angular/core';
import { AssetItem } from '../../common/assetItem';
import { AssetType } from '../../common/assetType';
import { EnumUtil } from '../../common/EnumUtil';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from '../../services/Assets.service';

@Component({
    selector: 'assets',
    templateUrl: 'public/html/navigator/assets_template.html',
    styleUrls: ['public/css/navigator/sence_assets.css'],
    inputs: ['assetType', 'visible'],
})

export class DesignerAssetsComponent implements OnInit {

    displayName: string;
    assetItems = new Array<AssetItem>();

    isExpanded = false;
    assetType: AssetType;

    visible: boolean = true;

    loading: boolean;

    constructor(private router: Router, private route: ActivatedRoute, private assetSvc: DataService) {
        this.loading = false;

    }

    showLoadding() {
        return this.visible && this.loading;
    }

    init(type: AssetType, name: string) {
        this.assetType = type;
        this.displayName = name;
        this.loading = false;
    }

    onClick() {
        this.isExpanded = !this.isExpanded;
        if (this.isExpanded && this.assetItems.length == 0) {
            this.loading = true;
            this.assetSvc.getEntities(this.assetType).subscribe(
                data => this.onGetEntities(data),
                error => this.onGetEntitiesError(error)
            );
        }
    }

    assetTypeSelected() {
        this.router.navigate(['assets', this.assetType], { relativeTo: this.route });
    }

    assetSelected(item: AssetItem) {
        let routStr = 'edit' + item.assetType;
        this.router.navigate([routStr, item.pkid], { relativeTo: this.route });
    }

    getIconId(): string {
        return this.assetType + "-icon";
    }

    ngOnInit() {
        this.displayName = AssetItem.getDisplayName(this.assetType);
        console.log("displayname = " + this.displayName);
    }

    onGetEntities(jsonData: JSON) {
        const status = jsonData.hasOwnProperty("status") ? jsonData["status"] : '';
        if (status !== "SUCCESS") {
            this.onGetEntitiesError(jsonData);
        } else {
            var entities = jsonData["data"];
            if (entities != null && entities.length > 0) {
                for (var index = 0; index < entities.length; index++) {
                    let entry: AssetItem = AssetItem.parse(entities[index]);
                    if (entry != null) {
                        this.assetItems.push(entry);
                    }
                }
            }
            this.loading = false;
        }
    }

    onGetEntitiesError(jsonData: JSON) {
        console.log(jsonData);
    }

    getItemDisplayName(item: AssetItem) {
        var name = item.name;
        var length = name.length;
        if (length > 20) {
            return name.substr(0, 19) + "...";
        }
        return name;
    }
}