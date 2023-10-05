import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Post} from "../../models/Post";
import {PostService} from "../../service/post.service";
import {ImageUploadService} from "../../service/image-upload.service";
import {Router} from "@angular/router";
import {NotificationService} from "../../service/notification.service";

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.css']
})
export class AddPostComponent implements OnInit {

  postForm!: FormGroup;
  selectedFile!: File;
  isPostCreate = false;
  createdPost!: Post;
  previewImgUrl: any;

  constructor(private postService: PostService,
              private imageUploadService: ImageUploadService,
              private notification: NotificationService,
              private router: Router,
              private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.postForm = this.createPostForm();
  }

  createPostForm(): FormGroup {
    return this.fb.group({
      title: ['', Validators.compose([Validators.required])],
      caption: ['', Validators.compose([Validators.required])],
      location: ['', Validators.compose([Validators.required])]
    });
  }

  submit(): void {
    this.postService.createPost({
      title: this.postForm.value.title,
      caption: this.postForm.value.caption,
      location: this.postForm.value.location
    }).subscribe(data => {
      this.createdPost = data;
      console.log('Post created');
      console.log(data);

      if (this.createdPost != null) {
        this.imageUploadService.uploadImageToPost(this.selectedFile, this.createdPost.id!)
          .subscribe(() => {
            this.notification.showSnackBar('Post created successfully');
            this.isPostCreate = true;
            this.router.navigate(['/profile']);
          });
      }
    });
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];

    const reader = new FileReader();
    reader.readAsDataURL(this.selectedFile);
    reader.onload = () => {
      this.previewImgUrl = reader.result;
    };
  }

}
