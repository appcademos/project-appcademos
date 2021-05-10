import { Component, OnInit, Inject } from '@angular/core';
import { Location, DOCUMENT } from '@angular/common';
import { Router } from '@angular/router'
import { WindowRefService } from '../../../services/windowRef.service'

@Component({
  selector: 'app-estudio-personalizado',
  templateUrl: './estudio-personalizado.component.html',
  styleUrls: ['./estudio-personalizado.component.scss']
})
export class EstudioPersonalizadoComponent implements OnInit
{
    constructor(private location: Location,
                private router: Router,
                private windowRefService: WindowRefService,
                @Inject(DOCUMENT) private document: Document) {  }

    ngOnInit()
    {        
        if ((this.windowRefService.nativeWindow as any).hbspt != undefined)
        {
            (this.windowRefService.nativeWindow as any).hbspt.forms.create(
            {
                portalId: "4604246",
                formId: "c2690194-2d4e-44c3-84a4-bbd7d4601fff",
                target: "#estudioPersonalizado",
                onFormReady: function()
                {
                    this.document.querySelector('#estudioPersonalizado iframe').setAttribute('data-hj-allow-iframe', '');
                },
                onFormSubmitted: () =>
                {
                    this.location.go(this.router.url + '/formulario-completado');
                } 
            });
        }
    }
}
