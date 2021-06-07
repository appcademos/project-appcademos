import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from "@angular/router";
import { isPlatformBrowser } from "@angular/common";

@Component({
  selector: 'app-cookies-box',
  templateUrl: './cookies-box.component.html',
  styleUrls: ['./cookies-box.component.scss']
})
export class CookiesBoxComponent implements OnInit
{
    show: boolean = false;

    constructor(private router: Router,
                @Inject(PLATFORM_ID) private platformId: Object)
    {

    }

    ngOnInit()
    {
        const cookiesAccepted = (isPlatformBrowser(this.platformId)) ?
                                JSON.parse(localStorage.getItem('cookies'))
                                : false;

        if (cookiesAccepted != true)
            this.show = true;
    }

    onClickAccept()
    {
        localStorage.setItem('cookies', 'true');
        this.show = false;
    }
    onClickCancel()
    {
        this.router.navigate(['/cookie-policy']);
    }
    
    onClickClose()
    {
        localStorage.setItem('cookies', 'true');
        this.show = false;
    }
    
    isInCoursePage()
    {
        return this.router.url.indexOf('/course/') > -1;
    }
}
