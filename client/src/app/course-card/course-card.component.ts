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

    constructor() { }

    ngOnInit()
    {
        this.average = this.calcReviewGrade(this.course.academy.reviews);
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
}
