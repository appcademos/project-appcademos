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
    goToEditCourse(course)
    {
        this.editingCourse = course;
        window.scrollTo(0,0);
    }
    goBackToCourses()
    {
        this.editingCourse = null;
        window.scrollTo(0,0);
        this.getAcademy();
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
