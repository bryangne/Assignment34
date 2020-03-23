import { User } from './user.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {
  private users: User[] = [];
  private usersUpdated = new Subject<User[]>();
  constructor(private http: HttpClient) {
    // placeholder data
    // const user1 = {_id: '1', name: 'bryan', email: 'bryan@example.com', age: 24};
    // const user2 = {_id: '2', name: 'bob', email: 'bob@example.com', age: 22};
    // const user3 = {_id: '3', name: 'bill', email: 'bill@example.com', age: 32};
    // this.users.push(user1, user2, user3);
  }

  getUsers() {
    this.http.get<{message: string, users: User[]}>('http://localhost:3000/users')
      .subscribe((userData) => {
        this.users = userData.users;
        this.usersUpdated.next([...this.users]);
    });
  }

  getUserUpdateListener() {
    return this.usersUpdated.asObservable();
  }

  addUser(name: string, email: string, age: number) {
    const user: User = {_id: '', name, email, age};
    this.http.post<{message: string, id: string}>('http://localhost:3000/users', user)
      .subscribe((response) => {
        console.log(response.message);
        user._id = response.id;
        this.users.push(user);
        this.usersUpdated.next([...this.users]);
      });
  }

  deleteUser(_id: string) {
    this.http.delete('http://localhost:3000/users/' + _id)
      .subscribe(() => {
        const updated = this.users.filter(user => user._id !== _id);
        this.users = updated;
        this.usersUpdated.next([...this.users]);
      });
  }

  updateUser(_id: string, name: string, email: string, age: number) {
    const user: User = {_id, name, email, age};
    this.http.patch('http://localhost:3000/users/' + _id, user).subscribe(response => {
      console.log(response);
      const updated = [...this.users];
      const oldIndex = updated.findIndex(u => u._id === user._id);
      updated[oldIndex] = user;
      this.users = updated;
      this.usersUpdated.next([...this.users]);
    });

  }
}
