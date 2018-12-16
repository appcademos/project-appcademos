import { Component, OnInit, ViewChild } from '@angular/core';
import { CoursesService } from "../../services/courses.service";
import { Router } from "@angular/router";
import { UtilsService } from '../../services/utils.service';
import { SearchboxComponent } from '../searchbox/searchbox.component';

const MOBILE_WIDTH = 870;

@Component(
{
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    providers: [UtilsService]
})

export class HomeComponent
{
    @ViewChild('searchbox') searchboxComponent: SearchboxComponent;

    featuredCourses: any;

    constructor(private courses: CoursesService, private router: Router, private utils: UtilsService)
    {
        this.courses.searching = true; // Prevent server delay from showing previous results on courses page
        this.courses.getAll()
        .subscribe(data =>
        {
            this.featuredCourses = this.courses.foundCourses.slice(0,6);
            console.log(this.featuredCourses);
        },
        error => console.log(error));

        document.addEventListener('click', this.onClickAnywhere.bind(this));
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
                this.searchboxComponent.focus();
            }, 0);
        }
    }

    onClickAnywhere(event)
    {
        if (!this.searchboxComponent.searchbox.nativeElement.contains(event.target))
            this.searchboxComponent.doHideSearchPanel();
    }
    onFocusSearchbox()
    {
        if (window.innerWidth <= MOBILE_WIDTH)
            this.utils.scrollToElement('#searchbox', 300, 20);
    }
}
