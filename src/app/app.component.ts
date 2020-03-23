import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from './user.model';
import { Subscription } from 'rxjs';
import { UserServiceService } from './user-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Assignment34';
  users: User[] = [];
  private userSub: Subscription;

  public isLoading = true;
  public editMode = false;
  public id = '';
  public name = '';
  public email = '';
  public age: number;

  constructor(public userService: UserServiceService) { }

  ngOnInit(): void {
    // fetch the list initially before the subscription
    this.userService.getUsers();
    // subscribe
    this.userSub = this.userService.getUserUpdateListener()
      .subscribe((users: User[]) => {
        this.users = users;
        this.isLoading = false;
      });
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
  // ========================================================
  // The input
  submitClickHandler() {
    if(!this.editMode) {
      this.userService.addUser(this.name, this.email, this.age);
    } else {
      this.userService.updateUser(this.id, this.name, this.email, this.age);
    }
    this.editMode = false;
    this.clearDataHelper();
  }

  cancelClickHandler() {
    this.editMode = false;
    this.clearDataHelper();
  }
  // ========================================================
  // ========================================================
  // The list
  editClickHandler(user: User) {
    this.editMode = true;
    this.id = user._id;
    this.name = user.name;
    this.email = user.email;
    this.age = user.age;
  }
  deleteClickHandler(id: string) {
    this.userService.deleteUser(id);
  }
  // ========================================================

  clearDataHelper() {
    this.name = null;
    this.email = null;
    this.age = null;
  }
}
