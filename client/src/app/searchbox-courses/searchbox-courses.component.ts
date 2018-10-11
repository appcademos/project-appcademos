import { Component, OnInit } from "@angular/core";
import { environment } from "../../environments/environment";
import { CoursesService } from "../../services/courses.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-searchbox-courses",
  templateUrl: "./searchbox-courses.component.html",
  styleUrls: ["./searchbox-courses.component.scss"]
})
export class SearchboxCoursesComponent implements OnInit
{
    searchcourses: String;

    constructor(private courses: CoursesService, private router: Router)
    {
        // Prevent server delay from showing previous results on courses page
        this.courses.searching = true;
    }

    ngOnInit() {}

    findCourses()
    {
        if (this.searchcourses)
        {
            this.searchcourses = this.searchcourses.toLowerCase();
            this.router.navigate(["/search"],
            {
                queryParams: { course: this.searchcourses }
            });
        }
        else
        {
            this.router.navigate(["/all"]);
        }
    }
}
