import { Component, OnInit, Input } from '@angular/core';
import { SearchBoxComponent } from './search-box/search-box.component';
import { MessageService } from '../../services/message.service';

@Component({
    selector: 'app-nav-bar',
    template: `<div id="msg-nav" style="height:40px">
            <button type="button" (click)="toggle()" id="close-center" title="Close" style="color:white">x</button>
             <div id="close-all-button" *ngIf="length!=0" title="Dismiss all messages" style="color:white">
                <svg version="1.1" id="Layer_1" (click)="closeAll()" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                    x="0px" y="0px" width="15px" height="15px" viewBox="0 0 512 512" enable-background="new 0 0 512 512" xml:space="preserve">
                    <g id="Icon_4_">
                        <g>
                            <path fill="#ffffff" d="M387.581,139.712L356.755,109L216.913,248.319l30.831,30.719L387.581,139.712z M481.172,109L247.744,340.469
			l-91.39-91.051l-30.827,30.715L247.744,403L512,139.712L481.172,109z M0,280.133L123.321,403l30.829-30.713L31.934,249.418
			L0,280.133z" />
                        </g>
                    </g>
                </svg>
            </div>
            <app-search-box></app-search-box>
        </div>`,
    styles: [`
    div#msg-nav {
          background: #1256aa; /* Old browsers */
          background: -moz-linear-gradient(top, #3b73b9 0%, #2f5c94 100%); /* FF3.6+ */
          background: -webkit-gradient(linear, left top, left bottom, color-stop(0%, #3b73b9), color-stop(100%, #2f5c94)); /* Chrome, Safari4+ */
          background: -webkit-linear-gradient(top, #3b73b9 0%, #2f5c94 100%); /* Chrome10+, Safari5.1+ */
          background: -o-linear-gradient(top, #3b73b9 0%, #2f5c94 100%); /* Opera 11.10+ */
          background: -ms-linear-gradient(top, #3b73b9 0%, #2f5c94 100%); /* IE10+ */
          background: linear-gradient(to bottom, #3b73b9 0%, #2f5c94 100%); /* W3C */
          filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#3b73b9', endColorstr='#2f5c94', GradientType=0); /* IE6-9 */

          position: relative;
          width: 100%;
          color: snow;
          border-bottom: 1px solid #f99c25;
      }

      button#close-center {
          -webkit-appearance: none;
          cursor: pointer;
          background: transparent;
          border: 0;
          padding: 0;
          float: right;
          margin-right: 5px;
          color: #000;
          text-shadow: 0 1px 0 darkslategrey;
      }

      div#close-all-button {
          position: absolute;
          right: 5px;
          bottom: 0;
          cursor: pointer;
      }

      div#close-all-button:hover {
          transform: translateY(-2px);
      }

      div#close-all-button:active {
          transform: translateY(0);
      }

      h4#message-center-title {
          font-weight: 700;
          font-size: 18px;
          display: block;
          margin: 0 0;
          padding: 15px 0 25px 0;
          text-align: center;
          box-sizing: border-box;
      }
  `]
})
export class NavBarComponent implements OnInit {

    @Input() length: number;

    constructor(private ms: MessageService) { }

    ngOnInit() {
    }

    private toggle() {
        this.ms.toggle$.emit(true);
    }

    private closeAll() {
        this.ms.closeAll$.emit(true);
    }

}
