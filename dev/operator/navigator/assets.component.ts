import { Component, OnInit } from '@angular/core';
import { AssetItem } from '../../common/assetItem';
import { OperatorAssetItem } from '../../common/operator_assetItem';
import { AssetType } from '../../common/assetType';
import { Router, ActivatedRoute } from '@angular/router'
import { DataService } from '../../services/Assets.service';

@Component({
    selector: 'assets',
    templateUrl: 'public/html/navigator/assets_template.html',
    styleUrls: ['public/css/navigator/sence_assets.css'],
    inputs: ['assetType', 'visible'],
})

export class OperatorAssetsComponent implements OnInit {

    displayName: string;
    assetItems = new Array<AssetItem>();
    isExpanded = false;
    assetType: AssetType;
    visible: boolean = true;
    loading: boolean;

    constructor(private route: ActivatedRoute, private router: Router, private operatorSvc: DataService) {
        this.loading = false;
    }

    showLoadding() {
        return this.visible && this.loading;
    }

    init(type: AssetType, name: string) {
        console.log(type);
        this.assetType = type;
        this.displayName = name;
        this.loading = false;
    }

    onClick() {
        this.isExpanded = !this.isExpanded;
        if (this.isExpanded && this.assetItems.length == 0) {
            this.loading = true;
            this.loadNavItems();
        }
    }

    loadNavItems() {
        console.log(this.assetType);
        this.operatorSvc.getEntities(this.assetType).subscribe(
            data => this.onGetEntities(data),
            error => this.onGetEntitiesError(error)
        );
    }

    assetTypeSelected() {
        if (this.assetType == AssetType.PublishedFamily) {
            this.router.navigate(['publishedFamily'], { relativeTo: this.route });
        }
        else if (this.assetType == AssetType.Action) {
            this.router.navigate(['assets', this.assetType], { relativeTo: this.route });
        }
    }

    assetSelected(item: OperatorAssetItem) {
        this.router.navigate(['editAction', item.pkid], { relativeTo: this.route });
    }

    getIconId(): string {
        return this.assetType + "-icon";
    }

    ngOnInit() {
        this.displayName = OperatorAssetItem.getDisplayName(this.assetType);
    }

    onGetEntities(jsonData: JSON) {
        const status = jsonData.hasOwnProperty("status") ? jsonData["status"] : '';
        if (status !== "SUCCESS") {
            this.onGetEntitiesError(jsonData);
        } else {
            var entities = jsonData["data"];
            this.assetItems = [];
            if (entities != null && entities.length > 0) {
                for (var index = 0; index < entities.length; index++) {
                    let entry: OperatorAssetItem = OperatorAssetItem.parse(entities[index]);
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

    getItemDisplayName(item: OperatorAssetItem) {
        var name = item.name;
        var length = name.length;
        if (length > 20) {
            return name.substr(0, 19) + "...";
        }
        return name;
    }
}
