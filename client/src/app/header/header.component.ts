import { Component, OnInit, OnDestroy } from "@angular/core";
import { AcademySessionService } from "../../services/academySession.service";
import { UserSessionService } from "../../services/userSession.service";
import { Router, Event, NavigationEnd } from "@angular/router";
import { MessageService } from '../../services/message.service';
import { Subscription } from 'rxjs';
import { AuthService } from "angularx-social-login";

const MOBILE_WIDTH = 870;

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
  host: {
    '(window:resize)': 'onResizeWindow($event)'
}
})
export class HeaderComponent implements OnInit, OnDestroy
{
    isHome: boolean = false;
    isMobileNavVisible: boolean = false;
    showLogin: boolean = false;
    user: any;

    messageServiceSubscription: Subscription;

    constructor(private router: Router,
                private academyService: AcademySessionService,
                private userService: UserSessionService,
                private messageService: MessageService,
                private authService: AuthService)
    {

    }

    ngOnInit()
    {
        this.user = this.userService.user;

        console.log(window.location.pathname);

        if (this.router.url.split('?')[0] === '/')
            this.isHome = true;

        this.router.events.subscribe( (event: Event) =>
        {
            if (event instanceof NavigationEnd)
            {
                if (this.router.url.split('?')[0] === '/')
                    this.isHome = true;
                else
                    this.isHome = false;
            }
        });

        this.messageServiceSubscription = this.messageService.getMessage()
        .subscribe((message) =>
        {
            if (message.showLogin != null)
            {
                this.showLogin = message.showLogin;
            }
            else if (typeof message.user != 'undefined')
            {
                this.user = (message.user == null) ? null : {...message.user}
            }
        });
    }
    ngOnDestroy()
    {
        console.log('ngOnDestroy');
        this.messageServiceSubscription.unsubscribe();
    }
    ngDoCheck()
    {
        if (this.isMobileNavVisible)
        {
            document.querySelector('html').classList.add('noscroll');
            document.querySelector('body').classList.add('noscroll');
        }
        else
        {
            document.querySelector('html').classList.remove('noscroll');
            document.querySelector('body').classList.remove('noscroll');
        }
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
        this.authService.signOut();

    }
}
