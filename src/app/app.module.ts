import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from "@angular/common/http";
import {MaterialModule} from "./material-module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {authInterceptorProviders} from "./helper/auth-interceptor.service";
import {LoginComponent} from './auth/login/login.component';
import {RegisterComponent} from './auth/register/register.component';
import {NavigationComponent} from "./layout/navigation/navigation.component";
import {IndexComponent} from "./layout/index/index.component";
import {AddPostComponent} from "./user/add-post/add-post.component";
import {EditUserComponent} from "./user/edit-user/edit-user.component";
import {ProfileComponent} from "./user/profile/profile.component";
import {UserPostsComponent} from "./user/user-posts/user-posts.component";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    NavigationComponent,
    IndexComponent,
    AddPostComponent,
    EditUserComponent,
    ProfileComponent,
    UserPostsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [authInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule {
}
