import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit
{
    AB_TESTING_ENV = (window as any).__env.AB_TESTING_ENV;
    
    constructor() { }

    ngOnInit() { }
    
}
