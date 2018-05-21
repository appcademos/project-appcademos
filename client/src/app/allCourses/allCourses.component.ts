import { Component, OnInit } from "@angular/core";
import { CoursesService } from "../../services/courses.service";

@Component({
  selector: "app-allCourses",
  templateUrl: "./allCourses.component.html",
  styleUrls: ["./allCourses.component.scss"]
})
export class AllCoursesComponent implements OnInit {
  select: Array<any> = [];

  public isCollapsed = true;

  constructor(private courseService: CoursesService) {
    this.courseService.searching = true;
    this.select = ["Precio", "type2", "type3"];
  }

  setFilter(value) {
    if (value) {
      this.courseService.setSearchValue(value);
    }
  }
  ngOnInit() {}
}
