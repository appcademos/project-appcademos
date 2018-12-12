import { Injectable } from '@angular/core';
declare var $: any;

@Injectable()
export class UtilsService
{
    constructor() { }

    scrollToElement(selector: string, duration: number = 600, extraSpaceTop: number = 0)
    {
        $('html, body').animate(
        {
            scrollTop: $(selector).offset().top - extraSpaceTop
        }, duration);
    }
}
