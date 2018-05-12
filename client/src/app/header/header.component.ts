import { Component, OnInit } from "@angular/core";
import { AcademySessionService } from "../../services/academySession.service";
import { UserSessionService } from "../../services/userSession.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"]
})
export class HeaderComponent implements OnInit {
  constructor(
    private academyService: AcademySessionService,
    private userService: UserSessionService
  ) {}

  ngOnInit() {}

  logout() {
    if (this.academyService.academy) {
      this.academyService.logout().subscribe();
    } else {
      this.userService.logout().subscribe();
    }
  }
}
