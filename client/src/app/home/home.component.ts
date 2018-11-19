import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CoursesService } from "../../services/courses.service";
import { Router } from "@angular/router";
import { UtilsService } from '../../services/utils.service';

@Component(
{
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    providers: [UtilsService]
})

export class HomeComponent implements OnInit
{
    @ViewChild('searchbox') searchbox: ElementRef;
    @ViewChild('searchInput') searchInput: ElementRef;

    query: String;
    featuredCourses: any;
    showSearchPanel: boolean;

    constructor(private courses: CoursesService, private router: Router, private utils: UtilsService)
    {
        this.courses.searching = true; // Prevent server delay from showing previous results on courses page
        this.courses.getAll()
        .subscribe(data =>
        {
            this.featuredCourses = this.courses.foundCourses.slice(0,6);
        },
        error => console.log(error));

        document.addEventListener('click', this.onClickAnywhere.bind(this));
    }
    ngOnInit() { }

    findCourses()
    {
        if (this.query && this.query.length > 0)
        {
            this.router.navigate(["/search"],
            {
                queryParams: { course: this.query.toLowerCase() }
            });
        }
        else
        {
            setTimeout(() =>
            {
                this.searchInput.nativeElement.focus();
            }, 0);
        }
    }

    doShowSearchPanel()
    {
        this.showSearchPanel = true;
    }
    doHideSearchPanel()
    {
        this.showSearchPanel = false;
    }

    onClickAnywhere(event)
    {
        if (!this.searchbox.nativeElement.contains(event.target))
            this.doHideSearchPanel();
    }
    onInputPressEsc()
    {
        this.doHideSearchPanel();
        this.searchInput.nativeElement.blur();
    }
}
