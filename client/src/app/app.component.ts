import { Component, OnInit } from '@angular/core';
import { Router, Event,NavigationEnd } from '@angular/router';
declare var userAgent: any;

@Component(
{
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit
{
    currentUrl = null;
    title = 'Appcademos';

    constructor(private router: Router)
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
                    window.scrollTo(0, 0);
                    this.currentUrl = event.url;
                }
            }
        });
    }
    setIsIos()
    {
        if (userAgent.isIos())
            document.querySelector('html').classList.add('is-ios');
    }
}
