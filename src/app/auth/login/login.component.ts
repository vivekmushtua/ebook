import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SharedModule } from '../../../shared/shared/shared.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SnackbarComponent } from '../../../shared/shared/snackbar/snackbar.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { JwtService } from '../../jwt.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule,MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  signupForm: FormGroup
  loginForm: FormGroup
  oldUser = signal(true)
  hide = signal(true)
  userList = signal([])

  constructor(
    private formBuild: FormBuilder,
    private _snackBar: MatSnackBar,
    private jwtService: JwtService
  ){}

  ngOnInit() {
    this.initialForm()
    let list = JSON.parse(localStorage.getItem('users'))
    if(list)this.userList.set(list)
    console.log('this.userList', this.userList())
  }

  initialForm(){

    this.signupForm = this.formBuild.group({
      userName:['',[Validators.required]],
      email:['',[Validators.required, Validators.email]],
      password:['',[Validators.required]]
    })

    this.loginForm = this.formBuild.group({
      email:['',[Validators.required, Validators.email]],
      password:['',[Validators.required]]
    })

  }

  showHidePass() {
    this.hide.set(!this.hide());
  }

  changeUser(){
    this.oldUser.set(!this.oldUser())
  }

  login(){
    let request = this.loginForm.value
    const exist = this.userList().find(item => item.email == request.email && item.password == request.password)
    if(exist){
      this.jwtService.createJwt(request).subscribe((res) => {
const token = res['token']
if(token){
  localStorage.setItem('token', JSON.stringify(token))
  this._snackBar.openFromComponent(SnackbarComponent, {
    duration:3000,
    data: { message: 'Logged in Successfully', success: true },
    horizontalPosition: 'right',
    verticalPosition: 'top',
    panelClass: ['custom-snackbar-success']
  });
}
      })
    }

    else{
      this._snackBar.openFromComponent(SnackbarComponent, {
        duration:3000,
        data: { message: `Sorry, User don't exist`, success: false },
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: ['custom-snackbar-failure']
      });
    }
  }

  signup(){
    let request = this.signupForm.value
    const exist = this.userList().find(item => item.email == request.email)
    if(exist){
       this._snackBar.openFromComponent(SnackbarComponent, {
        duration:3000,
        data: { message: `User Already Exist`, success: false },
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: ['custom-snackbar-failure']
      });
      return
    }
    else{
    this.userList.update((oldData = []) => [...oldData, request]);
    localStorage.setItem('users', JSON.stringify(this.userList()))
    this._snackBar.openFromComponent(SnackbarComponent, {
      duration:3000,
      data: { message: 'User Created Successfully', success: true },
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['custom-snackbar-success']
    });
    this.changeUser()
  }
  }
}
