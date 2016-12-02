import { Component, OnInit, EventEmitter, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { UsersService } from '../services/User.service';


@Component({
    selector: 'help-video',
    template: `
    <span title="Play Video" style="float:right;cursor:pointer;" class="glyphicon glyphicon-play-circle" (click)=onPlayVideo()> </span>
<modal #videoModal style="color:#0458A2" >
   <modal-header [show-close]="true" style="background: rgb(167, 176, 190)">
      <h4 class="modal-title" style="text-align: center;color:white">Online Documentation</h4>
   </modal-header>
   <modal-body>
      <div class="modal-body" [style.height]="isCommentBox ? '340px' : '470px'">
         <div  style="float:left;margin-top:25px;">
            <div class="row">
               <div class="col-sm-12 embed-response">
                  <div  class="uni-card-2" style="padding:12px;0 2px 4px 0 #ffffff,0 2px 10px 0 #ffffff!important">
                     <video width="380px" src={{currentVideoPath}} class="embed-responsive-item" controls></video>
                  </div>
                  <div style="float:left; margin-top:10px;">
                     <p style="float:left;margin-left:10px;"><b> {{currentVideoDesc}} </b></p> <br>
                     <p style="float:left;margin-left:10px;"> <b>Views:</b> {{currentVideoViews}} </p>
                     <a style="cursor:pointer;float:left;margin-left:20px;">
                     <span class="glyphicon glyphicon-comment" (click)=openComment()></span>
                     </a>
                     <a  style="float:left;margin-left:30px;cursor:pointer">
                     <span class="glyphicon glyphicon-thumbs-up" (click)=likeVideo()></span>
                     </a>     
                     <p style="float:left;margin-left:5px"> {{currentVideoRating}} </p>
                  </div>
                  <div [hidden]="isCommentBox" id="comments" >
                     <label style="margin-top:75px; margin-left:-200px;font-style:italic">Comments:</label>
                      <br>
                     <textarea rows="1" [(ngModel)]='newComment' name="comment" maxlength="200" (keyup)="0" style="color:#356cb5;width:98%;margin-left:10px;"></textarea>
                     <br>
                     <button type="button" [ngClass]="{'uni-button':newComment!=''||newComment!=null,'uni-button-disabled':newComment==''}" (click)='addComment(newComment)' [disabled]="newComment==''" style="margin-left:10px;margin-bottom:2px;">Add</button>
                     <p style="margin-left:10px" [hidden]="!messageEnable" ><i>Thank you for your feedback</i></p>
                  </div>
               </div>
            </div>
         </div>
         <div  style="margin-left:50%;height:300px;">
            <h5 style="margin-left:60%;margin-top:-20px;">
               Sort by
               <select style="width:70%;display:inline;height:30px;" [(ngModel)]="stype" name="type" (ngModelChange)="sortBy()" class="form-control">
               <option *ngFor="let type of sortTypes" value={{type}}>{{type}}</option>
               </select>
            </h5>
            <div  [style.height]="isCommentBox ? '80%' : '120%'" [style.overflow-y]="isCommentBox ? 'scroll' : ''">
            <div *ngFor="let data of videos; let i=index;" class="list-group" style="padding:0px;margin-bottom:1px;">
               <a id="videoList"  class="list-group-item" style="cursor:pointer;padding:10px 15px 0px 15px;"  (click)=showVideo(i)>
                  <p class="list-group-item-text">{{data.description}}</p>
                  <p style="font-size:12px;float:left;">Views : {{data.views}} </p>
                  <p style="font-size:12px;margin-left:40%;">  Time : {{data.time}}</p>
               </a>
            </div>
         </div>
      </div>
      </div>
   </modal-body>
</modal>
     `,
    styleUrls: ['public/css/mainArea/view.css', 'public/css/common/modal.css'],
})

export class VideosComponent implements OnInit {

    //--------------------------------------Play Modal--------------------------------------------------
    @ViewChild('videoModal')
    videoModal: ModalComponent;
    videos: any[];
    currentVideoPath: any;
    currentVideoTitle: string;
    currentVideoViews: number;
    currentVideoRating: number;
    currentVideoDesc: string;
    currentVideoComments: any[];
    sortTypes: string[] = ['Rating', 'Views', 'Time'];
    videoSelected: boolean = false;
    stype: string = null;
    selectedType: EventEmitter<Object> = new EventEmitter();
    isCommentBox: boolean = true;
    newComment: string = '';
    messageEnable: boolean = false;

    constructor(public http: Http, private router: Router, private userSvc: UsersService) {

    }

    ngOnInit() {
        this.http.get("public/json/videos.json")
            .map(res => res.json())
            .subscribe(
            data => { this.videos = data.videos, console.log(data.videos) },
            err => console.log('Error while trying to Read Json File' + err)
            );
    }

    sortBy() {
        this.selectedType.emit(this.stype);
        switch (this.stype) {
            case 'Rating':
                this.videos.sort(function (video1, video2) {
                    return video1.rating - video2.rating;
                });
                break;
            case 'Views':
                this.videos.sort(function (video1, video2) {
                    return video1.views - video2.views;
                });
                break;
            case 'Time':
                this.videos.sort(function (video1, video2) {
                    var vid1 = video1.time.split(':');
                    var vid2 = video2.time.split(':');
                    var sec1 = (+vid1[0]) * 60 + (+vid1[1]);
                    var sec2 = (+vid2[0]) * 60 + (+vid2[1]);
                    return sec1 - sec2;
                });
                break;
            default:
                this.videos.sort(function (video1, video2) {
                    return video1.id - video2.id;
                });

        }

        console.log(this.videos);
    }

    showVideo(i) {
        this.currentVideoPath = this.videos[i].path;
        this.currentVideoTitle = this.videos[i].title;
        this.currentVideoDesc = this.videos[i].description;
        this.currentVideoRating = this.videos[i].rating;
        this.currentVideoViews = this.videos[i].views;
        this.currentVideoComments = this.videos[i].comments;
    }

    likeVideo() {
        this.currentVideoRating = this.currentVideoRating + 1;
    }

    openComment() {
        this.isCommentBox = !this.isCommentBox;
    }

    addComment(comment: string) {

        this.currentVideoComments.push({
            "commentedBy": this.userSvc.getCurrentUserName(),
            "comment": comment,
            "date": new Date().toLocaleString()
        });
        if (this.currentVideoComments.length > 0 && this.currentVideoComments.length != null) {
            this.currentVideoComments.reverse();
        }
        this.newComment = '';
        this.messageEnable = true;
    }

    onPlayVideo() {
        console.log("open video modal");
        this.openVideo();
    }

    openVideo() {
        this.videoModal.open('lg');
        this.showVideo(1);
    }

}