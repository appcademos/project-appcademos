import { Injectable } from '@angular/core';
declare var $: any;
import * as moment from 'moment';
import { WindowRefService } from './windowRef.service'

const RANDOM_DATE_START = new Date(2018, 0, 1);
const RANDOM_DATE_END = new Date();

export const NEIGHBORHOODS =
[
  "Alcalá de Henares",
  "Alcobendas",
  "Alcorcón",
  "Algete",
  "Aljavir",
  "Alpedrete",
  "Aluche",
  "Arganda del Rey",
  "Arganzuela - Atocha",
  "Barajas",
  "Barcelona",
  "Boadilla del Monte",
  "Brunete",
  "Carabanchel",
  "Centro",
  "Cercedilla",
  "Chamartín",
  "Chamberí - Ríos Rosas",
  "Ciudad Lineal",
  "Cobeña",
  "Collado Mediano",
  "Collado Villalba",
  "Coslada",
  "El Escorial",
  "El Molar",
  "Fuencarral - Bº del Pilar",
  "Fuenlabrada",
  "Getafe",
  "Guadalajara",
  "Hortaleza",
  "Las Rozas",
  "Latina",
  "Leganés",
  "Majadahonda",
  "Mejorada del Campo",
  "Moncloa - Argüelles",
  "Moratalaz",
  "Móstoles",
  "Moraleja de Enmedio",
  "Parla",
  "Perales de Tajuña",
  "Pozuelo de Alarcón",
  "Puente de Vallecas",
  "Retiro",
  "Rivas Vaciamadrid",
  "Salamanca",
  "San Agustín del Guadalix",
  "San Blas - Canillejas",
  "San Fernando de Henares",
  "San Sebastián de los Reyes",
  "Segovia",
  "Sevilla la Nueva",
  "Talavera de la Reina",
  "Tetuán - Cuatro Caminos",
  "Toledo",
  "Torrejón de Ardoz",
  "Torrelodones",
  "Tres Cantos",
  "Usera",
  "Valverde",
  "Vicálvaro",
  "Villa de Vallecas",
  "Villarejo de Salvanés",
  "Villaverde",
  "Villaviciosa de Odón"
]
export const MOBILE_WIDTH = 786;

@Injectable()
export class UtilsService
{
    constructor(private windowRefService: WindowRefService) { }

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
    
    urlCategoryToQuery(urlCategory)
    {
        let queryCategory = null;
        
        if (urlCategory != null)
            queryCategory = urlCategory.replace('-certificate','')
                                        .replace(/-/g, ' ');
                                        
        return queryCategory;
    }
    queryCategoryToUrl(queryCategory)
    {
        let urlCategory = null;
        
        if (queryCategory != null)
        {
            urlCategory = queryCategory.replace(/ /g, '-').toLowerCase();
            if (queryCategory === 'first')
                urlCategory = 'first-certificate';
        }
                                        
        return urlCategory;
    }
    
    isMobileWidth()
    {
        return (this.windowRefService.nativeWindow.innerWidth <= MOBILE_WIDTH)
    }
}
