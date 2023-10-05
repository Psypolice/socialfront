import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {NotificationService} from "../../service/notification.service";
import {UserService} from "../../service/user.service";
import {User} from "../../models/User";

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {

  public profileEditForm!: FormGroup;

  constructor(private dialogRef: MatDialogRef<EditUserComponent>,
              private fb: FormBuilder,
              private notification: NotificationService,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private userService: UserService) {
  }

  ngOnInit(): void {
    this.profileEditForm = this.createProfileForm();
  }

  createProfileForm(): FormGroup {
    return this.fb.group({
      firstname: [this.data.firstname, Validators.compose([Validators.required])],
      lastname: [this.data.lastname, Validators.compose([Validators.required])],
      bio: [this.data.bio, Validators.compose([Validators.required])],
    });
  }

  submit(): void {
    this.userService.updateUser(this.updateUser())
      .subscribe(() => {
        this.notification.showSnackBar('User update successfully');
        this.dialogRef.close();
      });
  }

  private updateUser(): User {
    this.data.firstname = this.profileEditForm.value.firstname;
    this.data.lastname = this.profileEditForm.value.lastname;
    this.data.bio = this.profileEditForm.value.bio;
    return this.data.user;
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
