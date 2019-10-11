import { Component, OnInit, Input } from '@angular/core';

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

    constructor() { }

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

        if (this.course.academy.district != null && this.course.academy.district.length > 0 &&
            this.course.academy.city     != null && this.course.academy.city.length > 0)
           
        {
            params[i++] = '/course';
            params[i++] = this.course.tags[0];
            params[i++] = this.course.duration.replace(/ /g, '');
            params[i++] = this.course.academy.district.toLowerCase() + '-' + this.course.academy.city.toLowerCase();
            params[i++] = 'academia-' + this.course.academy.name.replace(/ /g, '-').toLowerCase();
            params[i++] = this.course._id;
            
            if (this.course.academy.material != null)
                params[i++] = 'material-' + this.course.academy.material.replace(/ /g, '-').toLowerCase();
            if (this.course.academy.theme != null)
                params[i++] = 'theme-' + this.course.academy.theme.replace(/ /g, '-').toLowerCase();
            if(this.course.academy.level != null)
                params[i++]  = 'level' + this.course.academy.level.replace(/ /g, '-').toLowerCase();
            if (this.course.academy.objetive != null)
                params[i++]  = 'objetive' + this.course.academy.objetive.replace(/ /g, '-').toLowerCase();
            if (this.course.academy.infocourse != null)
                params[i++]  = 'infocourse' + this.course.academy.infocourse.replace(/ /g, '-').toLowerCase();
            if (this.course.academy.exam != null)
                params[i++] = 'exam' + this.course.academy.exam.replace(/ /g, '-').toLowerCase();
            if (this.course.academy.examresults != null)
                params[i++] = 'examresults' + this.course.academy.examresults.replace(/ /g, '-').toLowerCase();        
            if (this.course.academy.howareclasses != null)
                params[i++] = 'howareclasses' + this.course.academy.howareclasses.replace(/ /g, '-').toLowerCase();
            
         /*   if (this.course.academy.foryouif != null)
                params[i++] = 'foryouif' + this.course.academy.foryouif.replace(/ /g, '-').toLowerCase();
          */
        }
        else
        {
            params[0] = '/course';
            params[1] = this.course._id;
        }

        return params;
    }
}
