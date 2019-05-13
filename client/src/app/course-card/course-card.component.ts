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
            this.course.academy.city     != null && this.course.academy.city.length > 0)
        {
            params[0] = '/course';
            params[1] = this.course.tags[0];
            params[2] = this.course.duration.replace(/ /g, '');
            params[3] = this.course.academy.district.toLowerCase() + '-' + this.course.academy.city.toLowerCase();
            params[4] = 'academia-' + this.course.academy.name.replace(/ /g, '-').toLowerCase();
            params[5] = this.course._id;
        }
        else
        {
            params[0] = '/course';
            params[1] = this.course._id;
        }

        return params;
    }
}
