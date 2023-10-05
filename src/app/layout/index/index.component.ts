import {Component, OnInit} from '@angular/core';
import {Post} from "../../models/Post";
import {User} from "../../models/User";
import {PostService} from "../../service/post.service";
import {UserService} from "../../service/user.service";
import {CommentService} from "../../service/comment.service";
import {NotificationService} from "../../service/notification.service";
import {ImageUploadService} from "../../service/image-upload.service";

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  isPostsLoaded = false;
  posts!: Post[];
  isUserDataLoaded = false;
  user!: User;

  constructor(private postService: PostService,
              private userService: UserService,
              private commentService: CommentService,
              private notification: NotificationService,
              private imageService: ImageUploadService) {
  }

  ngOnInit(): void {
    this.postService.getAllPosts()
      .subscribe(data => {
        console.log(data);
        this.posts = data;
        this.getImagesToPost(this.posts);
        this.getCommentsToPost(this.posts);
        this.isPostsLoaded = true;
      });

    this.userService.getCurrentUser()
      .subscribe(data => {
        this.user = data;
        this.isUserDataLoaded = true;
      });
  }

  getImagesToPost(posts: Post[]): void {
    posts.forEach(p => {
      this.imageService.getImageToPost(p.id!)
        .subscribe(data => {
          p.image = data.imageBytes;
        })
    });
  }

  getCommentsToPost(posts: Post[]): void {
    posts.forEach(p => {
      this.commentService.getCommentToPost(p.id!)
        .subscribe(data => {
          p.comments = data;
        })
    });
  }

  likePost(postId: number, postIndex: number): void {
    const post = this.posts[postIndex];
    console.log(post);

    if (!post.usersLiked?.includes(this.user.username)) {
      this.postService.likePost(postId, this.user.username)
        .subscribe(() => {
          post.usersLiked?.push(this.user.username);
          this.notification.showSnackBar("Liked!");
        });
    } else {
      this.postService.likePost(postId, this.user.username)
        .subscribe(() => {
          const index = post.usersLiked?.indexOf(this.user.username, 0);
          if (index && index > -1) {
            post.usersLiked?.splice(index, 1);
          }
        })
    }
  }

  postComment(message: string, postId: number, postIndex: number): void {
    const post = this.posts[postIndex];

    console.log(post);

    this.commentService.addCommentToPost(postId, message)
      .subscribe(data => {
        console.log(data);
        post.comments?.push(data);
      });
  }

  formatImage(img: any): any {
    if (img == null) {
      return null;
    }
    return 'data:image/jpeg;base64,' + img;
  }


}
