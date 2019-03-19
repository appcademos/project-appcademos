import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-cookies-box',
  templateUrl: './cookies-box.component.html',
  styleUrls: ['./cookies-box.component.scss']
})
export class CookiesBoxComponent implements OnInit
{
    show: boolean = false;

    constructor(private cookieService: CookieService)
    {

    }

    ngOnInit()
    {
        const cookiesAccepted = this.cookieService.get('cookies');

        if (cookiesAccepted != 'true')
            this.show = true;
    }

    onClickClose()
    {
        this.cookieService.set('cookies', 'true');
        this.show = false;
    }
}
