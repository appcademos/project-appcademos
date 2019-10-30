import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CoursesService } from '../../../services/courses.service';
import { CategoriesService } from '../../../services/categories.service';
import { Router } from "@angular/router";
import * as moment from 'moment';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzNotificationService } from 'ng-zorro-antd';

@Component({
  selector: 'app-createCourseForm',
  templateUrl: './createCourseForm.component.html',
  styleUrls: ['./createCourseForm.component.scss']
})
export class CreateCourseFormComponent implements OnInit
{
    @Input() course: any;
    @Input() courses: any;
    @Output() onCourseUpdated: EventEmitter<any> = new EventEmitter();
    @Output() onCourseError: EventEmitter<any> = new EventEmitter();
    @Output() onCoursesUpdated: EventEmitter<any> = new EventEmitter();

    price: Number;
    duration: String;
    oldPrice: Number;
    title: String;
    hours: Number;
    startDate: String;
    isBooked: boolean;
    videoUrl: String;
    sizeClass: Number;
    description: String;
    tags: [String];
    categoryId: String;

    numCoursesUpdated = 0;
    
    categories = null;

    constructor(public router: Router,
                private courseService: CoursesService,
                private categoriesService: CategoriesService,
                private notifications: NzNotificationService) { }

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
            this.isBooked   = this.course.isBooked ? this.course.isBooked : false;
            this.videoUrl   = this.course.videoUrl;
            this.categoryId = this.course.category._id;
        }
        else
        {
            this.isBooked = false;
        }
        
        this.getCategories();
    }
    
    onChangeIsBooked(checked)
    {
        this.isBooked = checked;
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
        if (this.categoryId == null || this.categoryId.length == 0)
        {
            allOk = false;
        }

        if (!allOk)
            alert('Rellena correctamente todos los datos');

        return allOk;
    }
    updateCourse()
    {
        if (this.courses != null && this.courses.length > 1)
        {
            var courseDataToUpdate: any = {}

            if (this.title != null && this.title.trim().length > 0)
                courseDataToUpdate.title = this.title.trim();

            if (this.duration != null && this.duration.trim().length > 0)
                courseDataToUpdate.duration = this.duration.trim();

            if (this.hours != null && (this.hours + '').length > 0)
                courseDataToUpdate.hours = this.hours;

            if (this.price != null && (this.price + '').length > 0)
                courseDataToUpdate.price = this.price;

            if (this.oldPrice != null && (this.oldPrice + '').length > 0)
                courseDataToUpdate.oldPrice = this.oldPrice;

            if (this.startDate != null && this.startDate.trim().length > 0)
                courseDataToUpdate.startDate = moment(this.startDate + '', 'DD/MM/YYYY').toISOString();
        
            if (this.isBooked != null)
                courseDataToUpdate.isBooked = this.isBooked;
                
            if (this.videoUrl != null && this.videoUrl.trim().length > 0)
                courseDataToUpdate.videoUrl = this.videoUrl.trim();
                
            if (this.categoryId != null && (this.categoryId + '').length > 0)
                courseDataToUpdate.category = this.categoryId;
            

            for (let i = 0; i < this.courses.length; i++)
            {
                let course = this.courses[i];

                this.courseService.updateCourse(course._id, courseDataToUpdate)
                .subscribe(res =>
                {
                    this.onCourseUpdated.emit({ course: { _id: course._id, ...courseToUpdate } });
                    this.numCoursesUpdated++;
                    if (this.numCoursesUpdated === this.courses.length)
                    {
                        this.numCoursesUpdated = 0;
                        this.onCoursesUpdated.emit();
                        
                        this.resetCourseData();
                    }
                },
                error =>
                {
                    this.onCourseError.emit({ course: { _id: course._id, ...courseToUpdate } });
                    this.numCoursesUpdated++;
                    if (this.numCoursesUpdated === this.courses.length)
                    {
                        this.numCoursesUpdated = 0;
                        this.onCoursesUpdated.emit();
                    }

                    console.log(error);
                    this.showCourseUpdatedErrorNotification(course);
                });
            }
        }
        else
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
                    academy: this.course.academy,
                    isBooked: this.isBooked,
                    videoUrl: (this.videoUrl != null && this.videoUrl.trim().length > 0) ? this.videoUrl : null,
                    category: this.categoryId
                }

                this.courseService.updateCourse(this.course._id, courseToUpdate)
                .subscribe(res =>
                {
                    this.onCourseUpdated.emit({ course: { _id: this.course._id, ...courseToUpdate } });
                    this.showCourseUpdatedSuccessNotification();
                    console.log(res.message);
                },
                error =>
                {
                    this.onCourseError.emit({ course: { _id: this.course._id, ...courseToUpdate } });
                    console.log(error.json().message);

                    this.showCourseUpdatedErrorNotification();
                    console.log(error);
                });
            }
        }
    }
    resetCourseData()
    {
        this.title      = undefined;
        this.duration   = undefined;
        this.hours      = undefined;
        this.price      = undefined;
        this.oldPrice   = undefined;
        this.startDate  = undefined;
        this.isBooked   = false;
        this.videoUrl   = undefined;
        this.categoryId = undefined;
    }
    
    getCategories()
    {        
        this.categoriesService.getCategories()
        .subscribe(
            res =>
            {                
                this.categories = res;
            },
            err =>
            {
                console.log(err);
                this.notifications.create(
                  'error',
                  'Error',
                  'No se han podido obtener las categorías.'
                );
            }
        );
    }
    
    showCourseUpdatedSuccessNotification()
    {
        this.notifications.create(
          'success',
          'Curso actualizado',
          `El curso "${this.course.title}" ha sido actualizado`
        );
    }
    showCourseUpdatedErrorNotification(course?)
    {
        let message = (course != null) ? `El curso "${course.title}" no ha podido actualizarse` : 'El curso no ha podido actualizarse';
        
        this.notifications.create(
          'error',
          'Error',
          message
        );
    }
}