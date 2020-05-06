import { Component, Input, Output, EventEmitter } from '@angular/core'
import { UtilsService } from '../../../services/utils.service'

@Component({
  selector: 'app-favorites-tutorial',
  templateUrl: './favorites-tutorial.component.html',
  styleUrls: ['./favorites-tutorial.component.scss']
})
export class FavoritesTutorialComponent
{
    @Input() visible: boolean = false
    @Output() onClose = new EventEmitter()
    
    constructor(private utils: UtilsService)
    {
        
    }
    
    ngOnChanges(changes)
    {
        if (changes.visible != null)
        {
            if (changes.visible.currentValue)
            {
                this.utils.scrollToElement('header')
                document.body.style.overflow = 'hidden'
            }
            else
                document.body.style.overflow = 'unset'
        }
    }
    
    close()
    {
        this.onClose.emit()
    }
}
