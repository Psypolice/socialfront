import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {TokenStorageService} from "../../service/token-storage.service";
import {NotificationService} from "../../service/notification.service";
import {Router} from "@angular/router";
import {AuthService} from "../../service/auth.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {

  public regForm: FormGroup = new FormGroup({
    email: new FormControl(''),
    username: new FormControl(''),
    firstname: new FormControl(''),
    lastname: new FormControl(''),
    password: new FormControl(''),
    confirmPassword: new FormControl('')
  });
  submitted = false;
  hide = true;

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
      username: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(20)])],
      firstname: ['', Validators.compose([Validators.required])],
      lastname: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required])],
      confirmPassword: ['', Validators.compose([Validators.required])],
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.regForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.regForm.invalid) {
      return;
    }

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

  getErrorMessage() {
    return this.regForm.controls['email'].hasError('required') ? 'You must enter a value' :
      this.regForm.controls['email'].hasError('email') ? 'Not a valid email' :
        '' ;
  }
}
