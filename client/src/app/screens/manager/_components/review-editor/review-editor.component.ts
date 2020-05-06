import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import * as moment from 'moment';
import { AcademySessionService } from '../../../../../services/academySession.service';
import { NzNotificationService } from 'ng-zorro-antd';

@Component({
  selector: 'app-review-editor',
  templateUrl: './review-editor.component.html',
  styleUrls: ['./review-editor.component.scss']
})
export class ReviewEditorComponent implements OnInit
{
    @Input() review: any;
    @Input() expanded: boolean;
    @Input() academyId: string;
    
    @Output() onExpand = new EventEmitter();
    @Output() onReviewUpdated = new EventEmitter();
    @Output() onReviewDeleted = new EventEmitter();
    @Output() onReviewCreated = new EventEmitter();
    
    loading: boolean = false
    
    
    constructor(private academyService: AcademySessionService,
                private notifications: NzNotificationService)
    {
    
    }

    ngOnInit()
    {
    
    }
    
    onClickExpand()
    {
        this.onExpand.emit();
    }
    onDateChanged(newDateText)
    {
        let tempDate = moment(newDateText, 'DD/MM/YYYY');
        
        if (newDateText != null &&
            newDateText.length == 10 &&
            tempDate.isValid())
        {
            this.review.created_at = tempDate.toISOString();
        }
    }
    onClickSave()
    {
        if (this.review.create)
            this.sendCreateReview();
        else
            this.sendUpdateReview();
    }
    onClickDelete()
    {
        if (this.review.create)
            this.onReviewDeleted.emit(this.review);
        else
        {
            this.loading = true;
            
            this.academyService.deleteReview(this.review._id).subscribe(
            res =>
            {
                this.loading = false;
                
                this.notifications.create(
                  'success',
                  'Opinión eliminada',
                  null
                );
                
                this.onReviewDeleted.emit(this.review);
            },
            err =>
            {
                this.loading = false;
                
                this.notifications.create(
                  'error',
                  'No se pudo eliminar la opinión',
                  null
                );
            });
        }
    }
    
    sendUpdateReview()
    {
        this.loading = true;
        
        let reviewToSave = {...this.review}
        delete reviewToSave._id;
        delete reviewToSave.updated_at;
        delete reviewToSave.create;
        
        this.academyService.updateReview(this.review._id, reviewToSave).subscribe(
        res =>
        {
            this.loading = false;
            
            this.notifications.create(
              'success',
              'Opinión guardada',
              null
            );
            
            this.onReviewUpdated.emit(this.review);
        },
        err =>
        {
            this.loading = false;
            
            this.notifications.create(
              'error',
              'No se pudo guardar la opinión',
              null
            );
        });
    }
    sendCreateReview()
    {
        this.loading = true;
        
        let reviewToCreate = {...this.review}
        delete reviewToCreate.create;
        
        this.academyService.createReview(this.academyId, reviewToCreate).subscribe(
        res =>
        {
            this.loading = false;
            
            this.notifications.create(
              'success',
              'Opinión creada',
              null
            );
            
            this.onReviewCreated.emit(this.review);
        },
        err =>
        {
            this.loading = false;
            
            this.notifications.create(
              'error',
              'No se pudo crear la opinión',
              null
            );
        });
    }
    
    camelCaseToWords(camelCaseStr)
    {
        var temp = camelCaseStr.split('_');
        if (temp.length > 1)
            temp[1] = temp[1].charAt(0).toUpperCase() + temp[1].slice(1);
        temp = temp.join('');
        var result = temp.replace( /([A-Z])/g, " $1" );
        var finalResult = result.charAt(0).toUpperCase() + result.slice(1);
        
        return finalResult;
    }
    formatDate(isoStringDate)
    {
        return moment(isoStringDate).format('DD/MM/YYYY');
    }
}
