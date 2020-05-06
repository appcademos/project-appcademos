import { Component, OnInit, Input } from '@angular/core'
import { UtilsService } from '../../../services/utils.service'
import { UserSessionService } from '../../../services/userSession.service'
import { NzMessageService } from 'ng-zorro-antd'
import { MessageService } from '../../../services/message.service'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-course-card',
  templateUrl: './course-card.component.html',
  styleUrls: ['./course-card.component.scss']
})
export class CourseCardComponent implements OnInit
{
    @Input() course: any

    average: number
    params: any = []
    loginSubscription: Subscription

    lottieConfig =
    {
        path: '../../../assets/public/lottie/heart.json',
        autoplay: false,
        loop: false
    }
    heartAnimation: any
    isFavorite: boolean = null
    isSending: boolean = false

    constructor(private utils : UtilsService,
                private usersService: UserSessionService,
                private messageService: MessageService,
                private notificationMessages: NzMessageService)
    {
        
    }

    ngOnInit()
    {
        this.average = this.calcReviewGrade(this.course.academy.reviews)
        this.params = this.getUrlLinkParams()
        this.isFavorite = this.usersService.hasFavorite(this.course._id)
        
        this.listenToLoginEvents()
    }
    ngOnDestroy()
    {
        if (this.loginSubscription != null)
            this.loginSubscription.unsubscribe()
    }
    
    listenToLoginEvents()
    {
        this.loginSubscription = this.messageService.getMessage()
        .subscribe((message) =>
        {
            if (typeof message.user != 'undefined')
            {                
                // Login
                if (message.user != null)
                {
                    if (!this.isFavorite)
                    {
                        this.isFavorite = this.usersService.hasFavorite(this.course._id)
                        if (this.isFavorite)
                            this.playHeartAnimation()
                    }
                }
                else // Logout
                {
                    this.isFavorite = false
                    this.resetHeartAnimation()
                }
            }
        });
    }

    calcReviewGrade(reviews)
    {
        let average = 0;
        reviews.forEach(review =>
        {
            average += review.grade;
        });
        this.average = average / reviews.length;

        return this.average;
    }
    
    getUrlLinkParams()
    {
        let params = []
        let i = 0;

        if (this.course.category != null && this.course.category.name.length > 0 &&
            this.course.academy != null && this.course.academy.name.length > 0)
        {
            params[i++] = '/cursos-ingles';
            params[i++] = this.utils.queryCategoryToUrl(this.course.category.name.toLowerCase());
            params[i++] = 'academia-' + this.course.academy.name.replace(/ /g, '-').toLowerCase() + '-madrid';
            params[i++] = this.course._id;
        }
        else
        {
            params[0] = '/cursos-ingles';
            params[1] = 'curso';
            params[2] = this.course._id;
        }

        return params;
    }
    
    onClickHeart(event)
    {
        event.stopPropagation()
        event.preventDefault()
        
        if (this.isSending)
            return
        
        if (this.usersService.user == null)
        {
            this.messageService.sendMessage({ showFavoritesLogin: true })
            return
        }
        
        if (this.isFavorite == null || !this.isFavorite)
        {
            this.sendAddFavorite()
            this.playHeartAnimation()
            this.isFavorite = true
        }
        else if (this.isFavorite)
        {
            this.sendRemoveFavorite()
            this.reverseHeartAnimation()
            this.isFavorite = false
        }
    }
    handleHeartAnimation(anim: any)
    {
        this.heartAnimation = anim
        
        if (this.isFavorite)
            this.playHeartAnimation()
    }
    reverseHeartAnimation()
    {
        if (this.heartAnimation != null)
        {
            this.heartAnimation.goToAndStop(30, true)
            this.heartAnimation.setSpeed(3)
            this.heartAnimation.setDirection(-1)
            this.heartAnimation.play()
        }
    }
    playHeartAnimation()
    {
        if (this.heartAnimation != null)
        {
            this.heartAnimation.setSpeed(2)
            this.heartAnimation.setDirection(1)
            this.heartAnimation.play()
        }
    }
    resetHeartAnimation()
    {
        if (this.heartAnimation != null)
        {
            this.heartAnimation.goToAndStop(0, true)
        }
    }
    
    sendAddFavorite()
    {
        this.isSending = true

        this.usersService.addFavorite(this.course._id)
        .subscribe((res) =>
        {
            this.isSending = false
            
            setTimeout(() =>
            {
                this.notificationMessages
                .create('success',
                        'Se ha guardado el curso en tus favoritos')
            }, 500)
        },
        (error) =>
        {
            this.isSending = false
            
            let message = 'No se ha podido añadir el favorito. Inténtalo de nuevo'
            
            if (error.status === 409)
                message = 'Ya tienes este favorito guardado'
            else
            {
                this.reverseHeartAnimation()
                this.isFavorite = false
            }
            
            setTimeout(() =>
            {
                this.notificationMessages
                .create('error',message)
            }, 500)
        })
    }
    sendRemoveFavorite()
    {
        this.isSending = true
        
        this.usersService.removeFavorite(this.course._id)
        .subscribe((res) =>
        {
            this.isSending = false
            
            setTimeout(() =>
            {
                this.notificationMessages
                .create('success',
                        'Se ha eliminado el curso de tus favoritos')
            }, 500)
        },
        (error) =>
        {
            this.isSending = false
            
            this.playHeartAnimation()
            this.isFavorite = true
            
            setTimeout(() =>
            {
                this.notificationMessages
                .create('error',
                        'No se ha podido eliminar el favorito. Inténtalo de nuevo')
            }, 500)
        })
    }
}
