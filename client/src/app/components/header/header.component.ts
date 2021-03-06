import { Component, OnInit, OnDestroy, Inject } from "@angular/core";
import { DOCUMENT } from "@angular/common"
import { AcademySessionService } from "../../../services/academySession.service";
import { UserSessionService } from "../../../services/userSession.service";
import { Router, Event, NavigationEnd, UrlSerializer } from "@angular/router";
import { MessageService } from '../../../services/message.service';
import { Subscription } from 'rxjs';
import { SocialAuthService } from "angularx-social-login";
import { UtilsService } from '../../../services/utils.service';
import { WindowRefService } from '../../../services/windowRef.service'

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
    
    isLandingPage: boolean = false
    landingUris = [ 'curso-first-certificate/yes-academia-ingles-madrid', 'curso-online-aptis/academia-ingles-iberenglish' ]

    messageServiceSubscription: Subscription;

    constructor(private router: Router,
                private urlSerializer: UrlSerializer,
                private academyService: AcademySessionService,
                private userService: UserSessionService,
                private messageService: MessageService,
                private authService: SocialAuthService,
                private utils: UtilsService,
                private windowRefService: WindowRefService,
                @Inject(DOCUMENT) private document: Document)
    {
        this.isLandingPage = this.landingUris.some((uri) => this.router.url.indexOf(uri) > -1)
    
        router.events.subscribe((val) =>
        {
            if (val instanceof NavigationEnd)
            {
                this.isLandingPage = this.landingUris.some((uri) => this.router.url.indexOf(uri) > -1)
            }
        });
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
                    
                if (this.router.url.indexOf("/cursos-ingles") === -1)
                    this.selectedCategory = null;
                else
                {
                    let urlTree = this.urlSerializer.parse(this.router.url);
                    let urlTreeSegments = urlTree.root.children.primary.segments;
                    let categoryUrl = urlTreeSegments[urlTreeSegments.length-1].path;
                    let categoryQuery = this.utils.urlCategoryToQuery(categoryUrl);
                    
                    if (this.router.url.indexOf("/cursos-ingles") > -1 &&
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
            this.document.querySelector('html').classList.add('noscroll');
            this.document.querySelector('body').classList.add('noscroll');
        }
        else
        {
            this.document.querySelector('html').classList.remove('noscroll');
            this.document.querySelector('body').classList.remove('noscroll');
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
        return (this.windowRefService.nativeWindow.innerWidth > 978)
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
    
    getTopBannerHeight()
    {
        let topBanner = this.document.querySelectorAll('#top-banner');
        
        if (topBanner != null && topBanner.length > 0)
            return topBanner[0].clientHeight + 'px';
            
        return '';
    }

    logout()
    {
        this.userService.logout().subscribe();
        this.authService.signOut();
    }
}
