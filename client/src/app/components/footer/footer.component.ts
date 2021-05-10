import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from "@angular/router";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit
{    
    isLandingPage: boolean = false
    landingUris = [ 'curso-first-certificate/yes-academia-ingles-madrid', 'curso-online-aptis/academia-ingles-iberenglish' ]
    
    constructor(private router: Router)
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

    ngOnInit() { }
    
}
