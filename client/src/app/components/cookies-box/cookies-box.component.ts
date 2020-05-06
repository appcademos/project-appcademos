import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-cookies-box',
  templateUrl: './cookies-box.component.html',
  styleUrls: ['./cookies-box.component.scss']
})
export class CookiesBoxComponent implements OnInit
{
    show: boolean = false;

    constructor(private router: Router)
    {

    }

    ngOnInit()
    {
        const cookiesAccepted = JSON.parse(localStorage.getItem('cookies'));

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
        return window.location.href.indexOf('/course/') > -1;
    }
}
