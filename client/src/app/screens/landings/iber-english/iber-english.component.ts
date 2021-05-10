import { Component, OnInit, Inject } from '@angular/core';
import { Location, DOCUMENT } from '@angular/common';
import { UtilsService } from '../../../../services/utils.service';
import { MetaService } from '@ngx-meta/core';
import { WindowRefService } from '../../../../services/windowRef.service'
import { Router } from '@angular/router'

@Component({
  selector: 'app-iber-english',
  templateUrl: './iber-english.component.html',
  styleUrls: ['../landings.component.scss']
})
export class IberEnglishComponent implements OnInit
{
    constructor(private location: Location,
                public utils: UtilsService,
                private meta: MetaService,
                private windowRefService: WindowRefService,
                private router: Router,
                @Inject(DOCUMENT) private document: Document)
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
        this.meta.setTag('description', 'Prepara tu examen de inglés Aptis con este curso online de la academia IberEnglish verificada por yinius. Niveles B1, B2 y C1. Precios, horarios...');
    }
    setHubspotForm()
    {
        if ((this.windowRefService.nativeWindow as any).hbspt != undefined)
        {
            (this.windowRefService.nativeWindow as any).hbspt.forms.create(
            {
                portalId: "4604246",
                formId: "e0c92e08-50ef-4632-a202-19cf0e972f58",
                target: "#landingForm",
                onFormReady: function()
                {
                    if (this.document.querySelector('#landingForm iframe'))
                        this.document.querySelector('#landingForm iframe').setAttribute('data-hj-allow-iframe', '');
                },
                onFormSubmitted: () =>
                {
                    this.location.go(this.router.url + '/form-enviado');
                } 
            });
        }
    }
    onClickSuperButton()
    {
        this.utils.scrollToElement('#landingForm', undefined, 40)
    }
}
