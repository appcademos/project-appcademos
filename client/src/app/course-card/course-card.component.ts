import { Component, OnInit, Input } from '@angular/core';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: 'app-course-card',
  templateUrl: './course-card.component.html',
  styleUrls: ['./course-card.component.scss']
})
export class CourseCardComponent implements OnInit
{
     @Input() course: any;
     average: number;
     params: any = []

    constructor(private utils : UtilsService)
    {
        
    }

    ngOnInit()
    {
        this.average = this.calcReviewGrade(this.course.academy.reviews);
        this.params = this.getUrlLinkParams();
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
}
