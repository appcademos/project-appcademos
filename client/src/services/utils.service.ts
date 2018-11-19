import { Injectable } from '@angular/core';
declare var $: any;

@Injectable()
export class UtilsService
{
    constructor() { }

    scrollToElement(selector: string, duration: number = 600)
    {
        $('html, body').animate(
        {
            scrollTop: $(selector).offset().top
        }, duration);
    }
}
