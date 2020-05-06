import { Component, OnInit, OnDestroy } from '@angular/core'
import { UserSessionService } from '../../../services/userSession.service'
import { MessageService } from '../../../services/message.service'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit, OnDestroy
{
    favorites = []
    loginSubscription: Subscription
    
    constructor(private usersService: UserSessionService,
                private messageService: MessageService)
    {
        this.usersService.isLoggedIn().subscribe()
    }

    ngOnInit()
    {
        this.messageService.sendMessage({ showFavoritesTutorial: false })
        
        if (this.usersService.user != null)
            this.favorites = [...this.usersService.user.favorites]
        
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
                    if (this.usersService.user.favorites.length !== this.favorites.length)
                    {
                        this.favorites = [...this.usersService.user.favorites]
                    }
                }
                else // Logout
                {
                    this.favorites = []
                }
            }
        })
    }
    showFavoritesLogin()
    {
        this.messageService.sendMessage({ showFavoritesLogin: true })
    }
}
