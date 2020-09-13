import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { UtilsService } from '../../../../services/utils.service';
import { MetaService } from '@ngx-meta/core';

@Component({
  selector: 'app-yes',
  templateUrl: './yes.component.html',
  styleUrls: ['./yes.component.scss']
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
        this.meta.setTitle('Curso preparación First B2. Yes! La Academia de Inglés');
        this.meta.setTag('description', 'Aprueba el First Certificate en 3 meses con este curso de preparación de Yes! La Academia, verificada por Appcademos. Precio, horarios, beneficios...');
    }
    setHubspotForm()
    {
        if ((window as any).hbspt != undefined)
        {
            (window as any).hbspt.forms.create(
            {
                portalId: "4604246",
                formId: "c5a03014-2acb-4cdc-9110-7c9033d1a20d",
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
