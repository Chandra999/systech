import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';
import { DndModule } from 'ng2-dnd';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { NavigatorDirective } from './navigator/navigator.directive';
import { AssetCardComponent } from './assetCard.component';
import { AssetListComponent } from './assetList.component';
import { AssetTypeCardsComponent } from './assetTypeCards.component';
import { DropDownHelpCheckBox } from './dropDown-help-checkBox';
import { FilterPipe } from './filter_pipe';
import { HighlightPipe } from './highlight_pipe';
import { NameDescriptionComponent } from './name_description_component';
import { OrderByPipe } from './orderBy_pipe';
import { MessageComponent } from '../message-center/message/message.component';
import { SearchBoxComponent } from '../message-center/nav-bar/search-box/search-box.component';
import { NavBarComponent } from '../message-center/nav-bar/nav-bar.component';
import { MessageCenterComponent } from '../message-center/message-center.component';
import { UsersService } from '../services/User.service';
import { DataService } from '../services/Assets.service';
import { MessageService } from '../services/message.service';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        Ng2Bs3ModalModule,
        DndModule.forRoot(),
        NgbModule.forRoot()
    ],

    declarations: [
        NavigatorDirective,
        AssetCardComponent,
        AssetListComponent,
        AssetTypeCardsComponent,
        DropDownHelpCheckBox,
        FilterPipe,
        HighlightPipe,
        NameDescriptionComponent,
        OrderByPipe,
        MessageComponent,
        SearchBoxComponent,
        NavBarComponent,
        MessageCenterComponent
    ],

    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        Ng2Bs3ModalModule,
        DndModule,
        NgbModule,
        NavigatorDirective,
        AssetCardComponent,
        AssetListComponent,
        AssetTypeCardsComponent,
        DropDownHelpCheckBox,
        FilterPipe,
        HighlightPipe,
        NameDescriptionComponent,
        OrderByPipe,
        MessageComponent,
        SearchBoxComponent,
        NavBarComponent,
        MessageCenterComponent
    ],

    providers: [
        UsersService,
        DataService,
        MessageService
    ]
})

export class CommonUIModule { }