import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from 'src/app/_models/User';
import { UserService } from 'src/app/_services/user.service';
import { AltertifyService } from 'src/app/_services/altertify.service';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';
import { TabsetComponent } from 'ngx-bootstrap';

@Component({
  selector: 'app-member-details',
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.css']
})
export class MemberDetailsComponent implements OnInit {
  @ViewChild('memberDetailsTab') membersTab: TabsetComponent;
  user: User;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  constructor(private userService: UserService, private alertify: AltertifyService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.user = data['user'];
    });

    this.route.queryParams.subscribe(query => {
      const queryTab = query['tab'];
      this.selectTab(queryTab > 0 ? queryTab : 0);
    });

    this.galleryOptions = [
      {
          width: '500px',
          height: '500px',
          imagePercent: 100,
          thumbnailsColumns: 4,
          imageAnimation: NgxGalleryAnimation.Slide,
          preview: false
      },
  ];

  this.galleryImages = this.getImages();

  }

  getImages() {
    const imageUrl = [];

    for (let index = 0; index < this.user.photos.length; index++) {
      imageUrl.push({
          small: this.user.photos[index].url,
          medium: this.user.photos[index].url,
          big: this.user.photos[index].url,
          description: this.user.photos[index].description
      });
    }
    return imageUrl;
  }

  selectTab(tabId: number) {
    this.membersTab.tabs[tabId].active = true;
  }

}
