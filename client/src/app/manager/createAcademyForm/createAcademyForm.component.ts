import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AcademySessionService } from '../../../services/academySession.service';
import { Router } from "@angular/router";
import * as moment from 'moment';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzNotificationService } from 'ng-zorro-antd';

@Component({
  selector: 'app-createAcademyForm',
  templateUrl: './createAcademyForm.component.html',
  styleUrls: ['./createAcademyForm.component.scss']
})
export class CreateAcademyFormComponent implements OnInit
{    
    @Input() academy: any;
    @Input() createMode: any;
    
    @Output() onAcademyError: EventEmitter<any> = new EventEmitter();
    @Output() onAcademyCreated: EventEmitter<any> = new EventEmitter();

    name: string;
    address: string;
    latitude: string;
    longitude: string;
    district: string;
    city: string;
    
    loading = false

    constructor(public router: Router,
                private academyService: AcademySessionService,
                private notifications: NzNotificationService) { }

    ngOnInit()
    {
        
    }
    
    onPressMainButton()
    {
        if (this.createMode)
        {
            this.createAcademy();
        }
        else
        {
            //this.updateCourse();
        }
    }

    validateAcademy()
    {
        var allOk = true;

        if (this.name == null || this.name.trim().length == 0)
        {
            allOk = false;
        }
        if (this.address == null || this.address.trim().length == 0)
        {
            allOk = false;
        }
        if (this.latitude == null || this.latitude.trim().length == 0)
        {
            allOk = false;
        }
        if (this.longitude == null || this.longitude.trim().length == 0)
        {
            allOk = false;
        }
        if (this.district == null || this.district.trim().length == 0)
        {
            allOk = false;
        }
        if (this.city == null || this.city.trim().length == 0)
        {
            allOk = false;
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
    /*
    updateCourse()
    {
        if (this.courses != null && this.courses.length > 1)
        {
            var courseDataToUpdate: any = {}

            if (this.name != null && this.name.trim().length > 0)
                courseDataToUpdate.name = this.name.trim();

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
            if (this.validateAcademy())
            {
                var courseToUpdate =
                {
                    name: this.name,
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
                    sizeClass: this.sizeClass
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
    */
    createAcademy()
    {
        if (this.validateAcademy())
        {
            var academyToCreate =
            {
                name: this.name.trim(),
                address: this.address.trim(),
                location:
                {
                    coordinates: [ parseFloat(this.latitude.trim()), parseFloat(this.longitude.trim()) ]
                },
                district: this.district.trim(),
                city: this.city.trim()
            }
            
            console.log(academyToCreate);

            this.loading = true

            this.academyService.createAcademy(academyToCreate)
            .subscribe(res =>
            {
                this.loading = false
                
                this.onAcademyCreated.emit();
                this.showAcademyCreatedSuccessNotification();
                
                console.log(res);
            },
            error =>
            {
                this.loading = false

                this.showAcademyCreatedErrorNotification();
                
                console.log(error);
            });
        }
    }
    /*
    resetCourseData()
    {
        this.name      = undefined;
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
    }
    
    
    showCourseUpdatedSuccessNotification()
    {
        this.notifications.create(
          'success',
          'Curso actualizado',
          `El curso "${this.course.name}" ha sido actualizado`
        );
    }
    showCourseUpdatedErrorNotification(course?)
    {
        let message = (course != null) ? `El curso "${course.name}" no ha podido actualizarse` : 'El curso no ha podido actualizarse';
        
        this.notifications.create(
          'error',
          'Error',
          message
        );
    }
    */
    
    showAcademyCreatedSuccessNotification()
    {
        this.notifications.create(
          'success',
          'Curso creado',
          `La academia "${this.name}" ha sido creada`
        );
    }
    showAcademyCreatedErrorNotification()
    {        
        this.notifications.create(
          'error',
          'Error',
           `La academia "${this.name}" no ha podido crearse`
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