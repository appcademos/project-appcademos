import { Component, OnInit, Inject } from '@angular/core';
import { Location, DOCUMENT } from '@angular/common';
import { UtilsService } from '../../../../services/utils.service';
import { MetaService } from '@ngx-meta/core';
import { WindowRefService } from '../../../../services/windowRef.service'
import { Router } from '@angular/router'

@Component({
  selector: 'app-yes',
  templateUrl: './yes.component.html',
  styleUrls: ['../landings.component.scss']
})
export class YesComponent implements OnInit
{
    yesImages = [ 
        "https://lh5.googleusercontent.com/p/AF1QipMVt-9EYUIV8sKCQG3mTiyXmSVtjtKNEq3poxYr=s1536", 
        "https://lh5.googleusercontent.com/p/AF1QipOd9TPq-YAMU4nuS8lV5AguruO1E_26bN7c_tim=s1536", 
        "https://lh5.googleusercontent.com/p/AF1QipNvyojmWZPYEtg6bPY2wbpM9GgJjr4F1erBsIss=s1536", 
        "https://lh5.googleusercontent.com/p/AF1QipMoKwSa3n6HBHUvnurUlV56TnF9FcsJ0ajccVxG=s1536", 
        "https://lh5.googleusercontent.com/p/AF1QipMuaIXQ0N3QWHfN27fBKhni52T4UUosMK_81KrN=s1536"
    ]
    
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
        this.meta.setTitle('Curso preparación First B2. Yes! La Academia de Inglés');
        this.meta.setTag('description', 'Aprueba el First Certificate en 3 meses con este curso de preparación de Yes! La Academia, verificada por yinius. Precio, horarios, beneficios...');
    }
    setHubspotForm()
    {
        if ((this.windowRefService.nativeWindow as any).hbspt != undefined)
        {
            (this.windowRefService.nativeWindow as any).hbspt.forms.create(
            {
                portalId: "4604246",
                formId: "c5a03014-2acb-4cdc-9110-7c9033d1a20d",
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
