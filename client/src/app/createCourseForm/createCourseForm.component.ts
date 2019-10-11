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
    @Input() courses: any;
    @Output() onCourseUpdated: EventEmitter<any> = new EventEmitter();
    @Output() onCourseError: EventEmitter<any> = new EventEmitter();
    @Output() onCoursesUpdated: EventEmitter<any> = new EventEmitter();

    price: Number;
   // duration: String;
    oldPrice: Number;
    title: String;
    hours: Number;
    startDate: String;
    isBooked: boolean;
    videoUrl: String;
    sizeClass: Number;
    description: String;
    tags: [String];
    theme: [String];
    level: [String];
    objetive: [String];
    infocourse: [String];
    exam: [String];
    examresults: [String];
    material: [String];
    howareclasses: [String];
   // foryouif: [String];

    numCoursesUpdated = 0;

    constructor(public router: Router, private courseService: CoursesService) { }

    ngOnInit()
    {
        if (this.course)
        {    
            this.title         = this.course.title;
           // this.duration      = this.course.duration;
            this.hours         = this.course.hours;
            this.price         = this.course.price;
            this.oldPrice      = this.course.oldPrice;
            this.material      = this.course.material;
            this.theme         = this.course.theme;
            this.level         = this.course.level;
            this.objetive      = this.course.objetive;
            this.infocourse    = this.course.infocourse;
            this.exam          = this.course.exam;
            this.examresults   = this.course.examresults;
            this.howareclasses = this.course.howareclasses;
            //this.foryouif      = this.foryouif;
            this.startDate     = moment(this.course.startDate).format('DD/MM/YYYY');
            this.isBooked      = this.course.isBooked ? this.course.isBooked : false;
            this.videoUrl      = this.course.videoUrl;
        }
        else
        {
            this.isBooked = false;
        }
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
        /*if (this.duration == null || this.duration.length == 0)
        {
            allOk = false;
        }*/
        if (this.hours == null || (this.hours + '').length == 0)
        {
            allOk = false;
        }
        if (this.price == null || (this.price + '').length == 0)
        {
            allOk = false;
        }
        if(this.material == null || (this.material + '').length == 0){
            allOk = false;
        }
        if(this.theme == null || (this.theme + '').length == 0){
            allOk = false;
        }
        if(this.level == null || (this.level + '').length == 0){
            allOk = false;
        }
        if(this.objetive == null || (this.objetive + '').length == 0){
            allOk = false;
        }
        if(this.infocourse == null || (this.infocourse + '').length == 0){
            allOk = false;
        }
        if(this.exam == null || (this.exam + '').length == 0){
            allOk = false;
        }
        if(this.examresults == null || (this.examresults + '').length == 0){
            allOk = false;
        }

        if(this.howareclasses == null || (this.howareclasses + '').length == 0){
            allOk = false;
        }
        /*if(this.foryouif == null || (this.foryouif + '').length == 0){
            allOk = false;
        }*/



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
        if (this.courses != null && this.courses.length > 1)
        {
            var courseDataToUpdate: any = {}

            if (this.title != null && this.title.trim().length > 0)
                courseDataToUpdate.title = this.title.trim();
            /*
            if (this.duration != null && this.duration.trim().length > 0)
                courseDataToUpdate.duration = this.duration.trim();
            */
            if (this.hours != null && (this.hours + '').length > 0)
                courseDataToUpdate.hours = this.hours;

            if (this.price != null && (this.price + '').length > 0)
                courseDataToUpdate.price = this.price;

            if (this.oldPrice != null && (this.oldPrice + '').length > 0)
                courseDataToUpdate.oldPrice = this.oldPrice;

            if(this.material != null && (this.material + '').length >0)
                courseDataToUpdate.material = this.material;

            if(this.theme != null && (this.theme + '').length >0)    
                courseDataToUpdate.theme = this.theme;

            if(this.level != null && (this.level + '').length >0)
                courseDataToUpdate.level = this.level;

            if(this.objetive != null && (this.objetive + '').length >0)
                courseDataToUpdate.objetive = this.objetive;

            if(this.infocourse != null && (this.infocourse + '').length >0)
                courseDataToUpdate.infocourse = this.infocourse;

            if(this.exam != null && (this.exam + '').length >0)
                courseDataToUpdate.exam = this.exam;

            if(this.examresults != null && (this.examresults + '').length >0)
                courseDataToUpdate.examresults =this.examresults;

            if(this.howareclasses != null && (this.howareclasses + '').length >0)    
            courseDataToUpdate.howareclasses = this.howareclasses;
/*
            if(this.foryouif != null && (this.foryouif + '').length >0)    
            courseDataToUpdate.foryouif = this.foryouif;
*/

            if (this.startDate != null && this.startDate.trim().length > 0)
                courseDataToUpdate.startDate = moment(this.startDate + '', 'DD/MM/YYYY').toISOString();
        
            if (this.isBooked != null)
                courseDataToUpdate.isBooked = this.isBooked;
                
            if (this.videoUrl != null && this.videoUrl.trim().length > 0)
                courseDataToUpdate.videoUrl = this.videoUrl.trim();
            

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
                   // duration: this.duration,
                    hours: this.hours,
                    price: this.price,
                    oldPrice: this.oldPrice,
                    material: this.material,
                    theme: this.theme,
                    level: this.level,
                    objetive: this.objetive,
                    infocourse: this.infocourse,
                    exam: this.exam,
                    examresults: this.examresults,
                    howareclasses: this.howareclasses,
                  //  foryouif: this.foryouif,
                    startDate: moment(this.startDate + '', 'DD/MM/YYYY').toISOString(),
                    academy: this.course.academy,
                    isBooked: this.isBooked,
                    videoUrl: (this.videoUrl != null && this.videoUrl.trim().length > 0) ? this.videoUrl : null
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
    resetCourseData()
    {
        this.title         = undefined;
        //this.duration      = undefined;
        this.hours         = undefined;
        this.price         = undefined;
        this.oldPrice      = undefined;
        this.material      = undefined;
        this.theme         = undefined;
        this.level         = undefined;
        this.objetive      = undefined;
        this.infocourse    = undefined;
        this.exam          = undefined;
        this.examresults   = undefined;
        this.howareclasses = undefined;
      //  this.foryouif      = undefined;  
        this.startDate     = undefined;
        this.isBooked      = false;
        this.videoUrl      = undefined;
    }
}
