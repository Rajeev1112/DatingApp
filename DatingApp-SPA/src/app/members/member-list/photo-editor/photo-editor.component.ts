import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Photo } from 'src/app/_models/photo';
import { FileUploader } from 'ng2-file-upload';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/_services/auth.service';
import { UserService } from 'src/app/_services/user.service';
import { AltertifyService } from 'src/app/_services/altertify.service';
import { error } from 'protractor';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {

  @Input() photos: Photo[];
  @Output() getMemberPhotoChange = new EventEmitter<string>();
  uploader: FileUploader;
  hasBaseDropZoneOver: boolean;
  baseUrl = environment.baseUrl;

  constructor(private auth: AuthService, private userService: UserService, private alertify: AltertifyService) { }

  ngOnInit() {
    this.initialize();
  }

  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  initialize() {
    this.uploader = new FileUploader({
      url: this.baseUrl + 'user/' + this.auth.decodedToken.nameid + '/photos',
      authToken: 'Bearer ' + localStorage.getItem('token'),
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024
    });

    this.uploader.onAfterAddingFile = file => {
        file.withCredentials = false;
    };

    this.uploader.onSuccessItem = (item, response, status, header) => {
      if (response) {
        const res: Photo = JSON.parse(response);
        const photo = res;
        this.photos.push(photo);
      }

    };
  }

  setMainPhoto(photo: Photo) {
    this.userService.setMainPhoto(this.auth.decodedToken.nameid, photo.id).subscribe(next => {
      const currMainPhoto = this.photos.filter(p => p.isMain === true)[0];
      currMainPhoto.isMain = false;
      photo.isMain = true;
      this.getMemberPhotoChange.emit(photo.url);
      this.auth.changeMemberPhoto(photo.url);
      this.auth.currUser.photoUrl = photo.url;
      localStorage.setItem('user', JSON.stringify(this.auth.currUser));
    }, err => this.alertify.error(err));
  }

  deletePhoto(photoId: number) {
    this.alertify.confirm('Are you sure to delete this photo?', () => {
      this.userService.deletePhoto(this.auth.decodedToken.nameid, photoId).subscribe(next => {
        this.photos.splice(this.photos.findIndex(p => p.id === photoId), 1);
        this.alertify.success('Photo has been deleted');
      }, err => {
        this.alertify.error(err);
      });
    });
  }

}
