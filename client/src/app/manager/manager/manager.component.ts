import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UserSessionService } from '../../../services/userSession.service';
import { CategoriesService } from '../../../services/categories.service';
import { AcademySessionService } from '../../../services/academySession.service';
import { Router } from "@angular/router";
import { NzNotificationService, NzModalService } from 'ng-zorro-antd';

@Component({
  selector: 'app-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.scss']
})
export class ManagerComponent implements OnInit
{
    user = null
    categories = []
    academies = []
    selectedCategory = { name: '', forYouIf: '', coursesInfo: '' }
    sendingCategory = false
    refreshingCategories = false
    categoriesExpanded = false
    gettingAcademies = false
    
    constructor(private router: Router,
                private userService: UserSessionService,
                private categoriesService: CategoriesService,
                private academyService: AcademySessionService,
                private notifications: NzNotificationService)
    {
        
    }

    ngOnInit() 
    {
        this.getUser();
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
                console.log(res);
                           
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
                  `la categoría ${this.selectedCategory.name} no se ha actualizado.`
                );
            }
        );
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
