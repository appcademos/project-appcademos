import { Component, OnInit, ViewChild, HostListener, ElementRef } from '@angular/core';
import { CoursesService } from "../../services/courses.service";
import { Router } from "@angular/router";
import { UtilsService } from '../../services/utils.service';
import { SearchboxComponent } from '../searchbox/searchbox.component';
import { MetaService } from '@ngx-meta/core';
import { SeoService } from '../../services/seo.service';
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
    igPosts = []
    
    zipCode: string = null;
    heroCategorySearch: string = null;
    
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
        this.getIgPosts();
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
            this.router.navigate(["/cursos-ingles", query.toLowerCase()]);
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
        this.onClickHeroSearch();
    }
    onClickHeroSearch()
    {
        if (this.heroCategorySearch != null &&
            this.heroCategorySearch.length > 0)
        {
            this.findCourses(this.heroCategorySearch);
            
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
        this.seoService.setCanonical('https://www.appcademos.com');
    }
    removeMetaData()
    {
        this.meta.removeTag('name="description"');
        this.meta.removeTag('property="og:description"');
        this.seoService.removeCanonical();
    }
    
    getIgPosts()
    {
        this.IG_POSTS_IDS.forEach((igPostId) =>
        {
            this.getIgPostInfo(igPostId)
            .then(postData =>
            {
                if (postData != null)
                {
                    postData['id'] = igPostId;
                    postData['flipped'] = false;
                    this.igPosts.push(postData);
                    this.igPosts.sort((a, b) =>
                    {
                        if (a.id == this.IG_POSTS_IDS[0])
                            return -1;
                        else if (b.id == this.IG_POSTS_IDS[0])
                            return 1;
                        else if (a.id == this.IG_POSTS_IDS[2])
                            return 1;
                        else if (b.id == this.IG_POSTS_IDS[2])
                            return -1;
                    });
                }
            });
        });
    }
    getIgPostInfo(igPostId)
    {
        return new Promise((resolve, reject) =>
        {
            this.http
            .get(`https://api.instagram.com/oembed?url=http://instagr.am/p/${igPostId}/`)
            .map(res => res.json())
            .subscribe(
                data => resolve(data),
                err => resolve(null)
            );
        });
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
            return topBanner[0].clientHeight + ((window.innerWidth <= 688) ? 100 : 0) + 'px';
            
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
