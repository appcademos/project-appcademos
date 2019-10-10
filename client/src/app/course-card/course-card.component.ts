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

        if (this.course.academy.district != null && this.course.academy.district.length > 0 &&
            this.course.academy.city     != null && this.course.academy.city.length > 0 &&
            this.course.academy.material != null && this.course.academy.material.length > 0 &&
            this.course.academy.theme    != null && this.course.academy.theme.length > 0 &&
            this.course.academy.objetive != null && this.course.academy.objetive.length > 0 &&
            this.course.academy.level    != null && this.course.academy.level.length > 0 &&
            this.course.academy.inforcourse != null && this.course.academy.infocourse.length >0 &&
            this.course.academy.exam != null && this.course.academy.exam.length >0 &&
            this.course.academy.examresults != null && this.course.academy.examresults >0 &&
            this.course.academy.howareclasses != null && this.course.academy.howareclasses >0 )
            //&& this.course.duration         != null)
        {
            params[0]  = '/course';
            params[1]  = this.course.tags[0];
           // params[2]  = this.course.duration.replace(/ /g, '');
            params[2]  = this.course.academy.district.toLowerCase() + '-' + this.course.academy.city.toLowerCase();
            params[3]  = 'academia-' + this.course.academy.name.replace(/ /g, '-').toLowerCase();
            params[4]  = 'material' + this.course.academy.material.replace(/ /g, '-').toLowerCase();
            params[5]  = 'theme' + this.course.academy.theme.replace(/ /g, '-').toLowerCase();
            params[6]  = 'level' + this.course.academy.level.replace(/ /g, '-').toLowerCase();
            params[7]  = 'objetive' + this.course.academy.objetive.replace(/ /g, '-').toLowerCase();
            params[8]  = 'infocourse' + this.course.academy.infocourse.replace(/ /g, '-').toLowerCase();
            params[9] = 'exam' + this.course.academy.exam.replace(/ /g, '-').toLowerCase();
            params[10] = 'examresults' + this.course.academy.examresults.replace(/ /g, '-').toLowerCase();
            params[10] = 'howareclasses' + this.course.academy.howareclasses.replace(/ /g, '-').toLowerCase();
           // params[11] = 'foryouif' + this.course.academy.foryouif.replace(/ /g, '-').toLowerCase();
            params[12] = this.course._id;
            
        }
        else
        {
            params[0] = '/course';
            params[1] = this.course._id;
        }

        return params;
    }
}
