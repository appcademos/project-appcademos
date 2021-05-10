import { Component, Input, Output, EventEmitter, Inject } from '@angular/core'
import { UtilsService } from '../../../services/utils.service'
import { DOCUMENT } from '@angular/common'

@Component({
  selector: 'app-favorites-tutorial',
  templateUrl: './favorites-tutorial.component.html',
  styleUrls: ['./favorites-tutorial.component.scss']
})
export class FavoritesTutorialComponent
{
    @Input() visible: boolean = false
    @Output() onClose = new EventEmitter()
    
    constructor(private utils: UtilsService,
                @Inject(DOCUMENT) private document: Document)
    {
        
    }
    
    ngOnChanges(changes)
    {
        if (changes.visible != null)
        {
            if (changes.visible.currentValue)
            {
                this.utils.scrollToElement('header')
                this.document.body.style.overflow = 'hidden'
            }
            else
                this.document.body.style.overflow = 'unset'
        }
    }
    
    close()
    {
        this.onClose.emit()
    }
}
