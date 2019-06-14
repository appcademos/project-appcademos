import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { CoursesService } from "../../services/courses.service";
import { Router } from "@angular/router";
import { UtilsService } from '../../services/utils.service';
import { SearchboxComponent } from '../searchbox/searchbox.component';
import { MetaService } from '@ngx-meta/core';
import { SeoService } from '../../services/seo.service';

const MOBILE_WIDTH = 870;

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

    constructor(private courses: CoursesService,
                private router: Router,
                private utils: UtilsService,
                private readonly meta: MetaService,
                private seoService: SeoService)
    {
        document.addEventListener('click', this.onClickAnywhere.bind(this));
    }
    ngOnInit()
    {
        this.setMetaData();
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

    findCourses(query)
    {
        if (query && query.length > 0)
        {
            this.router.navigate(["/search"],
            {
                queryParams: { course: query.toLowerCase() }
            });
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
    onFocusSearchbox()
    {
        if (!this.showFixedSearchbar && window.innerWidth <= MOBILE_WIDTH)
            this.utils.scrollToElement('#searchbox', 300, 20);
    }
    onClickScrollToContact()
    {
        this.utils.scrollToElement('footer');
    }

    setMetaData()
    {
        this.meta.setTag('description', `Compara las opiniones de otros alumnos que han ido al curso antes que tú y reserva tu plaza gratuitamente desde la web.`);
        this.seoService.setCanonical('https://www.appcademos.com');
    }
    removeMetaData()
    {
        this.meta.removeTag('name="description"');
        this.meta.removeTag('property="og:description"');
        this.seoService.removeCanonical();
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
