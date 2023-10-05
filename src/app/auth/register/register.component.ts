import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {TokenStorageService} from "../../service/token-storage.service";
import {NotificationService} from "../../service/notification.service";
import {Router} from "@angular/router";
import {AuthService} from "../../service/auth.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  public regForm!: FormGroup;

  constructor(
    private authService: AuthService,
    private tokenStorage: TokenStorageService,
    private notificationService: NotificationService,
    private router: Router,
    private fb: FormBuilder) {
    if (this.tokenStorage.getUser()) {
      this.router.navigate(['main']);
    }
  }

  ngOnInit(): void {
    this.regForm = this.createRegisterForm();
  }

  createRegisterForm(): FormGroup {
    return this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      username: ['', Validators.compose([Validators.required])],
      firstname: ['', Validators.compose([Validators.required])],
      lastname: ['', Validators.compose([Validators.required])],
      bio: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required])],
      confirmPassword: ['', Validators.compose([Validators.required])],
    })
  }

  submit(): void {
    console.log(this.regForm.value)

    this.authService.register({
      email: this.regForm.value.email,
      username: this.regForm.value.username,
      firstname: this.regForm.value.firstname,
      lastname: this.regForm.value.lastname,
      bio: this.regForm.value.bio,
      password: this.regForm.value.password,
      confirmPassword: this.regForm.value.confirmPassword,
    }).subscribe({
      next: (data: any) => {
        console.log(data);

        this.tokenStorage.saveToken(data.token);
        this.tokenStorage.saveUser(data);

        this.notificationService.showSnackBar('Successfully registered');
        this.router.navigate(['/']);
        window.location.reload();
      }, error: (error: any) => {
        console.log(error);
        this.notificationService.showSnackBar('Something went wrong during registration');
      }
    });
  }
}
