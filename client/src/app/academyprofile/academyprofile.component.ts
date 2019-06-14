import { Component, OnInit } from '@angular/core';
import { AcademySessionService } from '../../services/academySession.service';
import { Router } from "@angular/router";
import * as moment from 'moment';
declare var $: any;

@Component({
  selector: 'app-academyprofile',
  templateUrl: './academyprofile.component.html',
  styleUrls: ['./academyprofile.component.scss']
})
export class AcademyprofileComponent implements OnInit
{
    academy
    editingCourse = null;
    updatedCourses = []
    errorCourses = []
    selectedCourses = []
    showMultipleEditor = false;

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

        for (let i = 0; i < this.errorCourses.length && !courseError; i++)
        {
            if (this.errorCourses[i] === course._id)
                courseError = true;
        }

        return courseError;
    }
    formatDate(date)
    {
        let now = moment();
        let m = moment(date);
        let isToday = now.diff(m, 'days') === 0;

        return (isToday) ? 'hoy ' + m.format('HH:mm') : m.format('DD-MM-YYYY HH:mm');
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

    selectCourse(course, checked)
    {
        if (checked)
            this.selectedCourses.push({...course});
        else
            this.selectedCourses = this.selectedCourses.filter(c => c._id != course._id);
    }
    clearSelection()
    {
        this.selectedCourses = []
        $('.course input[type="checkbox"]').prop('checked', false);
    }
    onCoursesUpdated()
    {
        this.closeMultipleEditor();
        this.clearSelection();
    }
    closeMultipleEditor()
    {
        this.showMultipleEditor = false;
    }
}
