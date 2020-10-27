import { Component, OnInit, ViewChild, HostListener, ElementRef } from '@angular/core';
import { CoursesService } from "../../../services/courses.service";
import { Router } from "@angular/router";
import { UtilsService } from '../../../services/utils.service';
import { SearchboxComponent } from '../../components/searchbox/searchbox.component';
import { MetaService } from '@ngx-meta/core';
import { SeoService } from '../../../services/seo.service';
import { Http } from "@angular/http";
import { Observable } from "rxjs/Rx";

@Component(
{
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})

export class HomeComponent
{
    @ViewChild('searchbox') searchboxComponent: SearchboxComponent;
    @ViewChild('fixedsearchbox') fixedSearchboxComponent: SearchboxComponent;

    showFixedSearchbar: boolean = false;
    heroHeight: number = undefined;
    igPosts =
    [
        {
            id: 'BynuXCSC3Ay',
            title: "Jorge Varadé: “Quería irme a currar a Londres. Tenía el inglés un poco oxidado y tenía que mejorar mi conversación, principalmente. Con @appcademos encontré una academia de inglés en Madrid que le daba bastante caña al speaking. Justo lo que necesitaba, y sin tener que pelearme con Google buscando academia. Ahora estoy currando en Londres así que misión cumplida!!” 🚀 - @jorgevarade thanxxs por compartir tu historia con nosotros ❤️ Descubre más de Jorge en LinkedIn: https://www.linkedin.com/in/jorgevarade/ - Menciona a tu amig@ que quiere irse a trabajar a London 🇬🇧👇🏼",
            thumbnail_url: "https://instagram.fmad12-2.fna.fbcdn.net/v/t51.2885-15/sh0.08/e35/p640x640/61940878_454976271904469_1166529479463126156_n.jpg?_nc_ht=instagram.fmad12-2.fna.fbcdn.net&_nc_cat=105&_nc_ohc=udrMdY0akZgAX--RU5J&_nc_tp=25&oh=a83bf151ef2d1bac22cc4521c3a2db37&oe=5FBF1FF9",
            flipped: false
        },
        {
            id: 'B0EAJn4CcZi',
            title: "Laura González: “Al terminar la carrera quería seguir estudiando y hacer un máster en ICAI. Me pedían certificar un nivel C1 de inglés. Una amiga me habló de @appcademos para encontrar mi academia de inglés. Encontré una cerca de casa para sacarme el Advanced y aplicar al máster.” - Thanksss por compartir tu historia @lauralegall ❤️ - Menciona a tus amig@s que quieren hacer un máster al acabar la uni 👇🏼",
            thumbnail_url: "https://instagram.fmad12-2.fna.fbcdn.net/v/t51.2885-15/sh0.08/e35/p640x640/65721082_503993930162354_1826454194192164395_n.jpg?_nc_ht=instagram.fmad12-2.fna.fbcdn.net&_nc_cat=102&_nc_ohc=_0LilvJ6v-IAX9mQZkB&_nc_tp=25&oh=9f7a732037ab9dab004af9e046ead87a&oe=5FBC1E9F",
            flipped: false
        },
        {
            id: 'B1ohkcPCc6G',
            title: "Lucia del Caz: “¿Alguna vez te ha pasado que un día cualquiera tomas una decisión que cambia tu vida de los próximos meses por completo? A mi sí jajaja. Un día hablando con una amiga salió el tema de lo guay que sería irse a vivir a Australia. Ese mismo día decidimos irnos. Tal cual. Luego vinieron los trámites del visado y tal. Me pedían una puntuación de 4.5 en el IELTS y no estaba muy enterada de cómo funcionaba el examen. Hablé con @appcademos y me explicaron que había 2 tipos de IELTS: Academic y General Training. En mi caso, yo quería trabajar en Australia, y me recomendaron hacer el General Training. En la web de @appcademos pude comparar entre varias academias para prepararme el examen y elegir la que más me gustaba.” - “A día de hoy ya tengo el IELTS con la puntuación que me pedían y dentro de un mes… AUSTRALIA!” - @luciadelcaz Thanks por compartir tu historia ❤️ - Descubre más del perfil de Lucía en LinkedIn 👉🏼https://www.linkedin.com/in/lucia-del-caz-pérez-552923153",
            thumbnail_url: "https://instagram.fmad12-2.fna.fbcdn.net/v/t51.2885-15/sh0.08/e35/p640x640/67968826_2511231975601878_3692518725000312105_n.jpg?_nc_ht=instagram.fmad12-2.fna.fbcdn.net&_nc_cat=106&_nc_ohc=iUQ8uTP3drkAX9aBxrl&_nc_tp=25&oh=9dc3f50a36482087f34867b27e1a850e&oe=5FBBFDEA",
            flipped: false
        }
    ]
    
    zipCode: string = null;
    heroCategorySearch: string = null;
    modality: string = null;
    
    IG_POSTS_IDS = ['BynuXCSC3Ay', 'B0EAJn4CcZi', 'B1ohkcPCc6G']

    constructor(private courses: CoursesService,
                private router: Router,
                private utils: UtilsService,
                private readonly meta: MetaService,
                private seoService: SeoService,
                private http: Http)
    {
        document.addEventListener('click', this.onClickAnywhere.bind(this));
    }
    ngOnInit()
    {
        this.setMetaData();
        //this.getIgPosts();
    }
    ngAfterViewInit()
    {
        setTimeout(() =>
        {
            let hero = <HTMLElement>document.getElementById('hero');
            this.heroHeight = hero.offsetHeight;
        });
    }
    ngOnDestroy()
    {
        this.removeMetaData();
    }

    findCourses(query, modality)
    {
        if (query && query.length > 0)
        {
            this.router
            .navigate(["/cursos-ingles", query.toLowerCase()],
                        { queryParams: { modalidad: modality } });
        }
        else
        {
            setTimeout(() =>
            {
                if (this.showFixedSearchbar)
                    this.fixedSearchboxComponent.focus();
                else
                    this.searchboxComponent.focus();
            }, 0);
        }
    }

    onClickAnywhere(event)
    {
        if (!this.searchboxComponent.searchbox.nativeElement.contains(event.target) &&
            !this.fixedSearchboxComponent.searchbox.nativeElement.contains(event.target))
        {
            this.searchboxComponent.doHideSearchPanel();
            this.fixedSearchboxComponent.doHideSearchPanel();
        }
    }
    onClickScrollToContact()
    {
        this.utils.scrollToElement('footer');
    }
    onClickedHeroSearchCategory($event)
    {
        this.heroCategorySearch = $event;
        
        if (this.modality != null)
        {
            setTimeout(() =>
            {
                this.onClickHeroSearch()
            }, 500)
        }
    }
    onClickModality(modality)
    {
        this.modality = modality
        setTimeout(() =>
        {
            this.onClickHeroSearch()
        }, 500)
    }
    onClickHeroSearch()
    {
        if (this.heroCategorySearch != null &&
            this.heroCategorySearch.length > 0)
        {
            this.findCourses(this.heroCategorySearch, this.modality);
            
            if ((window as any).dataLayer != null &&
                this.zipCode != null &&
                this.zipCode.length > 0)
            {
                (window as any).dataLayer.push(
                {
                    'event': 'zipCodeSearch',
                    'zipCode': this.zipCode
                });
            }
        }
        else
        {
            setTimeout(() =>
            {
                this.searchboxComponent.doShowSearchPanel();
            });
        }
    }

    setMetaData()
    {
        this.meta.setTag('description', `Compara las opiniones de otros alumnos que han ido al curso antes que tú y reserva tu plaza gratuitamente desde la web.`);
        this.seoService.setCanonical('https://www.yinius.es');
    }
    removeMetaData()
    {
        this.meta.removeTag('name="description"');
        this.meta.removeTag('property="og:description"');
        this.seoService.removeCanonical();
    }
    
    onClickFlipIgPost(igPost, event)
    {
        event.stopPropagation();
        this.igPosts.forEach(post => post.flipped = false);
        igPost.flipped = true;
    }
    
    getTopBannerHeight()
    {
        let topBanner = document.querySelectorAll('#top-banner');
        
        if (topBanner != null && topBanner.length > 0)
            return topBanner[0].clientHeight + 'px';
            
        return '';
    }

    @HostListener("window:scroll", [])
    onScroll()
    {
        if (this.heroHeight != null)
        {
            let number = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

            if (number >= this.heroHeight)
            {
                this.showFixedSearchbar = true;
            }
            else if (this.showFixedSearchbar)
            {
                this.showFixedSearchbar = false;
                this.fixedSearchboxComponent.doHideSearchPanel();
            }
        }
    }
}
