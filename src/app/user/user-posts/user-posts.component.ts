import {Component, OnInit} from '@angular/core';
import {PostService} from "../../service/post.service";
import {Post} from "../../models/Post";
import {CommentService} from "../../service/comment.service";
import {ImageUploadService} from "../../service/image-upload.service";
import {NotificationService} from "../../service/notification.service";

@Component({
  selector: 'app-user-posts',
  templateUrl: './user-posts.component.html',
  styleUrls: ['./user-posts.component.css']
})
export class UserPostsComponent implements OnInit {

  isUserPostsLoad = false;
  posts!: Post[];


  constructor(private notification: NotificationService,
              private postService: PostService,
              private commentService: CommentService,
              private imageService: ImageUploadService) {
  }

  ngOnInit(): void {
    this.postService.getPostForCurrentUser()
      .subscribe(data => {
        console.log(data);
        this.posts = data;
        this.getImagesToPosts(this.posts);
        this.getCommentsToPosts(this.posts);
        this.isUserPostsLoad = true;
      });
  }

  getCommentsToPosts(posts: Post[]): void {
    posts.forEach(p => {
      this.imageService.getImageToPost(p.id!)
        .subscribe(data => {
          p.image = data.imageBytes;
        });
    });
  }

  getImagesToPosts(posts: Post[]): void {
    posts.forEach(p => {
      this.commentService.getCommentToPost(p.id!)
        .subscribe(data => {
          p.comments = data;
        });
    });
  }

  removePost(post: Post, index: number): void {
    console.log(post);
    const result = confirm('Do you really want to delete this post?');

    if (result) {
      this.postService.delete(post.id!)
        .subscribe(() => {
          this.notification.showSnackBar('Post deleted');
        });
    }
  }

  deleteComment(commentId: number, postIndex: number, commentIndex: number): void {
    const post = this.posts[postIndex];
    const result = confirm('Do you really want to delete this comment?');

    if (result) {
      this.commentService.delete(commentId)
        .subscribe(() => {
          this.notification.showSnackBar('Comment deleted');
          post.comments?.splice(commentIndex, 1);
        });
    }
  }

  formatImage(img: any): any {
    if (img == null) {
      return null;
    }
    return 'data:image/jpeg;base64,' + img;
  }
}
