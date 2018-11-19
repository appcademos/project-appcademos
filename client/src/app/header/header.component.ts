import { Component, OnInit } from "@angular/core";
import { AcademySessionService } from "../../services/academySession.service";
import { UserSessionService } from "../../services/userSession.service";
import { Router, Event, NavigationEnd } from "@angular/router";

const MOBILE_WIDTH = 870;

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
  host: {
    '(window:resize)': 'onResizeWindow($event)'
  }
})
export class HeaderComponent implements OnInit
{
    isHome: boolean = false;
    isMobileNavVisible: boolean = false;

    constructor(
    private router: Router,
    private academyService: AcademySessionService,
    private userService: UserSessionService)
    {}

    ngOnInit()
    {
        if (this.router.url === '/')
            this.isHome = true;

        this.router.events.subscribe( (event: Event) =>
        {
            if (event instanceof NavigationEnd)
            {
                if (this.router.url === '/')
                    this.isHome = true;
                else
                    this.isHome = false;
            }
        });
    }
    ngDoCheck()
    {
        document.body.style.overflow = (this.isMobileNavVisible) ? 'hidden' : 'visible';
    }
    onResizeWindow(event)
    {
        let width = event.target.innerWidth;

        if (width > MOBILE_WIDTH)
            this.isMobileNavVisible = false;
    }

    logout()
    {
        if (this.academyService.academy)
        {
            this.academyService.logout().subscribe();
        }
        else
        {
            this.userService.logout().subscribe();
        }
    }
}
