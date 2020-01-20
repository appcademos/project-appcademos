import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserSessionService } from '../../../services/userSession.service';
import { CategoriesService } from '../../../services/categories.service';
import { AcademySessionService } from '../../../services/academySession.service';
import { MessageService } from '../../../services/message.service';
import { Router } from "@angular/router";
import { NzNotificationService, NzModalService } from 'ng-zorro-antd';

@Component({
  selector: 'app-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.scss']
})
export class ManagerComponent implements OnInit, OnDestroy
{
    user = null
    categories = []
    academies = []
    selectedCategory = { name: '', forYouIf: '', coursesInfo: '' }
    sendingCategory = false
    refreshingCategories = false
    categoriesExpanded = false
    gettingAcademies = false
    
    messageServiceSubscription = null
    
    showCreateAcademyModal = false
    
    constructor(private router: Router,
                private userService: UserSessionService,
                private categoriesService: CategoriesService,
                private academyService: AcademySessionService,
                private notifications: NzNotificationService,
                private messageService: MessageService)
    {
        
    }

    ngOnInit() 
    {
        this.getUser();
        
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
                    
                    if (this.user.role === 'admin')
                    {
                        this.getCategories();
                        this.getAcademies();
                    }
                    else if (this.user.role === 'academy')
                    {
                        this.getAcademy();
                    }
                    else
                    {
                        this.router.navigate(["/"]);
                    }
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
    getCategories()
    {
        this.refreshingCategories = true;
        
        this.categoriesService.getCategories()
        .subscribe(
            res =>
            {                
                if (res != null)
                {
                    this.categories = res;
                    
                    if (this.categories != null && this.categories.length > 0)
                        this.selectedCategory = this.categories[0];
                }
                
                this.refreshingCategories = false;
            },
            err =>
            {
                console.log(err);
                this.refreshingCategories = false;
                this.notifications.create(
                  'error',
                  'Error',
                  'No se han podido obtener las categorías.'
                );
            }
        );
    }
    getAcademies()
    {
        this.gettingAcademies = true;
        
        this.academyService.getAcademies()
        .subscribe(
            res =>
            {                           
                if (res != null)
                    this.academies = res;
                
                this.gettingAcademies = false;
            },
            err =>
            {
                console.log(err);
                this.gettingAcademies = false;
                this.notifications.create(
                  'error',
                  'Error',
                  'No se han podido obtener las academias.'
                );
            }
        );
    }
    getAcademy()
    {        
        this.academyService.getAcademy()
        .subscribe(
            res =>
            {               
                this.router.navigate(["/manager/academy/", res._id]);
            },
            err =>
            {
                console.log(err);
                this.notifications.create(
                  'error',
                  'Error',
                  'No se ha podido obtener la academia.'
                );
            }
        );
    }
    
    sendCategory()
    {
        this.sendingCategory = true;
        
        this.categoriesService.updateCategory(this.selectedCategory)
        .subscribe(
            res =>
            {                
                this.sendingCategory = false;
                this.notifications.create(
                  'success',
                  `Categoría ${this.selectedCategory.name}`,
                  'La categoría se ha actualizado.'
                );
            },
            err =>
            {
                console.log(err);
                this.sendingCategory = false;
                this.notifications.create(
                  'error',
                  `Error`,
                  `La categoría ${this.selectedCategory.name} no se ha actualizado.`
                );
            }
        );
    }
    
    onAcademyCreated()
    {
        this.showCreateAcademyModal = false;
        this.getAcademies();
    }
    
    logout()
    {
        this.userService.logout()
        .subscribe(
            () =>
            {
                this.router.navigate(["/"]);
            },
            error =>
            {
                alert(error);
            }
        );
    }
}
