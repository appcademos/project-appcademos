import { Component, OnInit, Inject } from '@angular/core';
import { Router, Event, NavigationEnd } from '@angular/router';
declare var userAgent: any;
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
                    this.windowRefService.nativeWindow.scrollTo(0, 0);
                    this.currentUrl = event.url;
                }
            }
        });
    }
    setIsIos()
    {
        if (userAgent.isIos())
            this.document.querySelector('html').classList.add('is-ios');
    }
}
