import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable()
export class SeoService { 

  constructor(@Inject(DOCUMENT) private doc) {}

  setCanonical(url)
  {
     let link: HTMLLinkElement = this.doc.createElement('link');
     link.setAttribute('rel', 'canonical');
     this.doc.head.appendChild(link);
     link.setAttribute('href', url);
   }
   removeCanonical()
   {
        Array
        .from(this.doc.querySelectorAll('*[rel="canonical"]'))
        .forEach((el) =>
        {
            if (el != null)
                (el as any).remove()
        });
   }
} 