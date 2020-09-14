import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { UtilsService } from '../../../../services/utils.service';
import { MetaService } from '@ngx-meta/core';

@Component({
  selector: 'app-iber-english',
  templateUrl: './iber-english.component.html',
  styleUrls: ['../landings.component.scss']
})
export class IberEnglishComponent implements OnInit
{
    constructor(private location: Location,
                private utils: UtilsService,
                private meta: MetaService)
    {
        
    }
    
    ngOnInit()
    {
        this.setMetaData()
        this.setHubspotForm()        
    }
    
    setMetaData()
    {
        this.meta.setTitle('Curso Online preparación Aptis B1, B2 y C1. IberEnglish');
        this.meta.setTag('description', 'Prepara tu examen de inglés Aptis con este curso online de la academia IberEnglish verificada por Appcademos. Niveles B1, B2 y C1. Precios, horarios...');
    }
    setHubspotForm()
    {
        if ((window as any).hbspt != undefined)
        {
            (window as any).hbspt.forms.create(
            {
                portalId: "4604246",
                formId: "e0c92e08-50ef-4632-a202-19cf0e972f58",
                target: "#landingForm",
                onFormReady: function()
                {
                    if (document.querySelector('#landingForm iframe'))
                        document.querySelector('#landingForm iframe').setAttribute('data-hj-allow-iframe', '');
                },
                onFormSubmitted: () =>
                {
                    this.location.go(window.location.pathname + '/form-enviado');
                } 
            });
        }
    }
    onClickSuperButton()
    {
        this.utils.scrollToElement('#landingForm', undefined, 40)
    }
}
