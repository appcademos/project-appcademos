import { Component, OnInit } from "@angular/core";
import { CoursesService } from "../../services/courses.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-displaySearchedCourses",
  templateUrl: "./displaySearchedCourses.component.html",
  styleUrls: ["./displaySearchedCourses.component.scss"]
})
export class DisplaySearchedCoursesComponent implements OnInit
{
    constructor(private courseService: CoursesService,
                private activatedRoute: ActivatedRoute)
    {

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
                        this.courseService.findCourses(params.course).subscribe();
                    }
                });
            }
            else
            {
                this.courseService.getAll().subscribe();
            }
        });
    }
}
