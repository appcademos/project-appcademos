import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-estudio-personalizado',
  templateUrl: './estudio-personalizado.component.html',
  styleUrls: ['./estudio-personalizado.component.scss']
})
export class EstudioPersonalizadoComponent implements OnInit
{
    constructor() {}

    ngOnInit()
    {
        /*if ((window as any).hbspt != undefined)
        {
            (window as any).hbspt.forms.create(
            {
                portalId: "4604246",
                formId: "c2690194-2d4e-44c3-84a4-bbd7d4601fff",
                target: "#estudioPersonalizado",
                onFormReady: function()
                {
                    document.querySelector('#estudioPersonalizado iframe').setAttribute('data-hj-allow-iframe', '');
                }
            });
        }*/
    }
}
