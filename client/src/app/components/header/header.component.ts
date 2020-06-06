import { Component, OnInit, OnDestroy } from "@angular/core";
import { AcademySessionService } from "../../../services/academySession.service";
import { UserSessionService } from "../../../services/userSession.service";
import { Router, Event, NavigationEnd, UrlSerializer } from "@angular/router";
import { MessageService } from '../../../services/message.service';
import { Subscription } from 'rxjs';
import { AuthService } from "angularx-social-login";
import { UtilsService } from '../../../services/utils.service';

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
    isHome: boolean = false
    isMobileNavVisible: boolean = false
    showLogin: boolean = false
    showFavoritesLogin: boolean = false
    user: any
    selectedCategory: string;
    showFavoritesTutorial: boolean = false

    messageServiceSubscription: Subscription;

    constructor(private router: Router,
                private urlSerializer: UrlSerializer,
                private academyService: AcademySessionService,
                private userService: UserSessionService,
                private messageService: MessageService,
                private authService: AuthService,
                private utils: UtilsService)
    {

    }

    ngOnInit()
    {
        this.user = this.userService.user;

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
                    
                if (window.location.pathname.indexOf("/cursos-ingles") === -1)
                    this.selectedCategory = null;
                else
                {
                    let urlTree = this.urlSerializer.parse(this.router.url);
                    let urlTreeSegments = urlTree.root.children.primary.segments;
                    let categoryUrl = urlTreeSegments[urlTreeSegments.length-1].path;
                    let categoryQuery = this.utils.urlCategoryToQuery(categoryUrl);
                    
                    if (window.location.pathname.indexOf("/cursos-ingles") > -1 &&
                        categoryQuery != null &&
                        categoryQuery.length > 0)
                    {
                        this.selectedCategory = categoryQuery;
                    }
                }
            }
        });

        this.setMessagesListener()
    }
    ngOnDestroy()
    {
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
        if (!this.utils.isMobileWidth())
            this.isMobileNavVisible = false;
    }
    
    isLinkActive(category): boolean
    {
        return category === this.selectedCategory;
    }
    
    showFullBlogTitle()
    {
        return (window.innerWidth > 978)
    }
    
    setMessagesListener()
    {
        this.messageServiceSubscription = this.messageService.getMessage()
        .subscribe((message) =>
        {
            if (message.showLogin != null)
            {
                this.showLogin = message.showLogin
            }
            else if (message.showFavoritesLogin != null)
            {
                this.showFavoritesLogin = message.showFavoritesLogin
            }
            else if (message.showFavoritesTutorial != null)
            {
                this.showFavoritesTutorial = message.showFavoritesTutorial
            }
            else if (typeof message.user != 'undefined')
            {
                this.user = (message.user == null) ? null : {...message.user}
            }
        })
    }

    logout()
    {
        this.userService.logout().subscribe();
        this.authService.signOut();
    }
}