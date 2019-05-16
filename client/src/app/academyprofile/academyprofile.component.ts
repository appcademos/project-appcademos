import { Component, OnInit } from '@angular/core';
import { AcademySessionService } from '../../services/academySession.service';
import { Router } from "@angular/router";

@Component({
  selector: 'app-academyprofile',
  templateUrl: './academyprofile.component.html',
  styleUrls: ['./academyprofile.component.scss']
})
export class AcademyprofileComponent implements OnInit
{
    academy = {}
    editingCourse = null;
    updatedCourses = []
    errorCourses = []

    constructor(private router: Router, public academyService: AcademySessionService)
    {

    }

    ngOnInit()
    {
        this.getAcademy();
    }

    getAcademy()
    {
        this.academyService.getAcademy()
        .subscribe(() =>
        {
            this.academy = {...this.academyService.academy};
        },
        error =>
        {
            alert(error.json().message);

            if (error.status == 401)
                this.router.navigate(["/academy"]);
        });
    }
    onClickCourse(course)
    {
        this.editingCourse = (this.editingCourse != null && this.editingCourse._id === course._id) ? null : course;
    }
    onCourseUpdated({ course })
    {
        this.updatedCourses.push(course._id);
        this.getAcademy();
    }
    onCourseError({ course })
    {
        this.errorCourses.push(course._id);
    }
    getCourseWasUpdated(course)
    {
        let courseWasUpdated = false;

        for (let i = 0; i < this.updatedCourses.length && !courseWasUpdated; i++)
        {
            if (this.updatedCourses[i] === course._id)
                courseWasUpdated = true;
        }

        return courseWasUpdated;
    }
    getCourseUpdatedError(course)
    {
        let courseError = false;

        for (let i = 0; i < this.updatedCourses.length && !courseError; i++)
        {
            if (this.errorCourses[i] === course._id)
                courseError = true;
        }

        return courseError;
    }
    logout()
    {
        this.academyService.logout()
        .subscribe(
            () =>
            {
                this.router.navigate(["/academy"]);
            },
            error =>
            {
                alert(error);
            }
        );
    }
}
