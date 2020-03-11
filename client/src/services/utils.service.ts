import { Injectable } from '@angular/core';
declare var $: any;
import * as moment from 'moment';

const RANDOM_DATE_START = new Date(2018, 0, 1);
const RANDOM_DATE_END = new Date();

export const NEIGHBORHOODS = [ 'Alcobendas', 'Arganzuela - Atocha', 'Barajas', 'Carabanchel', 'Centro', 'Ciudad Lineal', 'Chamartín', 'Chamberí - Ríos Rosas', 'Fuencarral - Bº del Pilar', 'Hortaleza', 'Latina', 'Moncloa - Argüelles', 'Moratalaz', 'Retiro', 'Salamanca', 'San Blas - Canillejas', 'Puente de Vallecas', 'Usera', 'Tetuán - Cuatro Caminos', 'Vicálvaro', 'Villa de Vallecas', 'Villaverde' ]

@Injectable()
export class UtilsService
{
    constructor() { }

    scrollToElement(selector: string, duration: number = 600, extraSpaceTop: number = 0)
    {
        if (selector != null && $(selector) != null && $(selector).length > 0)
        {
            $('html, body').animate(
            {
                scrollTop: $(selector).offset().top - extraSpaceTop
            }, duration);
        }
    }
    
    getNameInitials(name)
    {
        let initials = "";
        let words = name.split(" ");
        
        words.forEach((word) =>
        {    
            if (word != null && word.length > 2 && initials.length < 2)
            {
                initials += word.charAt(0).toUpperCase();
            }
        });
        
        return initials;
    }
    
    randomDate()
    {
        return moment(new Date(RANDOM_DATE_START.getTime() + Math.random() * (RANDOM_DATE_END.getTime() - RANDOM_DATE_START.getTime())));
    }
}
