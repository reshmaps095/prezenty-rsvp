import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ApiService } from 'app/shared/api.service';
import {DatePipe} from '@angular/common';

import * as moment from 'moment';
import {Md5} from 'ts-md5/dist/md5';
declare var $:any;
declare var gapi:any;
@Component({
    selector: 'dashboard-cmp',
    moduleId: module.id,
    templateUrl: 'dashboard.component.html'
})

export class DashboardComponent implements OnInit{

  imageFilesLocation: any;
  image_url: any;
  evntid: string;
  evntDetail: any;
  timestmp: number;
  liveLink: string;
  minutes: any;
  currentTime: any;
  join: boolean;
  sharelive: boolean;
  eventId: string;
  date: Date;
  time: any;
  eventDay: string;
  title: any;
  eventTime: string;
  baseUrlVideo: any;
  video_file: any;
  created_by: any;
  currentDtae: any;
  EventDate: any;
  eventDate: any;
  eventStatus: boolean;
  constructor(private apiService:ApiService,private router:Router,private datePipe: DatePipe,) {
    this.evntid = localStorage.getItem('eventId');
   }

  ngOnInit() {
    $(".modal-backdrop").removeClass('modal-backdrop');
    $('html, body').animate({ scrollTop: 0 }, 'fast');
    this.eventDetails();

  }
  eventDetails(){
    var date = new Date();
    this.currentDtae = this.datePipe.transform(date,"yyyy-MM-dd");
    this.apiService.getEventDetail(this.evntid).subscribe((res:any)=>{
      if (res) {
      this.evntDetail = res['detail'];
      this.title = this.evntDetail.title;
      this.time = this.evntDetail.time;
      this.created_by = this.evntDetail.created_by;
      this.EventDate = this.evntDetail.date;
      this.eventDate = res['detail'].date;

      if(this.eventDate >= this.currentDtae){
        this.eventStatus = true;
      }
      else{
        this.eventStatus = false;

      }
      if(res.detail.video_file){
        this.baseUrlVideo = res.baseUrlVideo;
        this.video_file = res.detail.video_file;
       }
       else{
        this.imageFilesLocation = res.imageFilesLocation;
        this.image_url = res.detail.image_url;

       }
      this.eventTime = this.time = moment(this.time, ["HH:mm"]).format("hh:mm A");
      this.imageFilesLocation = res.imageFilesLocation;
      this.image_url = res['detail'].image_url;
      this.date = new Date(this.evntDetail.date);
      let longMonth = this.date.toLocaleString('en-us', { month: 'short' }); /* June */
     let year = this.evntDetail.date.slice(0,4);
     let day = this.evntDetail.date.slice(8,10);
      this.time = this.evntDetail.time;
      this.eventDay = day + '-' + longMonth + '-' + year;
      const eventday = new Date(this.eventDay).toLocaleString('en-us', {weekday:'long'})
     var currenDay = new Date().toLocaleString('en-us', {  weekday: 'long' })
     var today = new Date();
     let hours = new Date(today).getHours();
      this.minutes = new Date(today).getMinutes();
     var ampm = hours >= 12 ? 'PM' : 'AM';
     hours = hours % 12;
     hours = hours ? hours : 12; // the hour '0' should be '12'
     this.minutes = this.minutes < 10 ? '0' + this.minutes : this.minutes;
     var strTime = hours + ':' + this.minutes + ' ' + ampm;
     var format = 'hh:mm:ss';
     this.currentTime =  moment(strTime, 'hh:mm A').format('HH:mm');
     var specific_date = new Date(this.eventDay);
     var current_date = new Date();
     if(current_date.getDate() == specific_date.getDate())
     {
         if(eventday ==  currenDay){
           this.sharelive = true;
         }
         else{
           this.sharelive = false;

          }
     }
     else
     {
      this.sharelive = false;
     }
     }

    })
  }





// function to add events to google calender end

joinlivestream(){


  const md5 = new Md5();
  if(this.sharelive === true){
    window.open('https://meet.jit.si/' +  md5.appendStr('event:'+this.eventId).end(), '_blank').focus();
  }
  else{
    $('#live-warning-modal1').modal('show');
    $('body').css('padding-right','0');

    setTimeout(() => {
      $('#live-warning-modal1').modal('hide');

    }, 2000);
  }
}
}
