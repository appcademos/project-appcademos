import { Component, ViewChild, HostListener } from "@angular/core";
import { CoursesService } from "../../services/courses.service";
import { Router, ActivatedRoute } from "@angular/router";
import { SearchboxComponent } from '../searchbox/searchbox.component';
import { Location } from '@angular/common';
import { UtilsService } from '../../services/utils.service';

const ORDER_RELEVANCE = 1;
const ORDER_PRICE_DESCENDING = 2;
const ORDER_PRICE_ASCENDING = 3;

const MOBILE_WIDTH = 870;

@Component({
  selector: "app-allCourses",
  templateUrl: "./allCourses.component.html",
  styleUrls: ["./allCourses.component.scss"],
  providers: [UtilsService]
})
export class AllCoursesComponent
{
    @ViewChild('searchbox') searchboxComponent: SearchboxComponent;
    @ViewChild('orderbox') orderbox;

    allCourses = [];
    courses = [];
    orders =
    [
        { id: ORDER_RELEVANCE, name: 'Relevancia' },
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
                private utils: UtilsService)
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
                    if (params.course.length !== 0)
                    {
                        this.searchboxComponent.setInputValue(params.course);
                        this.findCourses(params.course);
                    }
                });
            }
            else
            {
                this.searchboxComponent.setInputValue('');
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
            case ORDER_RELEVANCE: this.courses = [...this.allCourses]; break;

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
        if (!this.orderbox.nativeElement.contains(event.target) && this.orderExpanded)
            this.orderExpanded = false;

        if (!this.searchboxComponent.searchbox.nativeElement.contains(event.target))
        {
            this.searchboxComponent.blur();
            this.searchboxComponent.doHideSearchPanel();
        }
    }
    onFocusSearchbox()
    {
        if (!this.showFixedSearchbar && window.innerWidth <= MOBILE_WIDTH)
            this.utils.scrollToElement('#searchbox', 300, 20);
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
            }
            else if (this.showFixedSearchbar)
            {
                this.showFixedSearchbar = false;
            }
        }
    }
}
