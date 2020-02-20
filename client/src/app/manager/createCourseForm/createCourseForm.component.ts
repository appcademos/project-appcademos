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
    @Input() createMode: any;
    @Input() academyId: string;
    
    @Output() onCourseUpdated: EventEmitter<any> = new EventEmitter();
    @Output() onCourseError: EventEmitter<any> = new EventEmitter();
    @Output() onCoursesUpdated: EventEmitter<any> = new EventEmitter();
    @Output() onCourseCreated: EventEmitter<any> = new EventEmitter();

    mainButtonText: string;

    price: Number;
    duration: String;
    oldPrice: Number;
    title: String;
    hours: Number;
    weekClasses: Number;
    startDate: String;
    isBooked: boolean;
    videoUrl: String;
    sizeClass: Number;
    description: String;
    tags: [String];
    categoryId: String;
    group = []
    images = []
    hidden: boolean = false;

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
            this.group      = this.course.group;
            this.weekClasses = this.course.weekclasses;
            this.price      = this.course.price;
            this.oldPrice   = this.course.oldPrice;
            this.startDate  = moment(this.course.startDate).format('DD/MM/YYYY');
            this.isBooked   = this.course.isBooked ? this.course.isBooked : false;
            this.videoUrl   = this.course.videoUrl;
            this.categoryId = this.course.category._id;
            this.group      = this.course.group;
            this.images     = this.course.images;
            this.sizeClass  = this.course.sizeClass;
            this.hidden     = (this.course.hidden != null) ? this.course.hidden : null;
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
    onChangeHidden(hidden)
    {
        this.hidden = hidden;
    }
    onPressMainButton()
    {
        if (this.createMode)
        {
            this.createCourse();
        }
        else
        {
            this.updateCourse();
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
        if (this.weekClasses == null || (this.weekClasses + '').length == 0)
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
        
        if (this.createMode)
        {
            let images = this.filterEmptyStringsArray(this.images);
            if (images == null || images.length == 0)
            {
                allOk = false;
            }
        }

        if (!allOk)
        {
            this.notifications.create(
              'error',
              'Error',
               `Rellena correctamente todos los datos`
            );
        }

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
                
            if (this.weekClasses != null && (this.weekClasses + '').length > 0)
                courseDataToUpdate.weekclasses = this.weekClasses;

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
                
            if (this.sizeClass != null && (this.sizeClass + '').length > 0)
                courseDataToUpdate.sizeClass = this.sizeClass;
                
            if (this.hidden != null)
                courseDataToUpdate.hidden = this.hidden;
            
            let group = this.filterEmptyStringsArray(this.group);
            if (group != null && group.length > 0)
                courseDataToUpdate.group = group;
                
            let images = this.filterEmptyStringsArray(this.images);
            if (images != null && images.length > 0)
                courseDataToUpdate.images = images;
            

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
                    weekclasses: this.weekClasses,
                    price: this.price,
                    oldPrice: this.oldPrice,
                    startDate: moment(this.startDate + '', 'DD/MM/YYYY').toISOString(),
                    academy: this.course.academy,
                    isBooked: this.isBooked,
                    videoUrl: (this.videoUrl != null && this.videoUrl.trim().length > 0) ? this.videoUrl : null,
                    category: this.categoryId,
                    group: this.filterEmptyStringsArray(this.group),
                    images: this.filterEmptyStringsArray(this.images),
                    sizeClass: this.sizeClass,
                    hidden: this.hidden
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
    createCourse()
    {
        if (this.validateCourse())
        {
            var courseToCreate =
            {
                title: this.title,
                duration: this.duration,
                hours: this.hours,
                weekclasses: this.weekClasses,
                price: this.price,
                oldPrice: this.oldPrice,
                startDate: moment(this.startDate + '', 'DD/MM/YYYY').toISOString(),
                isBooked: this.isBooked,
                videoUrl: (this.videoUrl != null && this.videoUrl.trim().length > 0) ? this.videoUrl : null,
                category: this.categoryId,
                group: this.filterEmptyStringsArray(this.group),
                images: this.filterEmptyStringsArray(this.images),
                sizeClass: (this.sizeClass != null && ('' + this.sizeClass).trim().length > 0) ? this.sizeClass : null,
                academy: this.academyId,
                hidden: this.hidden
            }
            
            console.log(courseToCreate);

            this.courseService.createCourse(courseToCreate)
            .subscribe(res =>
            {
                this.onCourseCreated.emit();
                this.showCourseCreatedSuccessNotification();
                
                console.log(res);
            },
            error =>
            {
                console.log(error);

                this.showCourseCreatedErrorNotification();
            });
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
        this.sizeClass  = undefined;
        this.group      = []
        this.images     = []
        this.hidden     = false;
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
    
    showCourseCreatedSuccessNotification()
    {
        this.notifications.create(
          'success',
          'Curso creado',
          `El curso "${this.title}" ha sido creado`
        );
    }
    showCourseCreatedErrorNotification()
    {        
        this.notifications.create(
          'error',
          'Error',
           `El curso "${this.title}" no ha podido crearse`
        );
    }
    
    filterEmptyStringsArray(arr)
    {
        let filteredArray = null;
        
        if (arr != null)
        {
             filteredArray = arr.filter((item) => (('' + item).trim().length > 0));
        }
        
        return filteredArray;
    }
}