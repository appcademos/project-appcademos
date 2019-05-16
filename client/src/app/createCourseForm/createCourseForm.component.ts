import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CoursesService } from '../../services/courses.service';
import { Router } from "@angular/router";
import * as moment from 'moment';

@Component({
  selector: 'app-createCourseForm',
  templateUrl: './createCourseForm.component.html',
  styleUrls: ['./createCourseForm.component.scss']
})
export class CreateCourseFormComponent implements OnInit
{
    @Input() course: any;
    @Output() onCourseUpdated: EventEmitter<any> = new EventEmitter();
    @Output() onCourseError: EventEmitter<any> = new EventEmitter();

    price: Number;
    duration: String;
    oldPrice: Number;
    title: String;
    hours: Number;
    startDate: String;
    sizeClass: Number;
    description: String;
    tags: [String];

    constructor(public router: Router, private courseService: CoursesService) { }

    ngOnInit()
    {
        if (this.course)
        {
            this.title      = this.course.title;
            this.duration   = this.course.duration;
            this.hours      = this.course.hours;
            this.price      = this.course.price;
            this.oldPrice   = this.course.oldPrice;
            this.startDate  = moment(this.course.startDate).format('DD/MM/YYYY');
        }
    }

    validateCourse()
    {
        var allOk = true;

        if (this.title == null || this.title.length == 0)
        {
            allOk = false;
        }
        if (this.duration == null || this.duration.length == 0)
        {
            allOk = false;
        }
        if (this.hours == null || (this.hours + '').length == 0)
        {
            allOk = false;
        }
        if (this.price == null || (this.price + '').length == 0)
        {
            allOk = false;
        }
        if (this.startDate == null || this.startDate.length == 0 || !(/^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/).test('' + this.startDate))
        {
            allOk = false;
        }

        if (!allOk)
            alert('Rellena correctamente todos los datos');

        return allOk;
    }
    updateCourse()
    {
        if (this.validateCourse())
        {
            var courseToUpdate =
            {
                title: this.title,
                duration: this.duration,
                hours: this.hours,
                price: this.price,
                oldPrice: this.oldPrice,
                startDate: moment(this.startDate + '', 'DD/MM/YYYY').toISOString(),
                academy: this.course.academy
            }

            this.courseService.updateCourse(this.course._id, courseToUpdate)
            .subscribe(res =>
            {
                this.onCourseUpdated.emit({ course: { _id: this.course._id, ...courseToUpdate } });
                alert(res.message);
            },
            error =>
            {
                this.onCourseError.emit({ course: { _id: this.course._id, ...courseToUpdate } });
                alert(error.json().message);

                console.log(error);
            });
        }
    }
}
