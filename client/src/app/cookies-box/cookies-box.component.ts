import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from "@angular/router";

@Component({
  selector: 'app-cookies-box',
  templateUrl: './cookies-box.component.html',
  styleUrls: ['./cookies-box.component.scss']
})
export class CookiesBoxComponent implements OnInit
{
    show: boolean = false;

    constructor(private cookieService: CookieService,
                private router: Router)
    {

    }

    ngOnInit()
    {
        const cookiesAccepted = this.cookieService.get('cookies');

        if (cookiesAccepted != 'true')
            this.show = true;
    }

    onClickAccept()
    {
        this.cookieService.set('cookies', 'true');
        this.show = false;
    }
    onClickCancel()
    {
        this.router.navigate(['/cookie-policy']);
    }
}
