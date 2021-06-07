import { Component, OnInit, Inject } from '@angular/core';
import { Router, Event, NavigationEnd } from '@angular/router';
import { WindowRefService } from '../services/windowRef.service'
import { DOCUMENT } from '@angular/common'

@Component(
{
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit
{
    currentUrl = null;

    constructor(private router: Router,
                private windowRefService: WindowRefService,
                @Inject(DOCUMENT) private document: Document)
    {
        this.scrollToTopOnRouteChange();
        this.setIsIos();
    }
    ngOnInit()
    {

    }

    scrollToTopOnRouteChange()
    {
        this.router.events.subscribe((event: Event) =>
        {
            if (event instanceof NavigationEnd)
            {
                if (event.url != this.currentUrl)
                {
                    if (this.windowRefService.nativeWindow.scrollTo)
                        this.windowRefService.nativeWindow.scrollTo(0,0);
                    this.currentUrl = event.url;
                }
            }
        });
    }
    isIos()
    {
        return [
            'iPad Simulator',
            'iPhone Simulator',
            'iPod Simulator',
            'iPad',
            'iPhone',
            'iPod'
        ].includes(this.windowRefService.nativeWindow.navigator.platform)
        // iPad on iOS 13 detection
        || (this.windowRefService.nativeWindow.navigator.userAgent.includes("Mac") && "ontouchend" in this.document)
    }
    setIsIos()
    {
        setTimeout(() =>
        {
            if (this.isIos())
                this.document.querySelector('html').classList.add('is-ios');
        })
    }
}
