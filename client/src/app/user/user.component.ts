import { Component, OnInit } from '@angular/core';
import { UserSessionService } from '../../services/userSession.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  user: any;

  constructor(public userSession: UserSessionService) {
    this.userSession.userEvent.subscribe(user => {
      console.log("line 15 userComp");
      if (user) this.user = user;
    });
  }

  ngOnInit() {
  }

}
