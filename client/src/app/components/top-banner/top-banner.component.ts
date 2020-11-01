import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-top-banner',
  templateUrl: './top-banner.component.html',
  styleUrls: ['./top-banner.component.scss']
})
export class TopBannerComponent implements OnInit
{
    visible = true;
    
    constructor() { }

    ngOnInit()
    {
        
    }
}
