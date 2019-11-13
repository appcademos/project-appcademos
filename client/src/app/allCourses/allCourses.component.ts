import { Component, ViewChild, HostListener } from "@angular/core";
import { CoursesService } from "../../services/courses.service";
import { Router, ActivatedRoute } from "@angular/router";
import { SearchboxComponent } from '../searchbox/searchbox.component';
import { Location } from '@angular/common';
import { UtilsService } from '../../services/utils.service';
import { MetaService } from '@ngx-meta/core';

const ORDER_RELEVANCE = 1;
const ORDER_PRICE_DESCENDING = 2;
const ORDER_PRICE_ASCENDING = 3;

const MOBILE_WIDTH = 885;

@Component({
  selector: "app-allCourses",
  templateUrl: "./allCourses.component.html",
  styleUrls: ["./allCourses.component.scss"]
})
export class AllCoursesComponent
{
    @ViewChild('searchbox') searchboxComponent: SearchboxComponent;
    @ViewChild('fixedsearchbox') fixedSearchboxComponent: SearchboxComponent;
    @ViewChild('orderbox') orderbox;
    @ViewChild('fixedorderbox') fixedorderbox;

    allCourses = [];
    courses = [];
    orders =
    [
        { id: ORDER_RELEVANCE, name: 'Mejor valorados' },
        { id: ORDER_PRICE_DESCENDING, name: 'Precio (más alto arriba)' },
        { id: ORDER_PRICE_ASCENDING, name: 'Precio (más bajo arriba)' }
    ]
    currentOrder: any = this.orders[0];
    orderExpanded: boolean = false;
    searching: boolean = false;
    showFixedSearchbar: boolean = false;
    searchbarOffsetTop: number = undefined;


    constructor(private courseService: CoursesService,
                private activatedRoute: ActivatedRoute,
                private router: Router,
                private location: Location,
                private utils: UtilsService,
                private readonly meta: MetaService)
    {
        this.courseService.searching = true;

        document.addEventListener('click', this.onClickAnywhere.bind(this));
    }
    ngOnInit()
    {
        this.activatedRoute.url.subscribe(url =>
        {
            if (url[0].path !== "all")
            {
                this.activatedRoute.queryParams.subscribe(params =>
                {
                    this.setMetaData(false, params.course);
                    
                    if (params.course.length !== 0)
                    {
                        this.searchboxComponent.setInputValue(params.course);
                        this.fixedSearchboxComponent.setInputValue(params.course);
                        this.findCourses(params.course);
                    }
                });
            }
            else
            {
                this.setMetaData(true);
                this.searchboxComponent.setInputValue('');
                this.fixedSearchboxComponent.setInputValue('');
                this.findCourses(null, true);
            }
        });
    }
    ngAfterViewInit()
    {
        setTimeout(() =>
        {
            let theSearchView = <HTMLElement>document.getElementsByClassName('search-view')[0];
            this.searchbarOffsetTop = theSearchView.offsetTop + theSearchView.offsetHeight;
        });
    }
    ngOnDestroy()
    {
        this.removeMetaData();
    }

    findCourses(query, all = false)
    {
        if (!all)
        {
            if (query != null && query.trim().length > 0)
            {
                // Change the url
                this.router.navigate(['/search'], { queryParams: { course: query } });

                this.searching = true;
                setTimeout(() =>
                {
                    this.courseService.findCourses(query)
                    .subscribe(() =>
                    {    
                        this.allCourses = [...this.courseService.foundCourses];
                        this.courses = [...this.courseService.foundCourses];
                        this.orderBy(this.currentOrder);
                        this.searching = false;
                    });
                }, 250);
            }
            else
            {
                setTimeout(() =>
                {
                    this.searchboxComponent.focus();
                });
            }
        }
        else
        {
            this.searching = true;
            setTimeout(() =>
            {
                this.courseService.getAll()
                .subscribe(() =>
                {
                    this.allCourses = [...this.courseService.foundCourses];
                    this.courses = [...this.courseService.foundCourses];
                    this.orderBy(this.currentOrder);
                    this.searching = false;
                });
            }, 250);
        }
    }
    orderBy(order)
    {
        this.currentOrder = order;
        this.orderExpanded = false;

        switch (this.currentOrder.id)
        {
            case ORDER_RELEVANCE:
            this.courses = this.courses.sort((courseA, courseB) =>
            {
                if (courseA.academy.averageRating > courseB.academy.averageRating)
                    return -1;
                else if (courseA.academy.averageRating < courseB.academy.averageRating)
                    return 1;
                else
                {
                    if (courseA.academy.reviews.length > courseB.academy.reviews.length)
                        return -1;
                    else if (courseA.academy.reviews.length < courseB.academy.reviews.length)
                        return 1;
                    else
                    {
                        if (courseA.impressions > courseB.impressions)
                            return -1;
                        else if (courseA.impressions < courseB.impressions)
                            return 1;
                        else
                            return 0;
                    }
                }
            });
            break;

            case ORDER_PRICE_DESCENDING:
            this.courses = this.courses.sort((courseA, courseB) =>
            {
                if (courseA.price > courseB.price)
                    return -1;
                else if (courseA.price < courseB.price)
                    return 1;
                else
                    return 0;
            });
            break;

            case ORDER_PRICE_ASCENDING:
            this.courses = this.courses.sort((courseA, courseB) =>
            {
                if (courseA.price > courseB.price)
                    return 1;
                else if (courseA.price < courseB.price)
                    return -1;
                else
                    return 0;
            });
            break;
        }
    }
    onClickAnywhere(event)
    {
        if (!this.orderbox.nativeElement.contains(event.target) && !this.fixedorderbox.nativeElement.contains(event.target) && this.orderExpanded)
            this.orderExpanded = false;

        if (!this.searchboxComponent.searchbox.nativeElement.contains(event.target) &&
            !this.fixedSearchboxComponent.searchbox.nativeElement.contains(event.target))
        {
            this.searchboxComponent.blur();
            this.fixedSearchboxComponent.blur();
            this.searchboxComponent.doHideSearchPanel();
            this.fixedSearchboxComponent.doHideSearchPanel();
        }
    }
    onFocusSearchbox()
    {
        if (!this.showFixedSearchbar && window.innerWidth <= MOBILE_WIDTH)
            this.utils.scrollToElement('#searchbox', 300, 20);
    }
    
    setMetaData(isSearchingAllCourses: boolean, searchText?: string)
    {
        if (!isSearchingAllCourses && searchText != null)
        {
            this.meta.setTitle(`Comparador Cursos ${searchText} en Madrid | Appcademos`);
            this.meta.setTag('description', `Compara los cursos de ${searchText} de las mejores academias en Madrid.`);
        }
        else
        {
            this.meta.setTitle(`Comparador Cursos de Inglés en Madrid | Appcademos`);
            this.meta.setTag('description', `Compara los cursos de las mejores academias de Inglés en Madrid.`);
        }
    }
    removeMetaData()
    {
        this.meta.setTitle(null);
        this.meta.removeTag('name="description"');
        this.meta.removeTag('property="og:title"');
        this.meta.removeTag('property="og:description"');
    }

    @HostListener("window:scroll", [])
    onScroll()
    {
        if (this.searchbarOffsetTop != null)
        {
            let number = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

            if (number >= this.searchbarOffsetTop)
            {
                this.showFixedSearchbar = true;
                this.searchboxComponent.blur();
                this.searchboxComponent.doHideSearchPanel();
            }
            else if (this.showFixedSearchbar)
            {
                this.showFixedSearchbar = false;
                this.fixedSearchboxComponent.blur();
                this.fixedSearchboxComponent.doHideSearchPanel();
            }
        }
    }
}
