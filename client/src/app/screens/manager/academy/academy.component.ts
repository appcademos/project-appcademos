import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserSessionService } from '../../../../services/userSession.service';
import { AcademySessionService } from '../../../../services/academySession.service';
import { CoursesService } from '../../../../services/courses.service';
import { MessageService } from '../../../../services/message.service';
import { UtilsService } from '../../../../services/utils.service';
import { Router, ActivatedRoute } from "@angular/router";
import { NzNotificationService } from 'ng-zorro-antd';
import * as moment from 'moment';
declare var $: any;

@Component({
  selector: 'app-academy',
  templateUrl: './academy.component.html',
  styleUrls: ['./academy.component.scss']
})
export class AcademyComponent implements OnInit, OnDestroy
{
    user = null
    academy = null
    academyId = null
    
    academyInfoExpanded = false
    sendingAcademyInfo = false
    
    selectedCategory = { howAreTheClasses: '', material: '', syllabus: '', category: { name: '' }}
    refreshingCategories = false
    sendingCategories = false
    categoriesExpanded = false
    
    reviewsExpanded = false
    expandedReviewId = null
    
    editingCourse = null;
    updatedCourses = []
    errorCourses = []
    selectedCourses = []
    showMultipleEditor = false;
    
    messageServiceSubscription = null
    
    showCreateCourseModal = false
    deleteMode = false
    deletingCourseId = null
    
    constructor(private router: Router,
                private activatedRoute: ActivatedRoute,
                private userService: UserSessionService,
                private academyService: AcademySessionService,
                private notifications: NzNotificationService,
                private messageService: MessageService,
                private courseService: CoursesService,
                private utils: UtilsService)
    {
        
    }

    ngOnInit()
    {
        this.activatedRoute.params.subscribe(params =>
        {            
            if (params.id && params.id.length > 0)
            {
                this.academyId = params.id;
                this.getUser();
            }
            else
                this.router.navigate(["/manager"]);
        });
        
        this.messageServiceSubscription = this.messageService.getMessage()
        .subscribe((message) =>
        {
            // Send to home if logout
            if (typeof message.user != 'undefined')
            {
                if (message.user == null)
                    this.router.navigate(['/']);
            }
        });
    }
    ngOnDestroy()
    {
        this.messageServiceSubscription.unsubscribe();
    }
    
    getUser()
    {
        this.userService.isLoggedIn()
        .subscribe(
            res =>
            {
                if (res != null)
                {
                    this.user = res;
                    
                    if (this.user.role === 'admin' || this.user.role === 'academy')
                    {
                        this.getAcademy();
                    }
                    else
                        this.router.navigate(["/"]);
                }
                else
                    this.router.navigate(["/"]);
            },
            err =>
            {
                console.log(err);
                
                this.router.navigate(["/"]);
                
                this.notifications.create(
                  'error',
                  'Error',
                  'Error de login'
                );
            }
        );
    }
    getAcademy()
    {
        this.academyService.getAcademy(this.academyId)
        .subscribe(
            res =>
            {                
                this.refreshingCategories = false;
                
                if (res != null)
                {
                    this.academy = res;
                    this.selectedCategory = this.academy.categories[0];
                }
                else
                    this.router.navigate(["/manager"]);
            },
            err =>
            {
                console.log(err);
                this.refreshingCategories = false;
                
                this.router.navigate(["/manager"]);
                
                this.notifications.create(
                  'error',
                  'Error',
                  'No se pudo obtener la academia'
                );
            }
        );
    }
    
    sendAcademyInfo()
    {
        this.sendingAcademyInfo = true;
        
        let academy = { whyChooseMe: this.academy.whyChooseMe }
        
        this.academyService.updateAcademy(this.academyId, academy).subscribe(
            res =>
            {
                this.sendingAcademyInfo = false;
                
                this.notifications.create(
                  'success',
                  'Info Academia',
                  'La información de academia se ha guardado'
                );
            },
            err =>
            {
                console.log(err);
                this.sendingAcademyInfo = false;
                
                this.notifications.create(
                  'error',
                  'Error',
                  'No se ha podido guardar la información de academia'
                );
            }
        );
    }
    
    refreshCategories()
    {
        this.refreshingCategories = true;
        this.getAcademy();
    }
    sendCategories()
    {
        this.sendingCategories = true;
        
        let academy = { categories: JSON.parse(JSON.stringify(this.academy.categories)) };
        academy.categories.forEach(category =>
        {
            let categoryId = category.category._id;
            category.category = categoryId;
        });
        
        this.academyService.updateAcademy(this.academyId, academy).subscribe(
            res =>
            {
                this.sendingCategories = false;
                
                this.notifications.create(
                  'success',
                  'Categorías guardadas',
                  'Las categorías se han guardado'
                );
            },
            err =>
            {
                console.log(err);
                this.sendingCategories = false;
                
                this.notifications.create(
                  'error',
                  'Error',
                  'No se pudieron guardar las categorías'
                );
            }
        );
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
        let isToday = m.isSame(now, 'day');

        return (isToday) ? 'hoy ' + m.format('HH:mm') : m.format('DD-MM-YYYY HH:mm');
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
    
    onCourseCreated()
    {
        this.showCreateCourseModal = false;
        this.getAcademy();
    }
    
    onClickDeleteCourse(event)
    {
        event.stopPropagation();
    }
    sendDeleteCourse(courseId)
    {
        this.deletingCourseId = courseId;
        
        this.courseService.deleteCourse(courseId).subscribe(
            res =>
            {
                this.getAcademy();
                
                this.notifications.create(
                  'success',
                  'Curso eliminado',
                  null
                );
                
                this.deletingCourseId = null;
            },
            err =>
            {
                this.notifications.create(
                  'error',
                  'No se pudo eliminar el curso',
                  null
                );
                
                this.deletingCourseId = null;
            }
        );
    }
    
    onReviewDeleted(review)
    {
        if (review.create)
        {
            let index = this.academy.reviews.indexOf(review);
            this.academy.reviews.splice(index, 1);
        }
        else
            this.getAcademy();
    }
    onCreateNewReviewItem()
    {
        this.academy.reviews.push(
        {
            description: 'Nueva opinión',
            grade: 0,
            created_at: this.utils.randomDate().toISOString(),
            create: true
        });
    }
}
