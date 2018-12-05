import { Component, ViewChild } from "@angular/core";
import { CoursesService } from "../../services/courses.service";
import { Router, ActivatedRoute } from "@angular/router";
import { SearchboxComponent } from '../searchbox/searchbox.component';
import { Location } from '@angular/common';

const ORDER_RELEVANCE = 1;
const ORDER_PRICE_DESCENDING = 2;
const ORDER_PRICE_ASCENDING = 3;

@Component({
  selector: "app-allCourses",
  templateUrl: "./allCourses.component.html",
  styleUrls: ["./allCourses.component.scss"]
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


    constructor(private courseService: CoursesService,
                private activatedRoute: ActivatedRoute,
                private router: Router,
                private location: Location)
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
}
