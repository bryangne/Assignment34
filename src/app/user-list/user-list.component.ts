import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../user.model';
import { Subscription } from 'rxjs';
import { UserServiceService } from '../user-service.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit, OnDestroy {
  users: User[] = [];
  private userSub: Subscription;

  constructor(public userService: UserServiceService) { }

  ngOnInit(): void {
    // fetch the list initially before the subscription
    this.userService.getUsers();
    // subscribe
    this.userSub = this.userService.getUserUpdateListener()
      .subscribe((users: User[]) => {
        this.users = users;
      });
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

}
